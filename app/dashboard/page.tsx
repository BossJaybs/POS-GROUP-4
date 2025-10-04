import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, BarChart3 } from "lucide-react"
import { SalesTrendChart } from "@/components/sales-trend-chart"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch summary data
  const { data: products } = await supabase.from("products").select("*").eq("user_id", user.id)

  const { data: sales } = await supabase.from("sales").select("*").eq("user_id", user.id)

  const totalProducts = products?.length || 0
  const totalSales = sales?.length || 0
  const totalRevenue =
    sales?.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount.toString()), 0).toFixed(2) || "0.00"

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentSales } = await supabase
    .from("sales")
    .select("sale_date, total_amount")
    .eq("user_id", user.id)
    .gte("sale_date", sevenDaysAgo.toISOString())
    .order("sale_date", { ascending: true })

  const salesByDay = new Map<string, { revenue: number; transactions: number }>()

  // Initialize last 7 days with zero values
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
    const dateKey = date.toISOString().split("T")[0]
    salesByDay.set(dateKey, { revenue: 0, transactions: 0 })
  }

  // Aggregate sales data
  recentSales?.forEach((sale) => {
    const dateKey = new Date(sale.sale_date).toISOString().split("T")[0]
    const existing = salesByDay.get(dateKey) || { revenue: 0, transactions: 0 }
    salesByDay.set(dateKey, {
      revenue: existing.revenue + Number.parseFloat(sale.total_amount.toString()),
      transactions: existing.transactions + 1,
    })
  })

  // Convert to chart data format
  const chartData = Array.from(salesByDay.entries()).map(([dateKey, data]) => {
    const date = new Date(dateKey)
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: Number(data.revenue.toFixed(2)),
      transactions: data.transactions,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Total Products</CardTitle>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Total Sales</CardTitle>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalSales}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Total Revenue</CardTitle>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalRevenue}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <SalesTrendChart data={chartData} />
        </div>

        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Manage your business operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/dashboard/inventory">
                <Button className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Button>
              </Link>
              <Link href="/dashboard/pos">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Process Sale
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { POSInterface } from "@/components/pos-interface"

export default async function POSPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .gt("stock_quantity", 0)
    .order("name", { ascending: true })

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Point of Sale</h1>
      <POSInterface products={products || []} userId={user.id} />
    </div>
  )
}

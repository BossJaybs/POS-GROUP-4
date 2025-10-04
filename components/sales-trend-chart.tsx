"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SalesTrendData {
  date: string
  revenue: number
  transactions: number
}

interface SalesTrendChartProps {
  data: SalesTrendData[]
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Sales Trend (Last 7 Days)</CardTitle>
        <CardDescription>Daily revenue and transaction count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue ($)",
              color: "hsl(var(--chart-1))",
            },
            transactions: {
              label: "Transactions",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs text-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis className="text-xs text-muted-foreground" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ fill: "var(--color-revenue)", r: 4 }}
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="var(--color-transactions)"
                strokeWidth={2}
                dot={{ fill: "var(--color-transactions)", r: 4 }}
                name="Transactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

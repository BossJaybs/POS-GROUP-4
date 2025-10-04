"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  user_id: string
}

export function EditProductForm({ product, userId }: { product: Product; userId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("products")
      .update({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        stock_quantity: Number.parseInt(formData.get("stock_quantity") as string),
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .eq("user_id", userId)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/inventory")
      router.refresh()
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Edit Product</CardTitle>
        <CardDescription>Update the product details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" required placeholder="Enter product name" defaultValue={product.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter product description (optional)"
                defaultValue={product.description || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                defaultValue={Number.parseFloat(product.price.toString()).toFixed(2)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                required
                placeholder="0"
                defaultValue={product.stock_quantity}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating Product..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

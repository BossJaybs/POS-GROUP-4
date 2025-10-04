"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
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

interface CartItem {
  product: Product
  quantity: number
}

export function POSInterface({ products, userId }: { products: Product[]; userId: string }) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      if (existingItem.quantity < product.stock_quantity) {
        setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((item) => item.product.id === productId)
    if (!item) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else if (newQuantity <= item.product.stock_quantity) {
      setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + Number.parseFloat(item.product.price.toString()) * item.quantity, 0)
  }

  const processSale = async () => {
    if (cart.length === 0) return

    setIsProcessing(true)
    const supabase = createClient()

    try {
      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          total_amount: calculateTotal(),
          user_id: userId,
        })
        .select()
        .single()

      if (saleError) throw saleError

      // Create sale items and update inventory
      for (const item of cart) {
        // Insert sale item
        const { error: itemError } = await supabase.from("sale_items").insert({
          sale_id: sale.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_sale: item.product.price,
          user_id: userId,
        })

        if (itemError) throw itemError

        // Update product stock
        const { error: updateError } = await supabase
          .from("products")
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity,
          })
          .eq("id", item.product.id)
          .eq("user_id", userId)

        if (updateError) throw updateError
      }

      // Clear cart and refresh
      setCart([])
      alert("Sale processed successfully!")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error processing sale:", error)
      alert("Error processing sale. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Products Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground text-lg md:text-xl">Available Products</CardTitle>
          <CardDescription className="text-sm md:text-base">Select products to add to cart</CardDescription>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm md:text-base">No products available</p>
          ) : (
            <div className="space-y-2 max-h-[400px] md:max-h-[600px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base truncate">{product.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Stock: {product.stock_quantity}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">
                      ${Number.parseFloat(product.price.toString()).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart Section */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-lg md:text-xl">Shopping Cart</CardTitle>
              <CardDescription className="text-sm md:text-base">Review and process sale</CardDescription>
            </div>
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm md:text-base">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto mb-6">
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Product</TableHead>
                        <TableHead className="text-center text-xs md:text-sm">Qty</TableHead>
                        <TableHead className="text-right text-xs md:text-sm">Price</TableHead>
                        <TableHead className="text-right text-xs md:text-sm">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.product.id}>
                          <TableCell className="font-medium text-xs md:text-sm min-w-[100px]">
                            {item.product.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1 md:gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 md:h-8 md:w-8 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-2 w-2 md:h-3 md:w-3" />
                              </Button>
                              <span className="w-6 md:w-8 text-center text-xs md:text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 md:h-8 md:w-8 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                              >
                                <Plus className="h-2 w-2 md:h-3 md:w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs md:text-sm whitespace-nowrap">
                            ${Number.parseFloat(item.product.price.toString()).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-xs md:text-sm whitespace-nowrap">
                            ${(Number.parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 md:h-8 md:w-8"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between text-lg md:text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>

                <Button className="w-full text-sm md:text-base" size="lg" onClick={processSale} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Complete Sale"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

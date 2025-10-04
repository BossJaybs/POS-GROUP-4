"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  user_id: string
  sku: string | null
}

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsDeleting(id)
    const supabase = createClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      alert("Error deleting product: " + error.message)
    } else {
      router.refresh()
    }
    setIsDeleting(null)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products found. Add your first product to get started.</p>
        <Link href="/dashboard/inventory/add">
          <Button>Add Product</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Name</TableHead>
              <TableHead className="text-xs md:text-sm">SKU</TableHead>
              <TableHead className="hidden sm:table-cell text-xs md:text-sm">Description</TableHead>
              <TableHead className="text-right text-xs md:text-sm">Price</TableHead>
              <TableHead className="text-right text-xs md:text-sm">Stock</TableHead>
              <TableHead className="text-right text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-xs md:text-sm min-w-[100px]">{product.name}</TableCell>
                <TableCell className="font-mono text-xs md:text-sm">{product.sku || "-"}</TableCell>
                <TableCell className="hidden sm:table-cell text-xs md:text-sm">{product.description || "-"}</TableCell>
                <TableCell className="text-right text-xs md:text-sm whitespace-nowrap">
                  ${Number.parseFloat(product.price.toString()).toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-xs md:text-sm">{product.stock_quantity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Link href={`/dashboard/inventory/edit/${product.id}`}>
                      <Button variant="outline" size="icon" className="h-7 w-7 md:h-9 md:w-9 bg-transparent">
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 md:h-9 md:w-9 bg-transparent"
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting === product.id}
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { DisplayProduct } from "@/lib/awin-display-products"

interface ProductGridProps {
  title?: string
  category?: string
  limit?: number
}

export default function AwinProductGrid({ title = "Recommended Products", category, limit = 10 }: ProductGridProps) {
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch("/api/awin-display-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, limit }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError("Failed to load products")
        console.error("Error fetching AWIN products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit])

  if (loading) {
    return (
      <div className="space-y-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading real products from AWIN...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">⚠️ {error}. Showing fallback products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="text-sm text-gray-500">{products.length} products from AWIN network</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product, index }: { product: DisplayProduct; index: number }) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <a href={product.affiliateLink} target="_blank" rel="nofollow noopener noreferrer" className="block h-full">
        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="aspect-square relative bg-gray-50">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-sm text-center p-2">{product.name}</span>
              </div>
            ) : (
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
                onError={() => setImageError(true)}
              />
            )}

            {/* AWIN Badge */}
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">AWIN</div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
              <p className="text-primary font-bold">${product.price.toFixed(2)}</p>

              {product.merchant_name && <p className="text-xs text-gray-500">from {product.merchant_name}</p>}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary bg-transparent"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                View Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  )
}

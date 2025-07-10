"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"
import type { DisplayProduct } from "@/lib/awin-display-products"

export default function AwinFeaturedProduct() {
  const [product, setProduct] = useState<DisplayProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch("/api/awin-featured-product")
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        }
      } catch (error) {
        console.error("Error fetching featured product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProduct()
  }, [])

  if (loading) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-secondary/20">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading featured product...</span>
        </div>
      </Card>
    )
  }

  if (!product) {
    return (
      <Card className="overflow-hidden border-secondary/20">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No featured product available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-secondary/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square relative bg-gray-50 p-4">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-sm text-center">{product.name}</span>
            </div>
          ) : (
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              onError={() => setImageError(true)}
              priority
            />
          )}

          {/* AWIN Badge */}
          <div className="absolute top-6 right-6 bg-purple-500 text-white text-sm px-3 py-1 rounded-full">
            AWIN Partner
          </div>
        </div>

        <CardContent className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Featured Product
            </div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-primary font-bold text-2xl">${product.price.toFixed(2)}</p>

            {product.description && <p className="text-gray-600">{product.description}</p>}

            {product.merchant_name && (
              <div className="space-y-2">
                <h4 className="font-medium">Available from:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">🏪 {product.merchant_name}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a href={product.affiliateLink} target="_blank" rel="noreferrer nofollow noopener">
              <Button className="w-full bg-secondary hover:bg-secondary/90">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Product
              </Button>
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Search, Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { FunFactProduct } from "@/lib/funfact-search"

export function FunFactShowcase() {
  const [products, setProducts] = useState<FunFactProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("fun")
  const [searching, setSearching] = useState(false)

  const fetchProducts = async (search = "fun", featured = false) => {
    setSearching(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (featured) params.append("featured", "true")

      const response = await fetch(`/api/funfact-products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error("Failed to fetch Fun Fact Co. products")
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching Fun Fact Co. products:", error)
      setProducts([])
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  useEffect(() => {
    fetchProducts("fun", true) // Load featured products initially
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      fetchProducts(searchTerm.trim())
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Fun Fact Co. Collection
          </div>
          <h2 className="text-3xl font-bold mb-4">Unique & Quirky Gifts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover fascinating and fun products that make perfect conversation starters and unique gifts
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Fun Fact Co. products..."
                className="flex-1"
              />
              <Button type="submit" disabled={searching} className="bg-purple-600 hover:bg-purple-700">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading Fun Fact Co. products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No Fun Fact Co. products found for "{searchTerm}"</p>
            <Button
              onClick={() => fetchProducts("fun", true)}
              variant="outline"
              className="mt-4 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Show Featured Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <FunFactProductCard key={product.product_id || index} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-purple-800 text-sm">
              <strong>Fun Fact Co.</strong> specializes in unique, educational, and entertaining products that make
              great gifts for curious minds and fun-loving people.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FunFactProductCard({ product, index }: { product: FunFactProduct; index: number }) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-purple-200">
        <div className="aspect-square relative bg-gradient-to-br from-purple-50 to-pink-50">
          {imageError || !product.image ? (
            <div className="w-full h-full flex items-center justify-center text-purple-400">
              <div className="text-center p-4">
                <Sparkles className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm font-medium line-clamp-2">{product.title}</p>
              </div>
            </div>
          ) : (
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-2"
              onError={() => setImageError(true)}
            />
          )}

          {/* Fun Fact Co. Badge */}
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Fun Fact Co.
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">{product.title}</h3>

            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-bold">{product.price}</span>
              <span className="text-xs text-gray-500">Unique Gift</span>
            </div>

            {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}

            <a href={product.link} target="_blank" rel="nofollow noopener noreferrer" className="block">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                View at Fun Fact Co.
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

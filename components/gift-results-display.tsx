"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ImageIcon, DollarSign, Star, ShoppingCart, Store } from "lucide-react"
import Image from "next/image"

interface RealProduct {
  title: string
  price: string
  link: string
  source: string
  rating?: string
  reviews?: number
  image?: string
}

interface ParsedGift {
  name: string
  description: string
  priceRange?: string
  searchQuery?: string
  realProducts: RealProduct[]
  fallbackLinks: Array<{
    store: string
    url: string
  }>
}

interface GiftResultsDisplayProps {
  giftIdeas: string
  source: "ai" | "database" | null
}

export function GiftResultsDisplay({ giftIdeas, source }: GiftResultsDisplayProps) {
  const [parsedGifts, setParsedGifts] = useState<ParsedGift[]>([])

  useEffect(() => {
    const parseGiftIdeas = (text: string): ParsedGift[] => {
      const gifts: ParsedGift[] = []

      // Split by gift sections (looking for **Gift Name** pattern)
      const sections = text.split(/\*\*([^*]+)\*\*/).filter(Boolean)

      for (let i = 0; i < sections.length; i += 2) {
        const name = sections[i]?.trim()
        const content = sections[i + 1]?.trim()

        if (name && content) {
          // Extract description
          const descMatch = content.match(/Description:\s*([^]*?)(?:Price Range:|Search Query:|🛒|🔍|$)/i)
          const description = descMatch?.[1]?.trim() || content.split("\n")[0]

          // Extract price range
          const priceMatch = content.match(/Price Range:\s*\$?([0-9.,-]+)/i)
          const priceRange = priceMatch ? `$${priceMatch[1]}` : undefined

          // Extract search query
          const searchMatch = content.match(/Search Query:\s*([^\n]+)/i)
          const searchQuery = searchMatch?.[1]?.trim()

          // Extract real products from Google Shopping
          const realProducts: RealProduct[] = []
          const productMatches = content.matchAll(
            /(\d+)\.\s\*\*([^*]+)\*\*\s*\n\s*💰\s*Price:\s*([^\n]+)\s*\n\s*🏪\s*Store:\s*([^\n]+)\s*(?:\n\s*⭐\s*Rating:\s*([^\n]+))?\s*\n\s*🔗\s*\*\*Buy Now\*\*:\s*(https?:\/\/[^\s\n]+)/g,
          )

          for (const match of productMatches) {
            realProducts.push({
              title: match[2].trim(),
              price: match[3].trim(),
              source: match[4].trim(),
              rating: match[5]?.trim(),
              link: match[6].trim(),
            })
          }

          // Extract fallback links
          const fallbackLinks: Array<{ store: string; url: string }> = []

          // Look for Google Shopping links
          const googleMatch = content.match(/•\s*Google Shopping:\s*(https?:\/\/[^\s\n]+)/i)
          if (googleMatch) {
            fallbackLinks.push({ store: "Google Shopping", url: googleMatch[1] })
          }

          // Look for Amazon links
          const amazonMatch = content.match(/•\s*Amazon:\s*(https?:\/\/[^\s\n]+)/i)
          if (amazonMatch) {
            fallbackLinks.push({ store: "Amazon", url: amazonMatch[1] })
          }

          gifts.push({
            name,
            description,
            priceRange,
            searchQuery,
            realProducts,
            fallbackLinks,
          })
        }
      }

      return gifts
    }

    const parsed = parseGiftIdeas(giftIdeas)
    setParsedGifts(parsed)
  }, [giftIdeas])

  if (parsedGifts.length === 0) {
    // Fallback to original text display
    return (
      <div className="prose prose-gray max-w-none">
        <div className="whitespace-pre-line text-gray-700 leading-relaxed">{giftIdeas}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {parsedGifts.map((gift, index) => (
        <GiftCard key={index} gift={gift} index={index} />
      ))}
    </div>
  )
}

function GiftCard({ gift, index }: { gift: ParsedGift; index: number }) {
  const [imageError, setImageError] = useState(false)

  // Generate a product image URL based on the gift name
  const getProductImage = (giftName: string) => {
    const searchTerm = giftName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "+")
    return `https://source.unsplash.com/400x300/?${searchTerm},product,gift`
  }

  // Get store-specific styling
  const getStoreStyle = (storeName: string) => {
    const store = storeName.toLowerCase()
    if (store.includes("amazon")) return "bg-orange-50 border-orange-200 text-orange-800"
    if (store.includes("walmart")) return "bg-blue-50 border-blue-200 text-blue-800"
    if (store.includes("target")) return "bg-red-50 border-red-200 text-red-800"
    if (store.includes("best buy")) return "bg-yellow-50 border-yellow-200 text-yellow-800"
    return "bg-gray-50 border-gray-200 text-gray-800"
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300">
      <div className="grid md:grid-cols-3 gap-0">
        {/* Image Section */}
        <div className="relative aspect-video md:aspect-square bg-gray-100">
          {!imageError ? (
            <Image
              src={getProductImage(gift.name) || "/placeholder.svg"}
              alt={gift.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center p-4">
                <ImageIcon className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium line-clamp-2">{gift.name}</p>
              </div>
            </div>
          )}

          {/* Gift number badge */}
          <div className="absolute top-3 left-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>

          {/* Price badge */}
          {gift.priceRange && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {gift.priceRange.replace("$", "")}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="md:col-span-2 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{gift.name}</h3>
              {gift.priceRange && <p className="text-lg font-semibold text-green-600 mb-2">{gift.priceRange}</p>}
              <p className="text-gray-600 leading-relaxed mb-4">{gift.description}</p>
            </div>

            {/* Real Products from Google Shopping */}
            {gift.realProducts.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  Available at These Stores
                </h4>
                <div className="space-y-3">
                  {gift.realProducts.map((product, productIndex) => (
                    <div key={productIndex} className={`border rounded-lg p-4 ${getStoreStyle(product.source)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-3">{product.title}</h5>
                        <span className="text-lg font-bold text-green-600 whitespace-nowrap">{product.price}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Store className="w-4 h-4" />
                          <span className="text-sm font-medium">{product.source}</span>
                        </div>

                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            {product.reviews && (
                              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                            )}
                          </div>
                        )}
                      </div>

                      <a href={product.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white btn-modern">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Shop at {product.source}
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback Search Links */}
            {gift.fallbackLinks.length > 0 && gift.realProducts.length === 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Search for This Product</h4>
                <div className="flex flex-wrap gap-2">
                  {gift.fallbackLinks.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-400 text-blue-600 hover:bg-blue-50 btn-modern bg-transparent"
                      >
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Search {link.store}
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {gift.searchQuery && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>Search tip:</strong> Look for "{gift.searchQuery}" to find this exact product
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

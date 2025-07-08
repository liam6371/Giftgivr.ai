"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, DollarSign, Search } from "lucide-react"
import Image from "next/image"

interface ParsedGift {
  name: string
  description: string
  price?: string
  searchTerms?: string
  links: Array<{
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
          const descMatch = content.match(/Description:\s*([^]*?)(?:Price:|Search Terms:|•|$)/i)
          const description = descMatch?.[1]?.trim() || content.split("\n")[0]

          // Extract price
          const priceMatch = content.match(/Price:\s*\$?([0-9.,-]+)/i)
          const price = priceMatch ? `$${priceMatch[1]}` : undefined

          // Extract search terms
          const searchTermsMatch = content.match(/Search Terms:\s*([^\n•]+)/i)
          const searchTerms = searchTermsMatch?.[1]?.trim()

          // Extract links
          const links: Array<{ store: string; url: string }> = []

          // Look for various link patterns
          const linkPatterns = [
            { pattern: /•\s*Amazon:\s*(https?:\/\/[^\s\n]+)/gi, store: "Amazon" },
            { pattern: /•\s*Etsy:\s*(https?:\/\/[^\s\n]+)/gi, store: "Etsy" },
            { pattern: /•\s*Google Shopping:\s*(https?:\/\/[^\s\n]+)/gi, store: "Google Shopping" },
            { pattern: /•\s*Walmart:\s*(https?:\/\/[^\s\n]+)/gi, store: "Walmart" },
            { pattern: /•\s*Target:\s*(https?:\/\/[^\s\n]+)/gi, store: "Target" },
            { pattern: /Amazon:\s*(https?:\/\/[^\s\n]+)/gi, store: "Amazon" },
            { pattern: /Etsy:\s*(https?:\/\/[^\s\n]+)/gi, store: "Etsy" },
            { pattern: /Link:\s*(https?:\/\/[^\s\n]+)/gi, store: "Store" },
          ]

          linkPatterns.forEach(({ pattern, store }) => {
            let match
            while ((match = pattern.exec(content)) !== null) {
              const url = match[1]

              // Determine store from URL if not already set
              let finalStore = store
              if (store === "Store") {
                if (url.includes("amazon.com")) finalStore = "Amazon"
                else if (url.includes("etsy.com")) finalStore = "Etsy"
                else if (url.includes("google.com")) finalStore = "Google Shopping"
                else if (url.includes("walmart.com")) finalStore = "Walmart"
                else if (url.includes("target.com")) finalStore = "Target"
              }

              links.push({ store: finalStore, url })
            }
          })

          // Remove duplicates
          const uniqueLinks = links.filter((link, index, self) => index === self.findIndex((l) => l.url === link.url))

          gifts.push({
            name,
            description,
            price,
            searchTerms,
            links: uniqueLinks,
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
    <div className="space-y-6">
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
    return `https://source.unsplash.com/300x200/?${searchTerm},product,gift`
  }

  return (
    <Card className="overflow-hidden border-none shadow-card bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
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
          {gift.price && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {gift.price.replace("$", "")}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="md:col-span-2 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{gift.name}</h3>
              {gift.price && <p className="text-lg font-semibold text-green-600 mb-2">{gift.price}</p>}
              <p className="text-gray-600 leading-relaxed mb-3">{gift.description}</p>

              {gift.searchTerms && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Search className="w-4 h-4" />
                    <span className="font-medium">Search for:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs">{gift.searchTerms}</code>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Links */}
            {gift.links.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Find This Product</h4>
                <div className="flex flex-wrap gap-2">
                  {gift.links.map((link, linkIndex) => (
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
                        className={`
                          btn-modern transition-all duration-200 hover:scale-105
                          ${link.store === "Amazon" ? "border-orange-400 text-orange-600 hover:bg-orange-50" : ""}
                          ${link.store === "Etsy" ? "border-orange-500 text-orange-700 hover:bg-orange-50" : ""}
                          ${link.store === "Google Shopping" ? "border-blue-400 text-blue-600 hover:bg-blue-50" : ""}
                          ${link.store === "Walmart" ? "border-blue-500 text-blue-700 hover:bg-blue-50" : ""}
                          ${link.store === "Target" ? "border-red-400 text-red-600 hover:bg-red-50" : ""}
                        `}
                      >
                        <Search className="w-3 h-3 mr-1.5" />
                        Search {link.store}
                      </Button>
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 These links will search for the exact product. Look for the specific brand and model mentioned
                  above.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

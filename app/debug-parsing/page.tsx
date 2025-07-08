"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugParsingPage() {
  const [giftText, setGiftText] = useState(`**Ninja Foodi Personal Blender BN401 18oz Cup Black**
Description: Perfect for single-serve smoothies and protein shakes, compact design ideal for small kitchens and health-conscious individuals
Price Range: $70-$90
Search Query: Ninja Foodi Personal Blender BN401 18oz

🛒 **Real Products Found on Google Shopping:**
1. **Ninja BL480D Nutri Pro Compact Personal Blender**
   💰 Price: $79.99
   🏪 Store: Amazon
   ⭐ Rating: 4.4/5 (12,847 reviews)
   🔗 **Buy Now**: https://www.amazon.com/dp/B075KBQZPX

2. **Ninja Foodi Personal Blender with Auto-iQ**
   💰 Price: $89.95
   🏪 Store: Walmart
   🔗 **Buy Now**: https://www.walmart.com/ip/ninja-foodi-blender

🔍 **Search for this product**:
• Google Shopping: https://www.google.com/search?tbm=shop&q=Ninja%20Foodi%20Personal%20Blender
• Amazon: https://www.amazon.com/s?k=Ninja%20Foodi%20Personal%20Blender`)

  const [parsedResult, setParsedResult] = useState<any>(null)

  const parseText = () => {
    const gifts: any[] = []
    const sections = giftText.split(/\*\*([^*]+)\*\*/).filter(Boolean)

    for (let i = 0; i < sections.length; i += 2) {
      const name = sections[i]?.trim()
      const content = sections[i + 1]?.trim()

      if (name && content) {
        // Extract real products
        const realProducts: any[] = []

        // Look for the "Real Products Found" section
        const realProductsSection = content.match(
          /🛒\s*\*\*Real Products Found[^:]*:\*\*\s*\n([\s\S]*?)(?:\n\n🔍|\n\n$|$)/i,
        )

        if (realProductsSection) {
          const productsText = realProductsSection[1]

          // Match individual products
          const productMatches = productsText.matchAll(
            /(\d+)\.\s*\*\*([^*]+)\*\*\s*\n\s*💰\s*Price:\s*([^\n]+)\s*\n\s*🏪\s*Store:\s*([^\n]+)\s*(?:\n\s*⭐\s*Rating:\s*([^\n]+))?\s*\n\s*🔗\s*\*\*Buy Now\*\*:\s*(https?:\/\/[^\s\n]+)/g,
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
        }

        // Extract fallback links
        const fallbackLinks: any[] = []
        const searchSection = content.match(/🔍\s*\*\*Search for this product\*\*:\s*\n([\s\S]*?)(?:\n\n|$)/i)

        if (searchSection) {
          const searchText = searchSection[1]

          const googleMatch = searchText.match(/•\s*Google Shopping:\s*(https?:\/\/[^\s\n]+)/i)
          if (googleMatch) {
            fallbackLinks.push({ store: "Google Shopping", url: googleMatch[1] })
          }

          const amazonMatch = searchText.match(/•\s*Amazon:\s*(https?:\/\/[^\s\n]+)/i)
          if (amazonMatch) {
            fallbackLinks.push({ store: "Amazon", url: amazonMatch[1] })
          }
        }

        gifts.push({
          name,
          realProducts,
          fallbackLinks,
          rawContent: content,
        })
      }
    }

    setParsedResult(gifts)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Gift Text Parsing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gift Text to Parse:</label>
            <Textarea
              value={giftText}
              onChange={(e) => setGiftText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <Button onClick={parseText}>Parse Text</Button>

          {parsedResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Parsed Results:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(parsedResult, null, 2)}
              </pre>

              {parsedResult.map((gift: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{gift.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Real Products Found: {gift.realProducts.length}</p>
                    <p className="text-sm text-gray-600 mb-2">Fallback Links: {gift.fallbackLinks.length}</p>

                    {gift.realProducts.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium">Real Products:</h5>
                        {gift.realProducts.map((product: any, pIndex: number) => (
                          <div key={pIndex} className="bg-green-50 p-2 rounded text-sm">
                            <p>
                              <strong>{product.title}</strong>
                            </p>
                            <p>Price: {product.price}</p>
                            <p>Store: {product.source}</p>
                            <p>Rating: {product.rating || "N/A"}</p>
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {product.link}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {gift.fallbackLinks.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h5 className="font-medium">Fallback Links:</h5>
                        {gift.fallbackLinks.map((link: any, lIndex: number) => (
                          <div key={lIndex} className="bg-blue-50 p-2 rounded text-sm">
                            <p>
                              <strong>{link.store}</strong>
                            </p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {link.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestSerpAPIPage() {
  const [query, setQuery] = useState("wireless bluetooth headphones")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/search-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || "Search failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStoreBadgeColor = (store: string) => {
    const storeLower = store.toLowerCase()
    if (storeLower.includes("amazon")) return "bg-orange-100 text-orange-800"
    if (storeLower.includes("walmart")) return "bg-blue-100 text-blue-800"
    if (storeLower.includes("target")) return "bg-red-100 text-red-800"
    if (storeLower.includes("best buy")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛍️ Google Shopping Search Test
            <Badge variant="secondary">SerpAPI</Badge>
          </CardTitle>
          <p className="text-gray-600">Test the Google Shopping product search integration</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter product search query..."
              onKeyPress={(e) => e.key === "Enter" && testSearch()}
              className="flex-1"
            />
            <Button onClick={testSearch} disabled={loading} className="px-6">
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">❌ Error: {error}</div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ Found {results.products?.length || 0} products from Google Shopping
              </div>

              <div className="grid gap-6">
                {results.products?.map((product: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6 items-start">
                        {product.image && (
                          <div className="relative">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-40 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                        <div className="md:col-span-3 space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.title}</h3>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl font-bold text-green-600">{product.price}</span>
                              <Badge className={getStoreBadgeColor(product.source)}>{product.source}</Badge>
                            </div>
                          </div>

                          {(product.rating || product.reviews) && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <span>⭐</span>
                                  <span className="font-medium">{product.rating}</span>
                                </div>
                              )}
                              {product.reviews && <span>({product.reviews} reviews)</span>}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                              <Button className="bg-blue-500 hover:bg-blue-600 text-white">View Product →</Button>
                            </a>
                            <Button
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(product.link)}
                              className="text-gray-600"
                            >
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Test Suggestions:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "wireless bluetooth headphones",
                "coffee maker",
                "yoga mat",
                "gaming mouse",
                "skincare set",
                "cookbook",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

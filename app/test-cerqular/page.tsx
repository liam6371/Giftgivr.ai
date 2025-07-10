"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestCerqularPage() {
  const [searchTerm, setSearchTerm] = useState("sustainable")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testCerqularSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/cerqular-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || "Cerqular search failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const loadFeatured = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/cerqular-products")
      const data = await response.json()

      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || "Failed to load featured products")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌱 Cerqular Test
            <Badge variant="secondary">Advertiser ID: 114021</Badge>
          </CardTitle>
          <p className="text-gray-600">Test the Cerqular sustainable products integration via AWIN</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Cerqular products..."
              onKeyPress={(e) => e.key === "Enter" && testCerqularSearch()}
              className="flex-1"
            />
            <Button onClick={testCerqularSearch} disabled={loading} className="px-6">
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button onClick={loadFeatured} disabled={loading} variant="outline" className="px-6 bg-transparent">
              Featured
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">❌ Error: {error}</div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ Found {results.products?.length || 0} products from Cerqular
              </div>

              <div className="grid gap-4">
                {results.products?.map((product: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-start">
                        {product.image && (
                          <div className="relative">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                        <div className="md:col-span-3 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.title}</h3>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xl font-bold text-green-600">{product.price}</span>
                              <Badge className="bg-green-100 text-green-800">Cerqular</Badge>
                              {product.sustainability_score && (
                                <Badge variant="outline">Score: {product.sustainability_score}</Badge>
                              )}
                              {product.product_id && <Badge variant="outline">ID: {product.product_id}</Badge>}
                            </div>
                          </div>

                          {product.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          )}

                          {product.eco_features && product.eco_features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.eco_features.map((feature: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  🌱 {feature}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-3">
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                              <Button className="bg-green-500 hover:bg-green-600 text-white">View at Cerqular →</Button>
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

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">🌱 Cerqular Integration:</h4>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Advertiser ID: 114021 in your AWIN network</li>
              <li>• Specializes in sustainable and eco-friendly products</li>
              <li>• All links are tracked through your AWIN publisher account</li>
              <li>• Perfect for environmentally conscious gift recipients</li>
              <li>• Products include sustainability scores and eco-features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

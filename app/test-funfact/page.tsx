"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestFunFactPage() {
  const [searchTerm, setSearchTerm] = useState("fun")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testFunFactSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/funfact-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || "Fun Fact Co. search failed")
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
      const response = await fetch("/api/funfact-products?featured=true")
      const data = await response.json()

      if (response.ok) {
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
            ✨ Fun Fact Co. Test
            <Badge variant="secondary">Advertiser ID: 114020</Badge>
          </CardTitle>
          <p className="text-gray-600">Test the Fun Fact Co. product integration via AWIN</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Fun Fact Co. products..."
              onKeyPress={(e) => e.key === "Enter" && testFunFactSearch()}
              className="flex-1"
            />
            <Button onClick={testFunFactSearch} disabled={loading} className="px-6">
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
                ✅ Found {results.products?.length || 0} products from Fun Fact Co.
              </div>

              <div className="grid gap-4">
                {results.products?.map((product: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
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
                              <Badge className="bg-purple-100 text-purple-800">Fun Fact Co.</Badge>
                              {product.product_id && <Badge variant="outline">ID: {product.product_id}</Badge>}
                            </div>
                          </div>

                          {product.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          )}

                          <div className="flex gap-3">
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                                View at Fun Fact Co. →
                              </Button>
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

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">💡 Fun Fact Co. Integration:</h4>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• Advertiser ID: 114020 in your AWIN network</li>
              <li>• Specializes in unique, educational, and fun products</li>
              <li>• All links are tracked through your AWIN publisher account</li>
              <li>• Perfect for quirky gifts and conversation starters</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

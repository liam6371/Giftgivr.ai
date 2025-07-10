"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TestAwinPage() {
  const [query, setQuery] = useState("wireless headphones")
  const [results, setResults] = useState<any>(null)
  const [merchants, setMerchants] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [merchantsLoading, setMerchantsLoading] = useState(false)
  const [error, setError] = useState("")

  const testAwinSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("/api/search-awin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || "AWIN search failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const loadMerchants = async () => {
    setMerchantsLoading(true)
    try {
      const response = await fetch("/api/awin-merchants")
      const data = await response.json()

      if (response.ok) {
        setMerchants(data)
      } else {
        console.error("Failed to load merchants:", data.error)
      }
    } catch (err) {
      console.error("Error loading merchants:", err)
    } finally {
      setMerchantsLoading(false)
    }
  }

  useEffect(() => {
    loadMerchants()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛒 AWIN Integration Test
            <Badge variant="secondary">Affiliate Network</Badge>
          </CardTitle>
          <p className="text-gray-600">Test the AWIN affiliate network integration and view your joined merchants</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Product Search</TabsTrigger>
              <TabsTrigger value="merchants">Your Merchants</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter product search query..."
                  onKeyPress={(e) => e.key === "Enter" && testAwinSearch()}
                  className="flex-1"
                />
                <Button onClick={testAwinSearch} disabled={loading} className="px-6">
                  {loading ? "Searching..." : "Search AWIN"}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ❌ Error: {error}
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✅ Found {results.products?.length || 0} products from AWIN network
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
                                  <Badge className="bg-purple-100 text-purple-800">AWIN</Badge>
                                  {product.merchant_name && (
                                    <Badge variant="outline">Store: {product.merchant_name}</Badge>
                                  )}
                                  {product.merchant_id && <Badge variant="secondary">ID: {product.merchant_id}</Badge>}
                                </div>
                              </div>

                              {product.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                              )}

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
                                <a
                                  href={product.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                >
                                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                                    View Product →
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
            </TabsContent>

            <TabsContent value="merchants" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Joined Merchants</h3>
                <Button onClick={loadMerchants} disabled={merchantsLoading} variant="outline">
                  {merchantsLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>

              {merchants && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                    📊 You have {merchants.merchants?.length || 0} joined merchants in your AWIN account
                  </div>

                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {merchants.merchants?.map((merchant: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{merchant.merchant_name}</h4>
                              <p className="text-sm text-gray-600">ID: {merchant.merchant_id}</p>
                              {merchant.primary_region && (
                                <p className="text-sm text-gray-500">Region: {merchant.primary_region}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  merchant.relationship_status === "joined"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {merchant.relationship_status}
                              </Badge>
                              {merchant.commission_type && (
                                <p className="text-xs text-gray-500 mt-1">{merchant.commission_type}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 AWIN Integration Info:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• AWIN provides access to thousands of affiliate merchants</li>
              <li>• All links are automatically tracked for affiliate commissions</li>
              <li>• Products come from your joined merchants in the AWIN network</li>
              <li>• Deep links ensure proper attribution and tracking</li>
              <li>• Your Publisher ID: {process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID || "Not configured"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

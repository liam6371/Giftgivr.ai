"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugFunFactPage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rawResponse, setRawResponse] = useState("")

  const testDirectAPI = async () => {
    setLoading(true)
    setError("")
    setApiResponse(null)
    setRawResponse("")

    try {
      console.log("🔍 Testing Fun Fact Co. API...")

      const response = await fetch("/api/funfact-products?search=fun&debug=true", {
        method: "GET",
      })

      const responseText = await response.text()
      setRawResponse(responseText)

      console.log("📡 Raw API Response:", responseText)

      if (response.ok) {
        const data = JSON.parse(responseText)
        setApiResponse(data)
        console.log("✅ Parsed Data:", data)
      } else {
        setError(`API Error: ${response.status} - ${responseText}`)
        console.error("❌ API Error:", response.status, responseText)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error"
      setError(`Network Error: ${errorMsg}`)
      console.error("❌ Network Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const testEnvironmentVars = () => {
    console.log("🔧 Environment Variables Check:")
    console.log("AWIN_API_KEY exists:", !!process.env.AWIN_API_KEY)
    console.log("AWIN_PUBLISHER_ID:", process.env.AWIN_PUBLISHER_ID || "Not set")
    console.log("NEXT_PUBLIC_AWIN_PUBLISHER_ID:", process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID || "Not set")
  }

  useEffect(() => {
    testEnvironmentVars()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🐛 Fun Fact Co. Debug Console
            <Badge variant="destructive">Debug Mode</Badge>
          </CardTitle>
          <p className="text-gray-600">Debug the Fun Fact Co. API integration step by step</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Buttons */}
          <div className="flex gap-4">
            <Button onClick={testDirectAPI} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Testing..." : "🧪 Test Fun Fact Co. API"}
            </Button>
            <Button onClick={testEnvironmentVars} variant="outline" className="bg-transparent">
              🔧 Check Environment
            </Button>
          </div>

          {/* Environment Check */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Environment Variables</h3>
              <div className="space-y-1 text-sm">
                <p>
                  Publisher ID: <code className="bg-blue-100 px-2 py-1 rounded">2104361</code>
                </p>
                <p>
                  Advertiser ID: <code className="bg-blue-100 px-2 py-1 rounded">114020</code> (Fun Fact Co.)
                </p>
                <p>
                  API Key: <span className="text-blue-600">{process.env.AWIN_API_KEY ? "✅ Set" : "❌ Missing"}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-red-800 mb-2">❌ Error Details</h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
              </CardContent>
            </Card>
          )}

          {/* Raw Response */}
          {rawResponse && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📡 Raw API Response</h3>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-64 bg-white p-3 rounded border">
                  {rawResponse}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Parsed Response */}
          {apiResponse && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Parsed API Response</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Products Found:</strong> {apiResponse.products?.length || 0}
                  </p>
                  <p>
                    <strong>Source:</strong> {apiResponse.source}
                  </p>
                  <p>
                    <strong>Advertiser ID:</strong> {apiResponse.advertiser_id}
                  </p>
                </div>

                {apiResponse.products && apiResponse.products.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Sample Products:</h4>
                    <div className="space-y-2">
                      {apiResponse.products.slice(0, 3).map((product: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-600">Price: {product.price}</p>
                          <p className="text-sm text-gray-600">ID: {product.product_id}</p>
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            🔗 View Product Link
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting Guide */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">🔧 Troubleshooting Steps</h3>
              <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Verify AWIN_API_KEY is set in environment variables</li>
                <li>Check if you have access to advertiser 114020 (Fun Fact Co.)</li>
                <li>Ensure your AWIN account has approved relationship with Fun Fact Co.</li>
                <li>
                  Test the API endpoint directly in browser: <code>/api/funfact-products?search=fun</code>
                </li>
                <li>Check browser console for JavaScript errors</li>
                <li>Verify Fun Fact Co. has products in their feed</li>
              </ol>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

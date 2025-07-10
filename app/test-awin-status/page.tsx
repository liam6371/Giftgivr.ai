"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestAwinStatusPage() {
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [merchants, setMerchants] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkAwinStatus = async () => {
    setLoading(true)
    setError("")

    try {
      // Check basic connection
      const connectionResponse = await fetch("/api/test-awin-connection")
      const connectionData = await connectionResponse.json()
      setAccountInfo(connectionData)

      // Check merchants
      const merchantsResponse = await fetch("/api/awin-merchants")
      const merchantsData = await merchantsResponse.json()
      setMerchants(merchantsData)
    } catch (err) {
      setError("Failed to check AWIN status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAwinStatus()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 AWIN Account Status</CardTitle>
          <p className="text-gray-600">Check your AWIN integration and merchant relationships</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={checkAwinStatus} disabled={loading}>
            {loading ? "Checking..." : "🔄 Refresh Status"}
          </Button>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">❌ {error}</div>}

          {accountInfo && (
            <Card className={accountInfo.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  {accountInfo.success ? "✅ AWIN Connection" : "❌ AWIN Connection"}
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    Publisher ID: <code>{accountInfo.publisher_id}</code>
                  </p>
                  <p>
                    API Status:{" "}
                    <Badge variant={accountInfo.success ? "default" : "destructive"}>{accountInfo.status}</Badge>
                  </p>
                  <p>API Key: {accountInfo.has_api_key ? "✅ Configured" : "❌ Missing"}</p>
                  {accountInfo.response_preview && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">API Response Preview</summary>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                        {accountInfo.response_preview}
                      </pre>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {merchants && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">📊 Your AWIN Merchants</h3>
                <p className="text-sm mb-3">You have {merchants.merchants?.length || 0} joined merchants</p>

                {merchants.merchants?.find((m: any) => m.merchant_id === "114020") ? (
                  <div className="bg-green-100 border border-green-300 rounded p-3">
                    <p className="text-green-800 font-medium">✅ Fun Fact Co. (114020) - Relationship Active</p>
                  </div>
                ) : (
                  <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                    <p className="text-yellow-800 font-medium">⚠️ Fun Fact Co. (114020) - Not found in your merchants</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      You may need to apply for a relationship with Fun Fact Co. in your AWIN dashboard
                    </p>
                  </div>
                )}

                <details className="mt-3">
                  <summary className="cursor-pointer text-sm">View all merchants</summary>
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {merchants.merchants?.map((merchant: any, index: number) => (
                      <div key={index} className="text-xs bg-white p-2 rounded mb-1">
                        <strong>{merchant.merchant_name}</strong> (ID: {merchant.merchant_id})
                      </div>
                    ))}
                  </div>
                </details>
              </CardContent>
            </Card>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎯 Next Steps:</h4>
            <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
              <li>Ensure your AWIN API key is correctly set in environment variables</li>
              <li>Apply for a relationship with Fun Fact Co. (Advertiser ID: 114020) in your AWIN dashboard</li>
              <li>Wait for approval (this can take a few days)</li>
              <li>Once approved, the Fun Fact Co. products should appear</li>
              <li>
                Test the integration using the debug page: <code>/debug-funfact</code>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

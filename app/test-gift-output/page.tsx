"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestGiftOutputPage() {
  const [rawOutput, setRawOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/giftgen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationship: "friend",
          occasion: "birthday",
          budget: 50,
          interests: "coffee",
        }),
      })

      const data = await response.json()
      setRawOutput(data.gifts || "No output received")
    } catch (error) {
      setRawOutput(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Raw API Output Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAPI} disabled={loading}>
            {loading ? "Testing..." : "Test Gift API"}
          </Button>

          {rawOutput && (
            <div>
              <h3 className="font-semibold mb-2">Raw API Response:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                {rawOutput}
              </pre>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Character Analysis:</h3>
                <p className="text-sm">Length: {rawOutput.length} characters</p>
                <p className="text-sm">Contains "Buy Now": {rawOutput.includes("Buy Now") ? "✅ Yes" : "❌ No"}</p>
                <p className="text-sm">Contains "🔗": {rawOutput.includes("🔗") ? "✅ Yes" : "❌ No"}</p>
                <p className="text-sm">Contains "https://": {rawOutput.includes("https://") ? "✅ Yes" : "❌ No"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

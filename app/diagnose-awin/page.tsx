"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function DiagnoseAwinPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/diagnose-awin")
      const data = await response.json()
      setDiagnostics(data)
      console.log("🔍 Full Diagnostics:", data)
    } catch (error) {
      console.error("Diagnostics failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "FAIL":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS":
        return "bg-green-50 border-green-200"
      case "FAIL":
        return "bg-red-50 border-red-200"
      case "ERROR":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔬 AWIN Integration Diagnostics
            <Badge variant="outline">Deep Analysis</Badge>
          </CardTitle>
          <p className="text-gray-600">Comprehensive analysis of your AWIN API setup and permissions</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Button onClick={runDiagnostics} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Running Diagnostics..." : "Run Full Diagnostics"}
            </Button>
            {diagnostics && (
              <Badge variant="secondary">Last run: {new Date(diagnostics.timestamp).toLocaleTimeString()}</Badge>
            )}
          </div>

          {diagnostics && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
                <TabsTrigger value="tests">API Tests</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4">
                  {diagnostics.tests.map((test: any, index: number) => (
                    <Card key={index} className={getStatusColor(test.status)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <h3 className="font-semibold">{test.test}</h3>
                          </div>
                          <Badge variant={test.status === "PASS" ? "default" : "destructive"}>{test.status}</Badge>
                        </div>
                        {test.statusCode && <p className="text-sm">Status Code: {test.statusCode}</p>}
                        {test.message && <p className="text-sm">{test.message}</p>}
                        {test.funFactCoStatus && (
                          <p className="text-sm">
                            <strong>Fun Fact Co.:</strong> {test.funFactCoStatus}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="environment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Variables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">AWIN_API_KEY</span>
                        <div className="flex items-center gap-2">
                          {diagnostics.environment.AWIN_API_KEY ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {diagnostics.environment.AWIN_API_KEY
                              ? `Set (${diagnostics.environment.AWIN_API_KEY_LENGTH} chars)`
                              : "Missing"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">AWIN_PUBLISHER_ID</span>
                        <span className="text-sm">{diagnostics.environment.AWIN_PUBLISHER_ID}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">NEXT_PUBLIC_AWIN_PUBLISHER_ID</span>
                        <span className="text-sm">
                          {diagnostics.environment.NEXT_PUBLIC_AWIN_PUBLISHER_ID || "Not set"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                {diagnostics.tests.map((test: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        {test.test}
                        <Badge variant={test.status === "PASS" ? "default" : "destructive"}>{test.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {test.url && (
                          <p>
                            <strong>URL:</strong> <code className="bg-gray-100 px-1 rounded">{test.url}</code>
                          </p>
                        )}
                        {test.statusCode && (
                          <p>
                            <strong>Status Code:</strong> {test.statusCode}
                          </p>
                        )}
                        {test.dataStructure && (
                          <p>
                            <strong>Data Structure:</strong> {test.dataStructure}
                          </p>
                        )}
                        {test.totalMerchants && (
                          <p>
                            <strong>Total Merchants:</strong> {test.totalMerchants}
                          </p>
                        )}
                        {test.funFactCoDetails && (
                          <div>
                            <strong>Fun Fact Co. Details:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                              {JSON.stringify(test.funFactCoDetails, null, 2)}
                            </pre>
                          </div>
                        )}
                        {test.sampleResponse && (
                          <div>
                            <strong>Sample Response:</strong>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                              {test.sampleResponse}
                            </pre>
                          </div>
                        )}
                        {test.error && (
                          <p className="text-red-600">
                            <strong>Error:</strong> {test.error}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="solutions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>🛠️ Troubleshooting Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-semibold text-blue-800 mb-2">If API Key is Missing:</h4>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Go to your AWIN dashboard → Account → API</li>
                          <li>Generate a new API key if you don't have one</li>
                          <li>Add it to your environment variables as AWIN_API_KEY</li>
                          <li>Restart your application</li>
                        </ol>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="font-semibold text-yellow-800 mb-2">If Fun Fact Co. Relationship Not Found:</h4>
                        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                          <li>Log into your AWIN publisher dashboard</li>
                          <li>Go to "Advertisers" → "Join Programmes"</li>
                          <li>Search for "Fun Fact Co." or advertiser ID "114020"</li>
                          <li>Apply for the programme and wait for approval</li>
                          <li>Check back in 24-48 hours</li>
                        </ol>
                      </div>

                      <div className="p-4 bg-red-50 border border-red-200 rounded">
                        <h4 className="font-semibold text-red-800 mb-2">If Product APIs Fail:</h4>
                        <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
                          <li>Your API key might not have product data permissions</li>
                          <li>Contact AWIN support to enable product API access</li>
                          <li>Some publisher accounts need special approval for product APIs</li>
                          <li>Try using the Commission Factory API instead</li>
                        </ol>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded">
                        <h4 className="font-semibold text-green-800 mb-2">Alternative Solutions:</h4>
                        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                          <li>Use the fallback products that are already implemented</li>
                          <li>Focus on other affiliate networks (Amazon, Etsy) that are working</li>
                          <li>Manually curate Fun Fact Co. products with direct affiliate links</li>
                          <li>Use the AWIN deep link generator for specific products</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

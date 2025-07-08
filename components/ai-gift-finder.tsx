"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, AlertCircle, Database, ShoppingBag, ExternalLink, Settings, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { GiftResultsDisplay } from "./gift-results-display"

export function AIGiftFinder() {
  const [simpleMode, setSimpleMode] = useState(true)
  const [relationship, setRelationship] = useState("")
  const [occasion, setOccasion] = useState("")
  const [budget, setBudget] = useState("")
  const [interests, setInterests] = useState("")
  const [giftIdeas, setGiftIdeas] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [source, setSource] = useState<"ai" | "database" | null>(null)

  const handleGenerateGifts = async () => {
    if (!relationship || !occasion || !budget || !interests.trim()) {
      setError("Please fill in all fields including their interests")
      return
    }

    setLoading(true)
    setError("")
    setGiftIdeas("")
    setSource(null)

    try {
      const response = await fetch("/api/giftgen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relationship,
          occasion,
          budget: Number.parseInt(budget),
          interests: interests.trim(),
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (data.gifts) {
        setGiftIdeas(data.gifts)
        setSource(data.source)
      } else {
        throw new Error("No gift ideas received from the server")
      }
    } catch (err) {
      console.error("Error generating gifts:", err)
      setError(err instanceof Error ? err.message : "Failed to generate gift ideas. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (simpleMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-sm border">
            <button
              onClick={() => setSimpleMode(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                simpleMode ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Quick Mode
            </button>
            <button
              onClick={() => setSimpleMode(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !simpleMode ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Advanced
            </button>
          </div>
        </div>

        {/* Simple Form */}
        <Card className="border-none shadow-xl bg-white">
          <CardHeader className="text-center">
            <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">🎁 Quick Gift Finder</CardTitle>
            <p className="text-gray-600">Find the perfect gift in seconds with AI</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Who is the gift for? (e.g. sister, friend, coworker)"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Input
              placeholder="What is the occasion? (e.g. birthday, anniversary)"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Input
              placeholder="What are their interests? (e.g. cooking, music, sports)"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Input
              type="number"
              placeholder="What is your budget? (e.g. 50)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleGenerateGifts}
              disabled={loading || !relationship || !occasion || !budget || !interests.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 btn-modern"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finding gifts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find Gifts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {giftIdeas && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-none shadow-card bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">✨ Gift Suggestions</CardTitle>
                    <p className="text-gray-600">
                      For your {relationship} who likes {interests}, for {occasion} with a ${budget} budget
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {source === "ai" ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        AI Generated
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        Curated Products
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GiftResultsDisplay giftIdeas={giftIdeas} source={source} />

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                    <ExternalLink className="h-4 w-4" />
                    Shopping Tips
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Click any store button to search for the specific product</li>
                    <li>• Compare prices across different stores for the best deals</li>
                    <li>• Check customer reviews and ratings before purchasing</li>
                    <li>• Look for similar products if exact items are unavailable</li>
                    <li>• Images are representative - actual products may vary</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    )
  }

  // Advanced Mode (existing detailed form)
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-sm border">
          <button
            onClick={() => setSimpleMode(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              simpleMode ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
            }`}
          >
            <Zap className="w-4 h-4 inline mr-1" />
            Quick Mode
          </button>
          <button
            onClick={() => setSimpleMode(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !simpleMode ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-1" />
            Advanced
          </button>
        </div>
      </div>

      <Card className="border-none shadow-card bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Advanced Gift Finder</CardTitle>
          <p className="text-gray-600">Get specific product recommendations with images and direct shopping links</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="relationship">
                Relationship <span className="text-red-500">*</span>
              </Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mom">Mom</SelectItem>
                  <SelectItem value="dad">Dad</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="coworker">Coworker</SelectItem>
                  <SelectItem value="boss">Boss</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="neighbor">Neighbor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion">
                Occasion <span className="text-red-500">*</span>
              </Label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="Christmas">Christmas</SelectItem>
                  <SelectItem value="Valentine's Day">Valentine's Day</SelectItem>
                  <SelectItem value="Mother's Day">Mother's Day</SelectItem>
                  <SelectItem value="Father's Day">Father's Day</SelectItem>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="housewarming">Housewarming</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="just because">Just Because</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">
                Budget ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="1"
                max="10000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">
              Their Interests <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="interests"
              placeholder="e.g., cooking, photography, yoga, gaming, gardening, music, reading, coffee, fitness..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-sm text-gray-500">
              Be specific about their hobbies and interests to get the best product recommendations
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handleGenerateGifts}
            disabled={loading || !relationship || !occasion || !budget || !interests.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-white btn-modern"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Perfect Products...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Find Gift Ideas with Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {giftIdeas && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-card bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Gift Recommendations</CardTitle>
                  <p className="text-gray-600">
                    For your {relationship} who likes {interests}, for {occasion} with a ${budget} budget
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {source === "ai" ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI Generated
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Curated Products
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <GiftResultsDisplay giftIdeas={giftIdeas} source={source} />

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <ExternalLink className="h-4 w-4" />
                  Shopping Tips
                </div>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Click any store button to search for the specific product</li>
                  <li>• Compare prices across different stores for the best deals</li>
                  <li>• Check customer reviews and ratings before purchasing</li>
                  <li>• Look for similar products if exact items are unavailable</li>
                  <li>• Images are representative - actual products may vary</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

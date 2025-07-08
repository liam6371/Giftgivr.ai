"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GiftResultsDisplay } from "@/components/gift-results-display"

export default function SimpleGiftFinder() {
  const [formData, setFormData] = useState({
    relationship: "",
    occasion: "",
    interests: "",
    budget: "",
  })
  const [results, setResults] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [source, setSource] = useState<"ai" | "database" | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateGifts = async () => {
    if (!formData.relationship || !formData.occasion || !formData.budget || !formData.interests) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")
    setResults("")

    try {
      const res = await fetch("/api/giftgen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationship: formData.relationship,
          occasion: formData.occasion,
          interests: formData.interests,
          budget: Number.parseInt(formData.budget),
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResults(data.gifts)
      setSource(data.source)
    } catch (err) {
      setError("Failed to generate gift ideas. Please try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🎁 GiftGivr.ai</h1>
            <p className="text-center text-gray-600 mb-8">Find the perfect gift in seconds with AI</p>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="relationship"
                placeholder="Who is the gift for? (e.g. sister, friend, coworker)"
                value={formData.relationship}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="occasion"
                placeholder="What is the occasion? (e.g. birthday, anniversary)"
                value={formData.occasion}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="interests"
                placeholder="What are their interests? (e.g. cooking, music, sports)"
                value={formData.interests}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="budget"
                type="number"
                placeholder="What is your budget? (e.g. 50)"
                value={formData.budget}
                onChange={handleChange}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
              )}

              <button
                onClick={generateGifts}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Finding gifts..." : "Find Gifts"}
              </button>
            </div>

            {results && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">✨ Gift Suggestions:</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <GiftResultsDisplay giftIdeas={results} source={source} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

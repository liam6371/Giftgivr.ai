import { type NextRequest, NextResponse } from "next/server"
import { searchGoogleShopping } from "@/lib/product-search"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const products = await searchGoogleShopping(query)

    if (products.length === 0) {
      return NextResponse.json({ error: "No shopping results found" }, { status: 404 })
    }

    return NextResponse.json({ products, source: "serpapi-google-shopping" })
  } catch (error) {
    console.error("SerpAPI Google Shopping error:", error)
    return NextResponse.json({ error: "Failed to fetch Google Shopping results" }, { status: 500 })
  }
}

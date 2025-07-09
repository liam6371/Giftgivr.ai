import { type NextRequest, NextResponse } from "next/server"
import { searchAwinProducts } from "@/lib/awin-search"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const products = await searchAwinProducts(query)

    if (products.length === 0) {
      return NextResponse.json({ error: "No AWIN results found" }, { status: 404 })
    }

    return NextResponse.json({ products, source: "awin" })
  } catch (error) {
    console.error("AWIN search error:", error)
    return NextResponse.json({ error: "Failed to fetch AWIN results" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { searchEtsyProducts } from "@/lib/etsy-search"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const products = await searchEtsyProducts(query)

    if (products.length === 0) {
      return NextResponse.json({ error: "No Etsy results found" }, { status: 404 })
    }

    return NextResponse.json({ products, source: "etsy" })
  } catch (error) {
    console.error("Etsy search error:", error)
    return NextResponse.json({ error: "Failed to fetch Etsy results" }, { status: 500 })
  }
}

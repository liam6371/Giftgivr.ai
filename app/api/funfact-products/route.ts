import { type NextRequest, NextResponse } from "next/server"
import { searchFunFactProducts, getFunFactFeaturedProducts } from "@/lib/funfact-search"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || "fun"
    const featured = searchParams.get("featured") === "true"
    const debug = searchParams.get("debug") === "true"

    if (debug) {
      console.log("🔍 Fun Fact Co. API Debug Mode")
      console.log("Search term:", search)
      console.log("Featured mode:", featured)
      console.log("Environment check:")
      console.log("- AWIN_API_KEY exists:", !!process.env.AWIN_API_KEY)
      console.log("- AWIN_PUBLISHER_ID:", process.env.AWIN_PUBLISHER_ID || "2104361")
    }

    let products
    if (featured) {
      products = await getFunFactFeaturedProducts()
    } else {
      products = await searchFunFactProducts(search)
    }

    if (debug) {
      console.log("✅ Products found:", products.length)
      if (products.length > 0) {
        console.log("Sample product:", products[0])
      }
    }

    return NextResponse.json({
      products,
      count: products.length,
      source: "funfact-co",
      advertiser_id: "114020",
      search_term: search,
      featured_mode: featured,
      debug_info: debug
        ? {
            api_key_configured: !!process.env.AWIN_API_KEY,
            publisher_id: process.env.AWIN_PUBLISHER_ID || "2104361",
            timestamp: new Date().toISOString(),
          }
        : undefined,
    })
  } catch (error) {
    console.error("Fun Fact Co. API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch Fun Fact Co. products",
        details: error instanceof Error ? error.message : "Unknown error",
        advertiser_id: "114020",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { search = "fun" } = await request.json()

    const products = await searchFunFactProducts(search)

    return NextResponse.json({
      products,
      count: products.length,
      source: "funfact-co",
      search_term: search,
    })
  } catch (error) {
    console.error("Fun Fact Co. search error:", error)
    return NextResponse.json({ error: "Failed to search Fun Fact Co. products" }, { status: 500 })
  }
}

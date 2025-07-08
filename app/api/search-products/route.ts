import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const apiKey = process.env.SERPAPI_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "SerpAPI key not configured" }, { status: 500 })
    }

    // Use SerpAPI for Google Shopping results
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=shop&hl=en&gl=us&api_key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.shopping_results || data.shopping_results.length === 0) {
      return NextResponse.json({ error: "No shopping results found" }, { status: 404 })
    }

    const products = data.shopping_results.slice(0, 5).map((item: any) => ({
      title: item.title,
      price: item.extracted_price || item.price || "Price varies",
      image: item.thumbnail,
      link: item.link,
      source: item.source,
      rating: item.rating,
      reviews: item.reviews,
      position: item.position,
    }))

    return NextResponse.json({ products, source: "serpapi-google-shopping" })
  } catch (error) {
    console.error("SerpAPI Google Shopping error:", error)
    return NextResponse.json({ error: "Failed to fetch Google Shopping results" }, { status: 500 })
  }
}

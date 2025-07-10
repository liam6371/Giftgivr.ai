import { type NextRequest, NextResponse } from "next/server"
import { getAwinDisplayProducts, getAwinProductsByCategory } from "@/lib/awin-display-products"

export async function POST(request: NextRequest) {
  try {
    const { category, limit = 10 } = await request.json()

    let products
    if (category) {
      products = await getAwinProductsByCategory(category)
    } else {
      products = await getAwinDisplayProducts()
    }

    // Apply limit
    const limitedProducts = products.slice(0, limit)

    return NextResponse.json({
      products: limitedProducts,
      count: limitedProducts.length,
      source: "awin",
    })
  } catch (error) {
    console.error("AWIN display products error:", error)
    return NextResponse.json({ error: "Failed to fetch AWIN products" }, { status: 500 })
  }
}

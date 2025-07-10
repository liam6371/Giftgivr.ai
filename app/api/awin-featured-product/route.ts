import { NextResponse } from "next/server"
import { getAwinFeaturedProduct } from "@/lib/awin-display-products"

export async function GET() {
  try {
    const product = await getAwinFeaturedProduct()

    if (!product) {
      return NextResponse.json({ error: "No featured product available" }, { status: 404 })
    }

    return NextResponse.json({ product, source: "awin" })
  } catch (error) {
    console.error("AWIN featured product error:", error)
    return NextResponse.json({ error: "Failed to fetch featured product" }, { status: 500 })
  }
}

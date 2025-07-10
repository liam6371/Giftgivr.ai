import { type NextRequest, NextResponse } from "next/server"
import { getAwinMerchants } from "@/lib/awin-search"

export async function GET(request: NextRequest) {
  try {
    const merchants = await getAwinMerchants()

    if (merchants.length === 0) {
      return NextResponse.json({ error: "No merchants found or API not configured" }, { status: 404 })
    }

    return NextResponse.json({ merchants, count: merchants.length })
  } catch (error) {
    console.error("AWIN merchants API error:", error)
    return NextResponse.json({ error: "Failed to fetch AWIN merchants" }, { status: 500 })
  }
}

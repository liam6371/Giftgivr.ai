import { NextResponse } from "next/server"

export async function GET() {
  try {
    const advertiserId = process.env.CERQULAR_ADVERTISER_ID || "114021"
    const awinToken = process.env.AWIN_API_KEY
    const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"

    if (!awinToken) {
      return NextResponse.json({ success: false, error: "AWIN API key not configured" }, { status: 500 })
    }

    console.log(`🔍 Fetching Cerqular products from advertiser ${advertiserId}`)

    const response = await fetch(
      `https://api.awin.com/publishers/${publisherId}/products?advertiserId=${advertiserId}`,
      {
        headers: {
          Authorization: `Bearer ${awinToken}`,
          "User-Agent": "GiftGivr/1.0",
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`AWIN API Error: ${response.status} - ${errorText}`)
      throw new Error(`AWIN API Error: ${response.status}`)
    }

    const data = await response.json()

    console.log(`✅ Found ${data.length || 0} Cerqular products`)

    // Transform the data to match our product interface
    const products = (data || []).map((item: any) => ({
      title: item.product_name || item.title || item.name,
      price: item.display_price || item.price || "Price varies",
      image: item.image_url || item.product_image || item.thumbnail,
      link: item.deep_link || item.click_url || item.product_url,
      source: "Cerqular",
      description: item.description || item.short_description,
      product_id: item.product_id || item.id,
      merchant_product_id: item.merchant_product_id,
      category: item.category_name || item.category,
    }))

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      source: "cerqular",
      advertiser_id: advertiserId,
      data: data, // Keep original data for debugging
    })
  } catch (error) {
    console.error("Cerqular API Error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { search } = await request.json()
    const advertiserId = process.env.CERQULAR_ADVERTISER_ID || "114021"
    const awinToken = process.env.AWIN_API_KEY
    const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"

    if (!awinToken) {
      return NextResponse.json({ success: false, error: "AWIN API key not configured" }, { status: 500 })
    }

    console.log(`🔍 Searching Cerqular for: ${search}`)

    // Try product search with query
    const url = `https://api.awin.com/publishers/${publisherId}/products?advertiserId=${advertiserId}&search=${encodeURIComponent(search || "sustainable")}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${awinToken}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`AWIN API Error: ${response.status} - ${errorText}`)
      throw new Error(`AWIN API Error: ${response.status}`)
    }

    const data = await response.json()

    console.log(`✅ Found ${data.length || 0} Cerqular products for "${search}"`)

    // Transform the data
    const products = (data || []).map((item: any) => ({
      title: item.product_name || item.title || item.name,
      price: item.display_price || item.price || "Price varies",
      image: item.image_url || item.product_image || item.thumbnail,
      link: item.deep_link || item.click_url || item.product_url,
      source: "Cerqular",
      description: item.description || item.short_description,
      product_id: item.product_id || item.id,
      merchant_product_id: item.merchant_product_id,
      category: item.category_name || item.category,
    }))

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      source: "cerqular",
      search_term: search,
      advertiser_id: advertiserId,
    })
  } catch (error) {
    console.error("Cerqular search error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

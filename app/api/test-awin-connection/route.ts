import { NextResponse } from "next/server"

export async function GET() {
  const AWIN_API_KEY = process.env.AWIN_API_KEY
  const PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID || "2104361"

  console.log("🔧 Testing AWIN Connection...")
  console.log("Publisher ID:", PUBLISHER_ID)
  console.log("API Key exists:", !!AWIN_API_KEY)

  if (!AWIN_API_KEY) {
    return NextResponse.json({
      success: false,
      error: "AWIN_API_KEY not found in environment variables",
      publisher_id: PUBLISHER_ID,
    })
  }

  try {
    // Test with a simple API call to get your account info
    const response = await fetch(`https://api.awin.com/publishers/${PUBLISHER_ID}/accounts`, {
      headers: {
        Authorization: `Bearer ${AWIN_API_KEY}`,
        "User-Agent": "GiftGivr/1.0",
      },
    })

    const responseText = await response.text()

    console.log("📡 AWIN Test Response Status:", response.status)
    console.log("📡 AWIN Test Response:", responseText.substring(0, 200))

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      publisher_id: PUBLISHER_ID,
      response_preview: responseText.substring(0, 200),
      has_api_key: true,
    })
  } catch (error) {
    console.error("❌ AWIN Connection Test Failed:", error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      publisher_id: PUBLISHER_ID,
      has_api_key: true,
    })
  }
}

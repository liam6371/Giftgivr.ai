import { NextResponse } from "next/server"

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      AWIN_API_KEY: !!process.env.AWIN_API_KEY,
      AWIN_API_KEY_LENGTH: process.env.AWIN_API_KEY?.length || 0,
      AWIN_PUBLISHER_ID: process.env.AWIN_PUBLISHER_ID || "2104361",
      NEXT_PUBLIC_AWIN_PUBLISHER_ID: process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID,
    },
    tests: [] as any[],
  }

  const AWIN_API_KEY = process.env.AWIN_API_KEY
  const PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID || "2104361"

  if (!AWIN_API_KEY) {
    diagnostics.tests.push({
      test: "API Key Check",
      status: "FAIL",
      message: "AWIN_API_KEY environment variable not found",
    })
    return NextResponse.json(diagnostics)
  }

  // Test 1: Basic API Authentication
  try {
    console.log("🧪 Test 1: Basic API Authentication")
    const response = await fetch(`https://api.awin.com/publishers/${PUBLISHER_ID}/accounts`, {
      headers: {
        Authorization: `Bearer ${AWIN_API_KEY}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    const responseText = await response.text()
    diagnostics.tests.push({
      test: "Basic Authentication",
      status: response.ok ? "PASS" : "FAIL",
      statusCode: response.status,
      response: responseText.substring(0, 200),
    })
  } catch (error) {
    diagnostics.tests.push({
      test: "Basic Authentication",
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 2: Check Merchant Relationships
  try {
    console.log("🧪 Test 2: Merchant Relationships")
    const response = await fetch(`https://api.awin.com/publishers/${PUBLISHER_ID}/relationships`, {
      headers: {
        Authorization: `Bearer ${AWIN_API_KEY}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    const data = await response.json()
    const funFactRelationship = data.relationships?.find((r: any) => r.merchant_id === "114020")

    diagnostics.tests.push({
      test: "Merchant Relationships",
      status: response.ok ? "PASS" : "FAIL",
      statusCode: response.status,
      totalMerchants: data.relationships?.length || 0,
      funFactCoStatus: funFactRelationship ? `Found - Status: ${funFactRelationship.relationship_status}` : "Not found",
      funFactCoDetails: funFactRelationship || null,
    })
  } catch (error) {
    diagnostics.tests.push({
      test: "Merchant Relationships",
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  // Test 3: Try Different Product API Endpoints
  const endpoints = [
    {
      name: "Products API",
      url: `https://api.awin.com/publishers/${PUBLISHER_ID}/products?advertiserIds=114020&limit=5`,
    },
    {
      name: "Product Data API",
      url: `https://api.awin.com/publishers/${PUBLISHER_ID}/productdata?advertiserIds=114020&limit=5`,
    },
    {
      name: "Commission Factory API",
      url: `https://api.awin.com/publishers/${PUBLISHER_ID}/commissionfactory/productdata?advertiserIds=114020&limit=5`,
    },
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`🧪 Test 3: ${endpoint.name}`)
      const response = await fetch(endpoint.url, {
        headers: {
          Authorization: `Bearer ${AWIN_API_KEY}`,
          "User-Agent": "GiftGivr/1.0",
          Accept: "application/json",
        },
      })

      const responseText = await response.text()
      let parsedData = null
      try {
        parsedData = JSON.parse(responseText)
      } catch (e) {
        // Response is not JSON
      }

      diagnostics.tests.push({
        test: endpoint.name,
        status: response.ok ? "PASS" : "FAIL",
        statusCode: response.status,
        url: endpoint.url,
        responseType: parsedData ? "JSON" : "TEXT",
        dataStructure: parsedData
          ? Array.isArray(parsedData)
            ? `Array[${parsedData.length}]`
            : `Object{${Object.keys(parsedData).join(", ")}}`
          : "N/A",
        sampleResponse: responseText.substring(0, 300),
      })
    } catch (error) {
      diagnostics.tests.push({
        test: endpoint.name,
        status: "ERROR",
        url: endpoint.url,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Test 4: Check API Permissions
  try {
    console.log("🧪 Test 4: API Permissions")
    const response = await fetch(`https://api.awin.com/publishers/${PUBLISHER_ID}/reports/advertiser-stats`, {
      headers: {
        Authorization: `Bearer ${AWIN_API_KEY}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    diagnostics.tests.push({
      test: "API Permissions (Reports)",
      status: response.ok ? "PASS" : "FAIL",
      statusCode: response.status,
      message: response.ok ? "Reports API accessible" : "Reports API not accessible",
    })
  } catch (error) {
    diagnostics.tests.push({
      test: "API Permissions (Reports)",
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

  return NextResponse.json(diagnostics)
}

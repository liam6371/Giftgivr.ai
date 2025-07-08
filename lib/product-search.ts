interface ProductResult {
  name: string
  price: string
  url: string
  image?: string
  store: string
}

export async function searchForProducts(productName: string, maxResults = 3): Promise<ProductResult[]> {
  const results: ProductResult[] = []

  try {
    // Search multiple sources
    const [amazonResults, etsyResults] = await Promise.allSettled([searchAmazon(productName), searchEtsy(productName)])

    if (amazonResults.status === "fulfilled") {
      results.push(...amazonResults.value.slice(0, 2))
    }

    if (etsyResults.status === "fulfilled") {
      results.push(...etsyResults.value.slice(0, 1))
    }

    return results.slice(0, maxResults)
  } catch (error) {
    console.error("Product search error:", error)
    return []
  }
}

async function searchAmazon(query: string): Promise<ProductResult[]> {
  try {
    // Use a real-time product API service
    const response = await fetch(`https://api.scrapfly.io/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SCRAPFLY_API_KEY}`, // You'd need to sign up for this
      },
      body: JSON.stringify({
        url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        render_js: true,
        country: "US",
      }),
    })

    if (!response.ok) {
      throw new Error("Amazon search failed")
    }

    const data = await response.json()
    return parseAmazonResults(data.result.content)
  } catch (error) {
    console.error("Amazon search error:", error)
    return []
  }
}

async function searchEtsy(query: string): Promise<ProductResult[]> {
  try {
    // Alternative: Use Etsy's API (requires API key)
    const response = await fetch(
      `https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          "x-api-key": process.env.ETSY_API_KEY || "",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Etsy search failed")
    }

    const data = await response.json()
    return data.results.map((item: any) => ({
      name: item.title,
      price: `$${(item.price.amount / 100).toFixed(2)}`,
      url: item.url,
      image: item.images?.[0]?.url_570xN,
      store: "Etsy",
    }))
  } catch (error) {
    console.error("Etsy search error:", error)
    return []
  }
}

function parseAmazonResults(html: string): ProductResult[] {
  // This would parse the HTML to extract product info
  // For now, returning empty array since we need proper scraping setup
  return []
}

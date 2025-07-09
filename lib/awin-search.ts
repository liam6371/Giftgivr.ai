export interface AwinProduct {
  title: string
  price: string
  image?: string
  link: string
  source: string
  merchant_name?: string
  rating?: string
  reviews?: number
  description?: string
  category?: string
}

export async function searchAwinProducts(query: string): Promise<AwinProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    console.log("AWIN API credentials not configured")
    return []
  }

  try {
    // AWIN Product Search API endpoint
    const url = `https://productdata.awin.com/api/v1/products`

    const params = new URLSearchParams({
      apikey: awinApiKey,
      publisherId: awinPublisherId,
      query: query,
      limit: "10",
      sortBy: "relevance",
      language: "en",
      currency: "USD",
    })

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "GiftGivr/1.0",
      },
    })

    if (!response.ok) {
      console.error("AWIN API error:", response.status, await response.text())
      return []
    }

    const data = await response.json()

    if (!data.products || data.products.length === 0) {
      return []
    }

    return data.products.slice(0, 5).map((item: any) => ({
      title: item.product_name || item.title,
      price: item.display_price || `$${item.price}`,
      image: item.image_url || item.product_image,
      link: generateAwinDeepLink(item.merchant_product_id, item.merchant_id, awinPublisherId),
      source: item.merchant_name || "AWIN Partner",
      merchant_name: item.merchant_name,
      description: item.description,
      category: item.category_name,
      rating: item.average_rating ? `${item.average_rating}/5` : undefined,
      reviews: item.review_count,
    }))
  } catch (error) {
    console.error("AWIN search error:", error)
    return []
  }
}

// Generate AWIN deep link for affiliate tracking
function generateAwinDeepLink(productId: string, merchantId: string, publisherId: string): string {
  const baseUrl = `https://www.awin1.com/cread.php`
  const params = new URLSearchParams({
    awinmid: merchantId,
    awinaffid: publisherId,
    platform: "dl",
    ued: `https://example.com/product/${productId}`, // This would be the actual product URL
  })

  return `${baseUrl}?${params}`
}

// Alternative: Search specific merchants
export async function searchAwinMerchant(query: string, merchantId: string): Promise<AwinProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    return []
  }

  try {
    const url = `https://productdata.awin.com/api/v1/merchants/${merchantId}/products`

    const params = new URLSearchParams({
      apikey: awinApiKey,
      publisherId: awinPublisherId,
      query: query,
      limit: "5",
    })

    const response = await fetch(`${url}?${params}`)

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    return (
      data.products?.slice(0, 5).map((item: any) => ({
        title: item.product_name,
        price: item.display_price,
        image: item.image_url,
        link: generateAwinDeepLink(item.merchant_product_id, merchantId, awinPublisherId),
        source: item.merchant_name,
        merchant_name: item.merchant_name,
        description: item.description,
      })) || []
    )
  } catch (error) {
    console.error("AWIN merchant search error:", error)
    return []
  }
}

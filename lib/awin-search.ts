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
  merchant_id?: string
}

export async function searchAwinProducts(query: string): Promise<AwinProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    console.log("AWIN API credentials not configured")
    return []
  }

  try {
    // First, let's try the product search API
    // AWIN Product Search API endpoint
    const url = `https://api.awin.com/publishers/${awinPublisherId}/productdata/search`

    const params = new URLSearchParams({
      query: query,
      limit: "10",
      sortBy: "relevance",
      language: "en",
      currency: "USD",
    })

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
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
      title: item.product_name || item.title || item.name,
      price: item.display_price || item.price || "Price varies",
      image: item.image_url || item.product_image || item.thumbnail,
      link: generateAwinDeepLink(item.merchant_product_id || item.id, item.merchant_id, awinPublisherId),
      source: item.merchant_name || "AWIN Partner",
      merchant_name: item.merchant_name,
      description: item.description || item.short_description,
      category: item.category_name || item.category,
      merchant_id: item.merchant_id,
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
  // AWIN deep link format
  const baseUrl = `https://www.awin1.com/cread.php`
  const params = new URLSearchParams({
    awinmid: merchantId,
    awinaffid: publisherId,
    platform: "dl",
    ued: "", // This should be the actual product URL from the merchant
  })

  return `${baseUrl}?${params}`
}

// Get joined merchants
export async function getAwinMerchants(): Promise<any[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    return []
  }

  try {
    const url = `https://api.awin.com/publishers/${awinPublisherId}/relationships?status=joined`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("AWIN merchants API error:", response.status, await response.text())
      return []
    }

    const data = await response.json()
    return data.relationships || []
  } catch (error) {
    console.error("AWIN merchants error:", error)
    return []
  }
}

// Search specific merchant products
export async function searchAwinMerchantProducts(query: string, merchantId: string): Promise<AwinProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    return []
  }

  try {
    const url = `https://api.awin.com/publishers/${awinPublisherId}/productdata/merchant/${merchantId}`

    const params = new URLSearchParams({
      query: query,
      limit: "5",
    })

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("AWIN merchant products error:", response.status, await response.text())
      return []
    }

    const data = await response.json()

    return (
      data.products?.slice(0, 5).map((item: any) => ({
        title: item.product_name || item.title,
        price: item.display_price || item.price,
        image: item.image_url || item.product_image,
        link: generateAwinDeepLink(item.merchant_product_id || item.id, merchantId, awinPublisherId),
        source: item.merchant_name || "AWIN Partner",
        merchant_name: item.merchant_name,
        description: item.description,
        merchant_id: merchantId,
      })) || []
    )
  } catch (error) {
    console.error("AWIN merchant search error:", error)
    return []
  }
}

// Alternative approach: Use AWIN's commission factory API for product feeds
export async function searchAwinCommissionFactory(query: string): Promise<AwinProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    return []
  }

  try {
    // This uses the Commission Factory product search
    const url = `https://api.awin.com/publishers/${awinPublisherId}/commissionfactory/productdata`

    const params = new URLSearchParams({
      query: query,
      limit: "10",
      language: "en",
      currency: "USD",
    })

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("AWIN Commission Factory error:", response.status, await response.text())
      return []
    }

    const data = await response.json()

    if (!data || !data.length) {
      return []
    }

    return data.slice(0, 5).map((item: any) => ({
      title: item.product_name || item.title,
      price: item.display_price || `$${item.price}`,
      image: item.image_url,
      link: item.deep_link || generateAwinDeepLink(item.product_id, item.merchant_id, awinPublisherId),
      source: item.merchant_name,
      merchant_name: item.merchant_name,
      description: item.description,
      merchant_id: item.merchant_id,
    }))
  } catch (error) {
    console.error("AWIN Commission Factory search error:", error)
    return []
  }
}

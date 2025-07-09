export interface EtsyProduct {
  title: string
  price: string
  image?: string
  link: string
  source: string
  shop_name?: string
  rating?: string
  reviews?: number
}

export async function searchEtsyProducts(query: string): Promise<EtsyProduct[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const rapidApiHost = process.env.ETSY_API_HOST || "etsy-api3.p.rapidapi.com"

  if (!rapidApiKey) {
    console.log("RapidAPI key not configured for Etsy search")
    return []
  }

  try {
    const url = `https://${rapidApiHost}/search_listings`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": rapidApiHost,
      },
      body: JSON.stringify({
        query: query,
        limit: 5,
        sort_on: "relevancy",
      }),
    })

    if (!response.ok) {
      console.error("Etsy API error:", response.status, await response.text())
      return []
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return []
    }

    return data.results.slice(0, 5).map((item: any) => ({
      title: item.title,
      price: item.price ? `$${(item.price.amount / 100).toFixed(2)}` : "Price varies",
      image: item.images?.[0]?.url_570xN,
      link: item.url,
      source: "Etsy",
      shop_name: item.shop?.shop_name,
      rating: item.shop?.review_average ? `${item.shop.review_average}/5` : undefined,
      reviews: item.shop?.review_count,
    }))
  } catch (error) {
    console.error("Etsy search error:", error)
    return []
  }
}

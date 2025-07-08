export interface ProductSearchResult {
  title: string
  price: string
  image?: string
  link: string
  source: string
  rating?: string
  reviews?: number
  position?: number
}

export async function searchGoogleShopping(query: string): Promise<ProductSearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    throw new Error("SerpAPI key not configured")
  }

  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=shop&hl=en&gl=us&api_key=${apiKey}`

  const response = await fetch(url)
  const data = await response.json()

  if (!data.shopping_results || data.shopping_results.length === 0) {
    return []
  }

  return data.shopping_results.slice(0, 5).map((item: any) => ({
    title: item.title,
    price: item.extracted_price || item.price || "Price varies",
    image: item.thumbnail,
    link: item.link,
    source: item.source,
    rating: item.rating,
    reviews: item.reviews,
    position: item.position,
  }))
}

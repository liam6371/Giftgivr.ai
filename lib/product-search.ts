import { searchEtsyProducts } from "./etsy-search"
import { searchAwinProducts } from "./awin-search"

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

export async function searchAllProducts(query: string): Promise<ProductSearchResult[]> {
  const results: ProductSearchResult[] = []

  try {
    // Search Google Shopping
    const googleResults = await searchGoogleShopping(query)
    results.push(...googleResults)
  } catch (error) {
    console.error("Google Shopping search failed:", error)
  }

  try {
    // Search AWIN
    const awinResults = await searchAwinProducts(query)
    results.push(
      ...awinResults.map((product) => ({
        title: product.title,
        price: product.price,
        image: product.image,
        link: product.link,
        source: product.source,
        rating: product.rating,
        reviews: product.reviews,
      })),
    )
  } catch (error) {
    console.error("AWIN search failed:", error)
  }

  try {
    // Search Etsy
    const etsyResults = await searchEtsyProducts(query)
    results.push(
      ...etsyResults.map((product) => ({
        title: product.title,
        price: product.price,
        image: product.image,
        link: product.link,
        source: product.source,
        rating: product.rating,
        reviews: product.reviews,
      })),
    )
  } catch (error) {
    console.error("Etsy search failed:", error)
  }

  // Sort by relevance and remove duplicates
  const uniqueResults = results.filter(
    (product, index, self) => index === self.findIndex((p) => p.title.toLowerCase() === product.title.toLowerCase()),
  )

  return uniqueResults.slice(0, 10) // Return top 10 results from all sources
}

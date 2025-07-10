import { getAwinMerchants, searchAwinMerchantProducts } from "./awin-search"

export interface DisplayProduct {
  name: string
  price: number
  imageUrl: string
  affiliateLink: string
  category?: string
  merchant_name?: string
  description?: string
}

// Fetch real products from your AWIN merchants for display
export async function getAwinDisplayProducts(): Promise<DisplayProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const awinPublisherId = process.env.AWIN_PUBLISHER_ID

  if (!awinApiKey || !awinPublisherId) {
    console.log("AWIN credentials not configured, using fallback products")
    return getFallbackProducts()
  }

  try {
    // Get your joined merchants first
    const merchants = await getAwinMerchants()

    if (merchants.length === 0) {
      console.log("No AWIN merchants found, using fallback products")
      return getFallbackProducts()
    }

    const allProducts: DisplayProduct[] = []

    // Search popular categories across your merchants
    const searchTerms = [
      "headphones",
      "coffee maker",
      "yoga mat",
      "gaming mouse",
      "skincare",
      "bluetooth speaker",
      "fitness tracker",
      "kitchen gadgets",
      "home decor",
      "tech accessories",
    ]

    // Try to get products from multiple merchants
    for (const merchant of merchants.slice(0, 5)) {
      // Limit to first 5 merchants
      for (const term of searchTerms.slice(0, 2)) {
        // 2 terms per merchant
        try {
          const products = await searchAwinMerchantProducts(term, merchant.merchant_id)

          const convertedProducts = products.map((product) => ({
            name: product.title,
            price: parsePrice(product.price),
            imageUrl: product.image || "/placeholder.svg?height=300&width=300",
            affiliateLink: product.link,
            category: categorizeProduct(product.title),
            merchant_name: product.merchant_name,
            description: product.description,
          }))

          allProducts.push(...convertedProducts)

          if (allProducts.length >= 20) break // Stop when we have enough products
        } catch (error) {
          console.error(`Error fetching products from merchant ${merchant.merchant_id}:`, error)
        }
      }
      if (allProducts.length >= 20) break
    }

    // If we got products, return them, otherwise use fallback
    if (allProducts.length > 0) {
      console.log(`Fetched ${allProducts.length} real AWIN products`)
      return allProducts.slice(0, 15) // Return top 15 products
    } else {
      console.log("No AWIN products found, using fallback")
      return getFallbackProducts()
    }
  } catch (error) {
    console.error("Error fetching AWIN display products:", error)
    return getFallbackProducts()
  }
}

// Helper function to parse price strings
function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^0-9.]/g, "")
  const price = Number.parseFloat(cleaned)
  return isNaN(price) ? 29.99 : price
}

// Helper function to categorize products
function categorizeProduct(title: string): string {
  const titleLower = title.toLowerCase()

  if (titleLower.includes("headphone") || titleLower.includes("speaker") || titleLower.includes("audio")) {
    return "tech"
  }
  if (titleLower.includes("game") || titleLower.includes("gaming") || titleLower.includes("console")) {
    return "gaming"
  }
  if (titleLower.includes("kitchen") || titleLower.includes("coffee") || titleLower.includes("cook")) {
    return "kitchen"
  }
  if (titleLower.includes("fitness") || titleLower.includes("yoga") || titleLower.includes("exercise")) {
    return "fitness"
  }
  if (titleLower.includes("beauty") || titleLower.includes("skincare") || titleLower.includes("cosmetic")) {
    return "beauty"
  }

  return "general"
}

// Fallback products in case AWIN API fails
function getFallbackProducts(): DisplayProduct[] {
  return [
    {
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Headphones",
      affiliateLink: "#",
      category: "tech",
      description: "High-quality wireless headphones with noise cancellation",
    },
    {
      name: "Smart Coffee Maker",
      price: 129.99,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Coffee+Maker",
      affiliateLink: "#",
      category: "kitchen",
      description: "Programmable coffee maker with smartphone app control",
    },
    {
      name: "Yoga Mat Premium",
      price: 49.99,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Yoga+Mat",
      affiliateLink: "#",
      category: "fitness",
      description: "Non-slip premium yoga mat for all fitness levels",
    },
    {
      name: "Gaming Wireless Mouse",
      price: 59.99,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Gaming+Mouse",
      affiliateLink: "#",
      category: "gaming",
      description: "High-precision gaming mouse with RGB lighting",
    },
    {
      name: "Skincare Gift Set",
      price: 89.99,
      imageUrl: "/placeholder.svg?height=300&width=300&text=Skincare+Set",
      affiliateLink: "#",
      category: "beauty",
      description: "Complete skincare routine with natural ingredients",
    },
  ]
}

// Get products by category
export async function getAwinProductsByCategory(category: string): Promise<DisplayProduct[]> {
  const allProducts = await getAwinDisplayProducts()
  return allProducts.filter((product) => product.category === category)
}

// Get featured product
export async function getAwinFeaturedProduct(): Promise<DisplayProduct | null> {
  const products = await getAwinDisplayProducts()

  // Return the most expensive product as featured, or first one
  if (products.length === 0) return null

  return products.reduce((prev, current) => (prev.price > current.price ? prev : current))
}

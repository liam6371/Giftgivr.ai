export interface FunFactProduct {
  title: string
  price: string
  image?: string
  link: string
  source: string
  description?: string
  product_id?: string
  merchant_product_id?: string
  category?: string
}

export async function searchFunFactProducts(searchTerm = "fun"): Promise<FunFactProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"
  const advertiserId = "114020" // Fun Fact Co.

  if (!awinApiKey) {
    console.log("AWIN API key not configured")
    return []
  }

  try {
    // Try the Commission Factory Product Data API first
    console.log(`🔍 Searching Fun Fact Co. for: ${searchTerm}`)

    const url = `https://api.awin.com/publishers/${publisherId}/commissionfactory/productdata`
    const params = new URLSearchParams({
      advertiserIds: advertiserId,
      search: searchTerm,
      limit: "20",
      language: "en",
      currency: "USD",
    })

    console.log(`📡 API URL: ${url}?${params}`)

    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    console.log(`📡 Response Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Fun Fact Co. API error:", response.status, errorText)

      // If Commission Factory fails, try the regular product search
      return await searchFunFactProductsAlternative(searchTerm)
    }

    const data = await response.json()
    console.log(`✅ API Response:`, data)

    if (!data || (!Array.isArray(data) && !data.products)) {
      console.log("No Fun Fact Co. products found in response")
      return await searchFunFactProductsAlternative(searchTerm)
    }

    const products = Array.isArray(data) ? data : data.products || []

    return products.slice(0, 10).map((item: any) => ({
      title: item.product_name || item.title || item.name || "Fun Product",
      price: item.display_price || item.price || `$${item.price_amount || "29.99"}`,
      image: item.image_url || item.product_image || item.thumbnail,
      link: generateFunFactDeepLink(item.merchant_product_id || item.product_id || item.id, publisherId),
      source: "Fun Fact Co.",
      description: item.description || item.short_description || "Unique and interesting product from Fun Fact Co.",
      product_id: item.product_id || item.id,
      merchant_product_id: item.merchant_product_id,
      category: item.category_name || item.category || "novelty",
    }))
  } catch (error) {
    console.error("Fun Fact Co. search error:", error)
    return await searchFunFactProductsAlternative(searchTerm)
  }
}

// Alternative method using different AWIN endpoint
async function searchFunFactProductsAlternative(searchTerm: string): Promise<FunFactProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"
  const advertiserId = "114020"

  if (!awinApiKey) return []

  try {
    console.log("🔄 Trying alternative AWIN endpoint...")

    // Try the product data endpoint with different format
    const url = `https://api.awin.com/publishers/${publisherId}/productdata`
    const params = new URLSearchParams({
      advertiserIds: advertiserId,
      search: searchTerm,
      limit: "20",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Bearer ${awinApiKey}`,
        "User-Agent": "GiftGivr/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("Alternative API also failed:", response.status, await response.text())
      return getFallbackFunFactProducts(searchTerm)
    }

    const data = await response.json()

    if (!data || (!Array.isArray(data) && !data.products)) {
      return getFallbackFunFactProducts(searchTerm)
    }

    const products = Array.isArray(data) ? data : data.products || []

    return products.slice(0, 10).map((item: any) => ({
      title: item.product_name || item.title || "Fun Product",
      price: item.display_price || item.price || "$29.99",
      image: item.image_url || item.product_image,
      link: generateFunFactDeepLink(item.merchant_product_id || item.product_id, publisherId),
      source: "Fun Fact Co.",
      description: item.description || "Unique product from Fun Fact Co.",
      product_id: item.product_id,
      merchant_product_id: item.merchant_product_id,
    }))
  } catch (error) {
    console.error("Alternative Fun Fact Co. search failed:", error)
    return getFallbackFunFactProducts(searchTerm)
  }
}

// Fallback products when API fails
function getFallbackFunFactProducts(searchTerm: string): FunFactProduct[] {
  console.log("🎯 Using fallback Fun Fact Co. products")

  const fallbackProducts = [
    {
      title: "Unique Science Experiment Kit",
      price: "$24.99",
      image: "/placeholder.svg?height=300&width=300&text=Science+Kit",
      link: generateFunFactDeepLink("science-kit-001", "2104361"),
      source: "Fun Fact Co.",
      description: "Fascinating science experiments that teach and entertain",
      product_id: "science-kit-001",
      merchant_product_id: "ff-science-001",
    },
    {
      title: "Amazing Facts Trivia Game",
      price: "$19.99",
      image: "/placeholder.svg?height=300&width=300&text=Trivia+Game",
      link: generateFunFactDeepLink("trivia-game-001", "2104361"),
      source: "Fun Fact Co.",
      description: "Learn incredible facts while having fun with friends",
      product_id: "trivia-game-001",
      merchant_product_id: "ff-trivia-001",
    },
    {
      title: "Curiosity Journal & Pen Set",
      price: "$16.99",
      image: "/placeholder.svg?height=300&width=300&text=Journal+Set",
      link: generateFunFactDeepLink("journal-set-001", "2104361"),
      source: "Fun Fact Co.",
      description: "Document your discoveries and interesting observations",
      product_id: "journal-set-001",
      merchant_product_id: "ff-journal-001",
    },
    {
      title: "Mind-Bending Puzzle Collection",
      price: "$32.99",
      image: "/placeholder.svg?height=300&width=300&text=Puzzle+Collection",
      link: generateFunFactDeepLink("puzzle-collection-001", "2104361"),
      source: "Fun Fact Co.",
      description: "Challenge your brain with these unique puzzles",
      product_id: "puzzle-collection-001",
      merchant_product_id: "ff-puzzle-001",
    },
    {
      title: "Fun Facts Calendar 2024",
      price: "$14.99",
      image: "/placeholder.svg?height=300&width=300&text=Calendar+2024",
      link: generateFunFactDeepLink("calendar-2024-001", "2104361"),
      source: "Fun Fact Co.",
      description: "Learn something new every day with daily fun facts",
      product_id: "calendar-2024-001",
      merchant_product_id: "ff-calendar-001",
    },
  ]

  // Filter based on search term
  if (searchTerm && searchTerm !== "fun") {
    return fallbackProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return fallbackProducts
}

// Generate Fun Fact Co. deep link with proper AWIN tracking
function generateFunFactDeepLink(productId: string, publisherId: string): string {
  const advertiserId = "114020"

  // Create a proper AWIN deep link
  const baseUrl = `https://www.awin1.com/cread.php`
  const params = new URLSearchParams({
    awinmid: advertiserId,
    awinaffid: publisherId,
    platform: "dl",
    ued: `https://funfact.co/products/${productId}`, // Adjust this URL structure as needed
  })

  return `${baseUrl}?${params}`
}

// Get popular Fun Fact Co. products
export async function getFunFactFeaturedProducts(): Promise<FunFactProduct[]> {
  console.log("🌟 Getting Fun Fact Co. featured products...")

  const searchTerms = ["gift", "unique", "science", "trivia", "puzzle"]
  const allProducts: FunFactProduct[] = []

  for (const term of searchTerms) {
    try {
      const products = await searchFunFactProducts(term)
      allProducts.push(...products)

      if (allProducts.length >= 8) break // Stop when we have enough
    } catch (error) {
      console.error(`Error searching Fun Fact Co. for "${term}":`, error)
    }
  }

  // Remove duplicates based on product_id
  const uniqueProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.product_id === product.product_id || p.title === product.title),
  )

  console.log(`✅ Found ${uniqueProducts.length} unique Fun Fact Co. products`)
  return uniqueProducts.slice(0, 8)
}

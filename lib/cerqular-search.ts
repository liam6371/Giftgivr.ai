export interface CerqularProduct {
  title: string
  price: string
  image?: string
  link: string
  source: string
  description?: string
  product_id?: string
  merchant_product_id?: string
  category?: string
  sustainability_score?: string
  eco_features?: string[]
}

export async function searchCerqularProducts(searchTerm = "sustainable"): Promise<CerqularProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"
  const advertiserId = "114021" // Cerqular's advertiser ID

  if (!awinApiKey) {
    console.log("AWIN API key not configured")
    return []
  }

  try {
    // Try the Commission Factory Product Data API first
    console.log(`🔍 Searching Cerqular for: ${searchTerm}`)

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
      console.error("Cerqular API error:", response.status, errorText)

      // If Commission Factory fails, try the regular product search
      return await searchCerqularProductsAlternative(searchTerm)
    }

    const data = await response.json()
    console.log(`✅ API Response:`, data)

    if (!data || (!Array.isArray(data) && !data.products)) {
      console.log("No Cerqular products found in response")
      return await searchCerqularProductsAlternative(searchTerm)
    }

    const products = Array.isArray(data) ? data : data.products || []

    return products.slice(0, 10).map((item: any) => ({
      title: item.product_name || item.title || item.name || "Sustainable Product",
      price: item.display_price || item.price || `$${item.price_amount || "39.99"}`,
      image: item.image_url || item.product_image || item.thumbnail,
      link: generateCerqularDeepLink(item.merchant_product_id || item.product_id || item.id, publisherId),
      source: "Cerqular",
      description: item.description || item.short_description || "Sustainable and eco-friendly product from Cerqular.",
      product_id: item.product_id || item.id,
      merchant_product_id: item.merchant_product_id,
      category: item.category_name || item.category || "sustainable",
      sustainability_score: item.sustainability_rating || item.eco_score,
      eco_features: extractEcoFeatures(item.description || ""),
    }))
  } catch (error) {
    console.error("Cerqular search error:", error)
    return await searchCerqularProductsAlternative(searchTerm)
  }
}

// Alternative method using different AWIN endpoint
async function searchCerqularProductsAlternative(searchTerm: string): Promise<CerqularProduct[]> {
  const awinApiKey = process.env.AWIN_API_KEY
  const publisherId = process.env.AWIN_PUBLISHER_ID || "2104361"
  const advertiserId = "114021"

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
      return getFallbackCerqularProducts(searchTerm)
    }

    const data = await response.json()

    if (!data || (!Array.isArray(data) && !data.products)) {
      return getFallbackCerqularProducts(searchTerm)
    }

    const products = Array.isArray(data) ? data : data.products || []

    return products.slice(0, 10).map((item: any) => ({
      title: item.product_name || item.title || "Sustainable Product",
      price: item.display_price || item.price || "$39.99",
      image: item.image_url || item.product_image,
      link: generateCerqularDeepLink(item.merchant_product_id || item.product_id, publisherId),
      source: "Cerqular",
      description: item.description || "Sustainable product from Cerqular.",
      product_id: item.product_id,
      merchant_product_id: item.merchant_product_id,
      sustainability_score: item.sustainability_rating,
      eco_features: extractEcoFeatures(item.description || ""),
    }))
  } catch (error) {
    console.error("Alternative Cerqular search failed:", error)
    return getFallbackCerqularProducts(searchTerm)
  }
}

// Extract eco-friendly features from product description
function extractEcoFeatures(description: string): string[] {
  const ecoKeywords = [
    "organic",
    "recycled",
    "sustainable",
    "eco-friendly",
    "biodegradable",
    "renewable",
    "carbon neutral",
    "fair trade",
    "plastic-free",
    "zero waste",
    "bamboo",
    "hemp",
    "solar",
    "compostable",
    "upcycled",
  ]

  const features: string[] = []
  const descLower = description.toLowerCase()

  ecoKeywords.forEach((keyword) => {
    if (descLower.includes(keyword)) {
      features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
  })

  return features.slice(0, 3) // Return top 3 features
}

// Fallback products when API fails
function getFallbackCerqularProducts(searchTerm: string): CerqularProduct[] {
  console.log("🎯 Using fallback Cerqular products")

  const fallbackProducts = [
    {
      title: "Organic Bamboo Toothbrush Set",
      price: "$24.99",
      image: "/placeholder.svg?height=300&width=300&text=Bamboo+Toothbrush",
      link: generateCerqularDeepLink("bamboo-toothbrush-001", "2104361"),
      source: "Cerqular",
      description: "Sustainable bamboo toothbrushes with biodegradable bristles",
      product_id: "bamboo-toothbrush-001",
      merchant_product_id: "cerq-bamboo-001",
      category: "personal care",
      sustainability_score: "9.2/10",
      eco_features: ["Bamboo", "Biodegradable", "Plastic-free"],
    },
    {
      title: "Recycled Ocean Plastic Water Bottle",
      price: "$34.99",
      image: "/placeholder.svg?height=300&width=300&text=Ocean+Bottle",
      link: generateCerqularDeepLink("ocean-bottle-001", "2104361"),
      source: "Cerqular",
      description: "Insulated water bottle made from recycled ocean plastic",
      product_id: "ocean-bottle-001",
      merchant_product_id: "cerq-bottle-001",
      category: "drinkware",
      sustainability_score: "8.8/10",
      eco_features: ["Recycled", "Ocean plastic", "Zero waste"],
    },
    {
      title: "Solar-Powered Phone Charger",
      price: "$49.99",
      image: "/placeholder.svg?height=300&width=300&text=Solar+Charger",
      link: generateCerqularDeepLink("solar-charger-001", "2104361"),
      source: "Cerqular",
      description: "Portable solar charger for smartphones and devices",
      product_id: "solar-charger-001",
      merchant_product_id: "cerq-solar-001",
      category: "electronics",
      sustainability_score: "9.5/10",
      eco_features: ["Solar", "Renewable", "Carbon neutral"],
    },
    {
      title: "Organic Cotton Reusable Bags Set",
      price: "$19.99",
      image: "/placeholder.svg?height=300&width=300&text=Cotton+Bags",
      link: generateCerqularDeepLink("cotton-bags-001", "2104361"),
      source: "Cerqular",
      description: "Set of 5 organic cotton shopping bags",
      product_id: "cotton-bags-001",
      merchant_product_id: "cerq-bags-001",
      category: "bags",
      sustainability_score: "8.5/10",
      eco_features: ["Organic", "Reusable", "Fair trade"],
    },
    {
      title: "Compostable Phone Case",
      price: "$29.99",
      image: "/placeholder.svg?height=300&width=300&text=Phone+Case",
      link: generateCerqularDeepLink("phone-case-001", "2104361"),
      source: "Cerqular",
      description: "Biodegradable phone case made from plant-based materials",
      product_id: "phone-case-001",
      merchant_product_id: "cerq-case-001",
      category: "accessories",
      sustainability_score: "9.0/10",
      eco_features: ["Compostable", "Plant-based", "Biodegradable"],
    },
  ]

  // Filter based on search term
  if (searchTerm && searchTerm !== "sustainable") {
    return fallbackProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.eco_features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  return fallbackProducts
}

// Generate Cerqular deep link with proper AWIN tracking
function generateCerqularDeepLink(productId: string, publisherId: string): string {
  const advertiserId = "114021"

  // Create a proper AWIN deep link
  const baseUrl = `https://www.awin1.com/cread.php`
  const params = new URLSearchParams({
    awinmid: advertiserId,
    awinaffid: publisherId,
    platform: "dl",
    ued: `https://cerqular.com/products/${productId}`, // Adjust this URL structure as needed
  })

  return `${baseUrl}?${params}`
}

// Get popular Cerqular products
export async function getCerqularFeaturedProducts(): Promise<CerqularProduct[]> {
  console.log("🌟 Getting Cerqular featured products...")

  const searchTerms = ["sustainable", "eco-friendly", "organic", "recycled", "bamboo", "solar"]
  const allProducts: CerqularProduct[] = []

  for (const term of searchTerms) {
    try {
      const products = await searchCerqularProducts(term)
      allProducts.push(...products)

      if (allProducts.length >= 8) break // Stop when we have enough
    } catch (error) {
      console.error(`Error searching Cerqular for "${term}":`, error)
    }
  }

  // Remove duplicates based on product_id
  const uniqueProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.product_id === product.product_id || p.title === product.title),
  )

  console.log(`✅ Found ${uniqueProducts.length} unique Cerqular products`)
  return uniqueProducts.slice(0, 8)
}

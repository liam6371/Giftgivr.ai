// Curated database of real products with affiliate links
export const curatedProducts = {
  tech: [
    {
      name: "Apple AirPods Pro (2nd Generation)",
      price: "$249.00",
      url: "https://amzn.to/3YeBUW9", // Your actual affiliate link
      description: "Active Noise Cancellation, Transparency Mode, Personalized Spatial Audio",
      keywords: ["airpods", "wireless", "earbuds", "apple", "noise canceling"],
    },
    {
      name: "Anker Portable Charger PowerCore 10000",
      price: "$21.99",
      url: "https://amzn.to/anker-powercore", // Your actual affiliate link
      description: "Ultra-compact 10000mAh portable charger with PowerIQ technology",
      keywords: ["portable", "charger", "battery", "anker", "powerbank"],
    },
  ],
  kitchen: [
    {
      name: "Ninja Foodi Personal Blender BN401",
      price: "$79.99",
      url: "https://amzn.to/ninja-blender", // Your actual affiliate link
      description: "18oz cup, perfect for smoothies and protein shakes",
      keywords: ["ninja", "blender", "personal", "smoothie", "single serve"],
    },
  ],
  home: [
    {
      name: "Anthropologie Monogram Mug",
      price: "$16.00",
      url: "https://www.anthropologie.com/monogram-mug", // Direct link
      description: "Personalized ceramic mug with gold letter accent",
      keywords: ["mug", "personalized", "monogram", "anthropologie", "ceramic"],
    },
  ],
}

export function findCuratedProduct(searchQuery: string, interests: string[], budget: number) {
  const allProducts = Object.values(curatedProducts).flat()

  // Score products based on keyword matches and budget
  const scoredProducts = allProducts.map((product) => {
    let score = 0
    const queryWords = searchQuery.toLowerCase().split(" ")
    const interestWords = interests.join(" ").toLowerCase().split(" ")

    // Check keyword matches
    queryWords.forEach((word) => {
      if (product.keywords.some((keyword) => keyword.includes(word))) {
        score += 2
      }
    })

    interestWords.forEach((word) => {
      if (product.keywords.some((keyword) => keyword.includes(word))) {
        score += 1
      }
    })

    // Budget consideration
    const price = Number.parseFloat(product.price.replace("$", ""))
    if (price <= budget * 1.2) {
      score += 1
    }

    return { ...product, score }
  })

  // Return top matches
  return scoredProducts
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
}

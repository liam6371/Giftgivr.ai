export interface GiftSuggestion {
  name: string
  description: string
  priceRange: string
  category: string
  interests?: string[]
  searchTerms?: string
  exampleStores?: string[]
}

export const giftDatabase: Record<string, Record<string, GiftSuggestion[]>> = {
  mom: {
    birthday: [
      {
        name: "Personalized Birth Flower Necklace",
        description: "Custom necklace featuring her birth month flower in gold or silver",
        priceRange: "$30-80",
        category: "jewelry",
        interests: ["jewelry", "fashion", "personalized gifts"],
        searchTerms: "birth flower necklace personalized custom",
        exampleStores: ["Etsy", "Amazon", "Pandora"],
      },
      {
        name: "Aromatherapy Shower Steamers Set",
        description: "Eucalyptus and lavender shower steamers for spa-like experience",
        priceRange: "$25-50",
        category: "wellness",
        interests: ["wellness", "self-care", "aromatherapy", "spa"],
        searchTerms: "aromatherapy shower steamers eucalyptus lavender",
        exampleStores: ["Amazon", "Bath & Body Works", "Target"],
      },
      {
        name: "Custom Family Recipe Cutting Board",
        description: "Engraved bamboo cutting board with her favorite family recipe",
        priceRange: "$35-75",
        category: "kitchen",
        interests: ["cooking", "family", "personalized gifts", "kitchen"],
        searchTerms: "custom recipe cutting board engraved bamboo",
        exampleStores: ["Etsy", "Amazon", "Williams Sonoma"],
      },
      {
        name: "Premium Tea Tasting Set",
        description: "Curated collection of loose leaf teas from around the world",
        priceRange: "$40-90",
        category: "food",
        interests: ["tea", "beverages", "wellness", "gourmet"],
        searchTerms: "premium tea tasting set loose leaf collection",
        exampleStores: ["Teavana", "Amazon", "David's Tea"],
      },
      {
        name: "Silk Pillowcase and Eye Mask Set",
        description: "100% mulberry silk pillowcase and matching sleep mask",
        priceRange: "$45-100",
        category: "sleep",
        interests: ["sleep", "skincare", "luxury", "wellness"],
        searchTerms: "silk pillowcase eye mask set mulberry",
        exampleStores: ["Amazon", "Slip", "Brooklinen"],
      },
    ],
  },
  dad: {
    birthday: [
      {
        name: "Smart Meat Thermometer",
        description: "Bluetooth-enabled thermometer for perfect grilling every time",
        priceRange: "$50-120",
        category: "grilling",
        interests: ["grilling", "cooking", "technology", "BBQ"],
        searchTerms: "smart meat thermometer bluetooth wireless grilling",
        exampleStores: ["Amazon", "Weber", "Williams Sonoma"],
      },
      {
        name: "Craft Beer Brewing Kit",
        description: "Complete starter kit to brew his own craft beer at home",
        priceRange: "$60-150",
        category: "hobby",
        interests: ["beer", "brewing", "DIY", "crafts"],
        searchTerms: "craft beer brewing kit starter home brewing",
        exampleStores: ["Amazon", "Northern Brewer", "Williams Sonoma"],
      },
      {
        name: "Leather Desk Organizer",
        description: "Handcrafted leather organizer for pens, phone, and accessories",
        priceRange: "$40-100",
        category: "office",
        interests: ["organization", "leather goods", "office", "accessories"],
        searchTerms: "leather desk organizer handcrafted office accessories",
        exampleStores: ["Etsy", "Amazon", "Pottery Barn"],
      },
    ],
  },
  friend: {
    birthday: [
      {
        name: "Succulent Terrarium Kit",
        description: "Complete DIY kit with glass container, succulents, and decorative stones",
        priceRange: "$25-60",
        category: "plants",
        interests: ["plants", "gardening", "DIY", "home decor"],
        searchTerms: "succulent terrarium kit DIY glass container",
        exampleStores: ["Amazon", "Etsy", "Home Depot"],
      },
      {
        name: "Portable Bluetooth Record Player",
        description: "Vintage-style turntable with Bluetooth connectivity",
        priceRange: "$80-200",
        category: "music",
        interests: ["music", "vinyl", "technology", "vintage"],
        searchTerms: "portable bluetooth record player turntable vintage",
        exampleStores: ["Amazon", "Urban Outfitters", "Best Buy"],
      },
    ],
  },
  partner: {
    birthday: [
      {
        name: "Couples Massage Kit",
        description: "Complete set with oils, candles, and massage tools for romantic evenings",
        priceRange: "$40-80",
        category: "romance",
        interests: ["romance", "wellness", "self-care", "couples"],
        searchTerms: "couples massage kit romantic oils candles",
        exampleStores: ["Amazon", "Spencer's", "Target"],
      },
      {
        name: "Star Map Print",
        description: "Custom star map showing the night sky from your special date",
        priceRange: "$30-70",
        category: "personalized",
        interests: ["romance", "personalized gifts", "astronomy", "art"],
        searchTerms: "custom star map print personalized night sky",
        exampleStores: ["Etsy", "Amazon", "Shutterfly"],
      },
    ],
  },
}

export function generateGiftSuggestionsWithLinks(
  relationship: string,
  occasion: string,
  budget: number,
  interests: string,
): string {
  const relationshipGifts = giftDatabase[relationship.toLowerCase()]
  if (!relationshipGifts) {
    return generateGenericGiftsWithLinks(budget, interests)
  }

  const occasionGifts = relationshipGifts[occasion.toLowerCase()] || relationshipGifts.birthday || []

  if (occasionGifts.length === 0) {
    return generateGenericGiftsWithLinks(budget, interests)
  }

  // Filter by interests
  const interestKeywords = interests
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean)

  let filteredGifts = occasionGifts.filter((gift) =>
    gift.interests?.some((giftInterest) =>
      interestKeywords.some((keyword) => giftInterest.toLowerCase().includes(keyword)),
    ),
  )

  if (filteredGifts.length === 0) {
    filteredGifts = occasionGifts
  }

  // Filter by budget
  const budgetFilteredGifts = filteredGifts.filter((gift) => {
    const priceRange = gift.priceRange.replace(/[^0-9-]/g, "")
    const maxPrice = Number.parseInt(priceRange.split("-")[1] || priceRange)
    return maxPrice <= budget * 1.2
  })

  const selectedGifts =
    budgetFilteredGifts.length >= 5
      ? budgetFilteredGifts.slice(0, 5)
      : [...budgetFilteredGifts, ...filteredGifts.slice(0, 5 - budgetFilteredGifts.length)]

  let result = `Here are 5 specific gift ideas for your ${relationship} who likes ${interests}, for ${occasion}, with a budget of $${budget}:\n\n`

  selectedGifts.forEach((gift, index) => {
    const searchQuery = encodeURIComponent(gift.searchTerms || gift.name)
    const amazonLink = `https://www.amazon.com/s?k=${searchQuery}`
    const etsyLink = `https://www.etsy.com/search?q=${searchQuery}`
    const googleLink = `https://www.google.com/search?tbm=shop&q=${searchQuery}`

    result += `**${gift.name}**\n`
    result += `Description: ${gift.description} (${gift.priceRange})\n`
    result += `• Amazon: ${amazonLink}\n`
    result += `• Etsy: ${etsyLink}\n`
    result += `• Google Shopping: ${googleLink}\n\n`
  })

  return result
}

function generateGenericGiftsWithLinks(budget: number, interests: string): string {
  const genericGifts = [
    {
      name: "Personalized Photo Album",
      description: "Custom photo book with meaningful memories",
      searchTerms: "personalized photo album custom book",
    },
    {
      name: "Premium Scented Candle Set",
      description: "High-quality candles in beautiful packaging",
      searchTerms: "premium scented candle set luxury",
    },
    {
      name: "Gourmet Snack Box",
      description: "Curated selection of artisanal treats",
      searchTerms: "gourmet snack box artisanal treats",
    },
    {
      name: "Cozy Throw Blanket",
      description: "Soft, warm blanket perfect for relaxation",
      searchTerms: "cozy throw blanket soft warm",
    },
    {
      name: "Indoor Plant Kit",
      description: "Everything needed to grow beautiful indoor plants",
      searchTerms: "indoor plant kit gardening starter",
    },
  ]

  let result = `Here are gift ideas for someone who likes ${interests} with a $${budget} budget:\n\n`

  genericGifts.forEach((gift, index) => {
    const searchQuery = encodeURIComponent(gift.searchTerms)
    const amazonLink = `https://www.amazon.com/s?k=${searchQuery}`
    const etsyLink = `https://www.etsy.com/search?q=${searchQuery}`
    const googleLink = `https://www.google.com/search?tbm=shop&q=${searchQuery}`

    result += `**${gift.name}**\n`
    result += `Description: ${gift.description}\n`
    result += `• Amazon: ${amazonLink}\n`
    result += `• Etsy: ${etsyLink}\n`
    result += `• Google Shopping: ${googleLink}\n\n`
  })

  return result
}

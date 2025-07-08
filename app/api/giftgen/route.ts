import { type NextRequest, NextResponse } from "next/server"
import { generateGiftSuggestionsWithLinks } from "@/lib/gift-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { relationship, occasion, budget, interests } = body

    // Validate required fields
    if (!relationship || !occasion || !budget || !interests) {
      return NextResponse.json(
        { error: "Missing required fields: relationship, occasion, budget, or interests" },
        { status: 400 },
      )
    }

    // Check if OpenAI API key is configured
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `You are a gift expert. Suggest 5 highly specific and unique gift products for a ${relationship} who is interested in ${interests}. The gifts should be appropriate for a ${occasion} and cost around $${budget}.

For each gift, provide:
1. The exact product name with brand and model (be very specific)
2. A brief description of why it's perfect
3. The estimated price
4. The exact search query that would find this specific product on shopping sites

Be extremely specific with product names. Include brand names, model numbers, sizes, colors, or versions when relevant.

Format your response exactly like this:

**[Exact Product Name with Brand/Model/Specifications]**
Description: [Why this specific product is perfect for this person]
Price: $[estimated price]
Search Query: [exact terms to find this specific product]

Example format:
**Ninja Foodi Personal Blender BN401 18oz Cup**
Description: Perfect for single-serve smoothies and protein shakes, compact design ideal for small kitchens
Price: $79.99
Search Query: Ninja Foodi Personal Blender BN401 18oz

Continue this format for all 5 products.`

        console.log("Calling OpenAI API...")

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1200,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          let giftIdeas = data.choices?.[0]?.message?.content || "No ideas generated."

          // Post-process to find real products
          giftIdeas = await findRealProducts(giftIdeas)

          console.log("OpenAI response received and processed successfully")
          return NextResponse.json({ gifts: giftIdeas, source: "ai" })
        } else {
          const errorText = await response.text()
          console.log("OpenAI API error:", response.status, errorText)
          console.log("Falling back to local database")
        }
      } catch (error) {
        console.log("OpenAI API error, falling back to local database:", error)
      }
    } else {
      console.log("No OpenAI API key found, using local database")
    }

    // Fallback to local gift database
    console.log("Generating gifts from local database...")
    const giftIdeas = generateGiftSuggestionsWithLinks(relationship, occasion, budget, interests)
    return NextResponse.json({ gifts: giftIdeas, source: "database" })
  } catch (error) {
    console.error("Gift generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate gift ideas. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function findRealProducts(giftText: string): Promise<string> {
  // Parse the gift suggestions
  const sections = giftText.split(/\*\*([^*]+)\*\*/).filter(Boolean)
  let processedText = ""

  for (let i = 0; i < sections.length; i += 2) {
    const name = sections[i]?.trim()
    const content = sections[i + 1]?.trim()

    if (name && content) {
      processedText += `**${name}**\n`
      processedText += content

      // Extract search query
      const searchQueryMatch = content.match(/Search Query:\s*([^\n]+)/i)
      const searchQuery = searchQueryMatch?.[1]?.trim() || name

      try {
        // Try to find real products using different APIs
        const realProducts = await searchRealProducts(searchQuery)

        if (realProducts.length > 0) {
          processedText += `\n\n🛒 **Found Real Products:**\n`
          realProducts.forEach((product, index) => {
            processedText += `${index + 1}. **${product.name}** - ${product.price}\n`
            processedText += `   ${product.store}: ${product.url}\n`
          })
        } else {
          // Fallback to enhanced search links
          const encodedSearch = encodeURIComponent(searchQuery)
          processedText += `\n\n🔍 **Search Links:**\n`
          processedText += `• Amazon: https://www.amazon.com/s?k=${encodedSearch}\n`
          processedText += `• Google Shopping: https://www.google.com/search?tbm=shop&q=${encodedSearch}\n`
        }
      } catch (error) {
        console.error("Product search failed:", error)
        // Fallback to search links
        const encodedSearch = encodeURIComponent(searchQuery)
        processedText += `\n\n🔍 **Search Links:**\n`
        processedText += `• Amazon: https://www.amazon.com/s?k=${encodedSearch}\n`
        processedText += `• Google Shopping: https://www.google.com/search?tbm=shop&q=${encodedSearch}\n`
      }

      processedText += `\n\n`
    }
  }

  return processedText
}

async function searchRealProducts(
  query: string,
): Promise<Array<{ name: string; price: string; url: string; store: string }>> {
  const results = []

  try {
    // Option 1: Use RapidAPI's Real-time Product Search
    if (process.env.RAPIDAPI_KEY) {
      const response = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(query)}&country=us&language=en`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          return data.data.slice(0, 3).map((item: any) => ({
            name: item.product_title,
            price: item.offer?.price || "Price varies",
            url: item.product_page_url,
            store: item.source || "Online Store",
          }))
        }
      }
    }

    // Option 2: Use SerpAPI for Google Shopping results
    if (process.env.SERPAPI_KEY) {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.shopping_results && data.shopping_results.length > 0) {
          return data.shopping_results.slice(0, 3).map((item: any) => ({
            name: item.title,
            price: item.price,
            url: item.link,
            store: item.source,
          }))
        }
      }
    }
  } catch (error) {
    console.error("Real product search failed:", error)
  }

  return []
}

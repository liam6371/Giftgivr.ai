import { type NextRequest, NextResponse } from "next/server"
import { generateGiftSuggestionsWithLinks } from "@/lib/gift-database"
import { searchGoogleShopping } from "@/lib/product-search"

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
2. A brief description of why it's perfect for this person
3. The estimated price range
4. A precise search query that would find this product on Google Shopping

Be extremely specific with product names. Include brand names, model numbers, sizes, colors, or versions when relevant.

Format your response exactly like this:

**[Exact Product Name with Brand/Model/Specifications]**
Description: [Why this specific product is perfect for this person and occasion]
Price Range: $[min]-$[max]
Search Query: [precise search terms for Google Shopping]

Example:
**Ninja Foodi Personal Blender BN401 18oz Cup Black**
Description: Perfect for single-serve smoothies and protein shakes, compact design ideal for small kitchens and health-conscious individuals
Price Range: $70-$90
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
            max_tokens: 1500,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          let giftIdeas = data.choices?.[0]?.message?.content || "No ideas generated."

          // Post-process to find real products using Google Shopping
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
      const searchMatch = content.match(/Search Query:\s*([^\n]+)/i)
      const searchQuery = searchMatch?.[1]?.trim() || name

      try {
        // Search for real products using Google Shopping directly
        console.log(`Searching for: ${searchQuery}`)
        const products = await searchGoogleShopping(searchQuery)

        if (products && products.length > 0) {
          processedText += `\n\n🛒 **Real Products Found on Google Shopping:**\n`
          products.slice(0, 3).forEach((product, index) => {
            processedText += `${index + 1}. **${product.title}**\n`
            processedText += `   💰 Price: ${product.price}\n`
            processedText += `   🏪 Store: ${product.source}\n`

            if (product.rating) {
              processedText += `   ⭐ Rating: ${product.rating}`
              if (product.reviews) {
                processedText += ` (${product.reviews} reviews)`
              }
              processedText += `\n`
            }

            processedText += `   🔗 **Buy Now**: ${product.link}\n\n`
          })
        } else {
          // Fallback to search link
          const encodedSearch = encodeURIComponent(searchQuery)
          processedText += `\n\n🔍 **Search for this product**:\n`
          processedText += `• Google Shopping: https://www.google.com/search?tbm=shop&q=${encodedSearch}\n`
          processedText += `• Amazon: https://www.amazon.com/s?k=${encodedSearch}\n`
        }
      } catch (error) {
        console.error(`Product search failed for "${searchQuery}":`, error)
        // Fallback to search links
        const encodedSearch = encodeURIComponent(searchQuery)
        processedText += `\n\n🔍 **Search for this product**:\n`
        processedText += `• Google Shopping: https://www.google.com/search?tbm=shop&q=${encodedSearch}\n`
        processedText += `• Amazon: https://www.amazon.com/s?k=${encodedSearch}\n`
      }

      processedText += `\n`
    }
  }

  console.log("=== FINAL PROCESSED TEXT ===")
  console.log(processedText)
  console.log("=== END PROCESSED TEXT ===")
  return processedText
}

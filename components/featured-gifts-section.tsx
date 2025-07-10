"use client"
import { Button } from "@/components/ui/button"
import AwinProductGrid from "./awin-product-grid"

// Define the product type with required SiteStripe parameters
export interface AmazonProduct {
  name: string
  price: number
  imageUrl: string
  affiliateLink: string
  category?: string
}

export function FeaturedGiftsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pattern-bg opacity-50"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-primary text-sm font-medium mb-4">
            Top Picks
          </div>
          <h2 className="text-3xl font-bold tracking-tight relative">
            Featured Gift Ideas
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></div>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">
            Discover our hand-picked selection of popular gifts that are sure to delight your loved ones
          </p>
        </div>

        <AwinProductGrid title="" limit={5} />

        <div className="mt-12 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 btn-modern">View All Gift Ideas</Button>
        </div>
      </div>
    </section>
  )
}

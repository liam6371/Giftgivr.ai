import { Card, CardContent } from "@/components/ui/card"
import { Search, Gift, ThumbsUp } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-12 md:py-24 bg-pewter/20">
      <div className="container px-4 md:px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Browse Categories</h3>
              <p className="text-gray-700">Explore our curated gift categories to find inspiration for any occasion.</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Gift className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Discover Perfect Gifts</h3>
              <p className="text-gray-700">
                Find thoughtful, high-quality gifts that match your recipient's interests.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <ThumbsUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">Make Someone Happy</h3>
              <p className="text-gray-700">
                Purchase with confidence knowing you've found a gift they'll truly appreciate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

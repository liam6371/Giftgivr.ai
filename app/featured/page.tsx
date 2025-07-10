import { SiteHeader } from "@/components/site-header"
import AwinFeaturedProduct from "@/components/awin-featured-product"
import AmazonDisclosure from "@/components/amazon-disclosure"

export default function FeaturedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-snow">
          <div className="container px-4 md:px-6">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Featured Gift</h2>
                <p className="text-gray-500 max-w-[700px] mx-auto">Our top recommendation this month</p>
              </div>
              <div className="max-w-4xl mx-auto">
                <AwinFeaturedProduct />
              </div>
            </div>
          </div>
        </section>
        <AmazonDisclosure />
      </main>
    </div>
  )
}

import { SiteHeader } from "@/components/site-header"
import { GiftFinder } from "@/components/gift-finder"
import AmazonProductGrid from "@/components/amazon-product-grid"
import AmazonDisclosure from "@/components/amazon-disclosure"

export default function GiftIdeasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-snow">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <GiftFinder />
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Recommended Gifts</h2>
                <AmazonProductGrid title="" />
              </div>
            </div>
          </div>
        </section>
        <AmazonDisclosure />
      </main>
    </div>
  )
}

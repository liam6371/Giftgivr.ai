import { SiteHeader } from "@/components/site-header"
import GiftCategoryTabs from "@/components/gift-category-tabs"
import AmazonDisclosure from "@/components/amazon-disclosure"
import AwinProductGrid from "@/components/awin-product-grid"

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-snow">
          <div className="container px-4 md:px-6">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Gift Categories</h2>
                <p className="text-gray-500 max-w-[700px] mx-auto">
                  Browse gifts by category to find the perfect match
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <GiftCategoryTabs />
              </div>
              <AwinProductGrid title="" category="tech" />
              <AwinProductGrid title="" category="gaming" />
            </div>
          </div>
        </section>
        <AmazonDisclosure />
      </main>
    </div>
  )
}

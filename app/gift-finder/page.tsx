import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AIGiftFinder } from "@/components/ai-gift-finder"

export default function GiftFinderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-24 pattern-bg">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold tracking-tight">
                AI-Powered <span className="text-gradient">Gift Finder</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Let artificial intelligence help you discover the perfect gift based on your specific needs and budget.
              </p>
            </div>
            <AIGiftFinder />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GiftCategoryShowcase } from "@/components/gift-category-showcase"
import { TestimonialSection } from "@/components/testimonial-section"
import { FeatureSection } from "@/components/feature-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { FeaturedGiftsSection } from "@/components/featured-gifts-section"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 pattern-bg">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-bg"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="flex flex-col gap-6 relative z-10">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Find the <span className="text-gradient">Perfect Gift</span> for Everyone
                  </h1>
                  <p className="mt-4 text-xl text-gray-600">
                    Discover thoughtfully curated gift ideas for every occasion, personality, and budget.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/gift-finder">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg btn-modern">
                      Gift Smarter
                    </Button>
                  </Link>
                  <Link href="/featured">
                    <Button
                      variant="outline"
                      className="border-primary text-primary px-8 py-6 text-lg btn-modern bg-transparent"
                    >
                      Browse Featured
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white" />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">2,000+</span> happy gift recipients this month
                  </p>
                </div>
              </div>
              <div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-xl bg-gray-100 md:order-last shadow-soft animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 z-10 rounded-xl"></div>
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Gift giving celebration"
                  width={800}
                  height={500}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full bg-primary/10 animate-pulse-slow hidden md:block"></div>
          <div className="absolute bottom-1/4 right-10 w-8 h-8 rounded-full bg-secondary/10 animate-pulse-slow hidden md:block"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-accent/10 animate-pulse-slow hidden md:block"></div>
        </section>

        {/* Featured Gifts Section */}
        <FeaturedGiftsSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Feature Section */}
        <FeatureSection />

        {/* Gift Category Showcase */}
        <GiftCategoryShowcase />

        {/* Testimonial Section */}
        <TestimonialSection />

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}

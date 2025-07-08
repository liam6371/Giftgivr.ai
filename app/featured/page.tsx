import { SiteHeader } from "@/components/site-header"
import FeaturedProduct from "@/components/featured-product"
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
                <FeaturedProduct
                  name="Bose QuietComfort Wireless Headphones"
                  price={349.99}
                  imageUrl="https://m.media-amazon.com/images/I/51aw022aEaL.__AC_SX300_SY300_QL70_FMwebp_.jpg"
                  affiliateLink="https://amzn.to/446MsdB"
                  description="Experience world-class noise cancellation with these premium wireless headphones from Bose. Perfect for travel, work, or just enjoying your music without distractions."
                  features={[
                    "World-class noise cancellation for better concentration",
                    "High-fidelity audio for an immersive listening experience",
                    "Comfortable design for all-day wear",
                    "Up to 24 hours of battery life on a single charge",
                    "Built-in microphone for clear calls and voice assistant access",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
        <AmazonDisclosure />
      </main>
    </div>
  )
}

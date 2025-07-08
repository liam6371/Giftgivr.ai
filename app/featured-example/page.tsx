import FeaturedProduct from "@/components/featured-product"
import AmazonDisclosure from "@/components/amazon-disclosure"

export default function FeaturedProductPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Featured Gift</h1>
        <p className="text-gray-500 text-center mb-8">Our top recommendation this month</p>

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

        <AmazonDisclosure />
      </div>
    </div>
  )
}

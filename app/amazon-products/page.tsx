import AmazonProductGrid from "@/components/amazon-product-grid"
import AmazonDisclosure from "@/components/amazon-disclosure"

export default function AmazonProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Gift Ideas</h1>
        <p className="text-gray-500 text-center mb-8">Perfect gifts for everyone on your list</p>

        <div className="space-y-16">
          {/* All Products */}
          <AmazonProductGrid title="Recommended Products" />

          {/* Products by Category */}
          <AmazonProductGrid title="Tech Gifts" category="tech" />
          <AmazonProductGrid title="Gaming Gifts" category="gaming" />
        </div>

        <AmazonDisclosure />
      </div>
    </div>
  )
}

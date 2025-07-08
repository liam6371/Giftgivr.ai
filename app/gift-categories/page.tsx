import GiftCategoryTabs from "@/components/gift-category-tabs"
import AmazonDisclosure from "@/components/amazon-disclosure"

export default function GiftCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Gift Categories</h1>
        <p className="text-gray-500 text-center mb-8">Browse gifts by category</p>

        <div className="max-w-4xl mx-auto">
          <GiftCategoryTabs />
        </div>

        <AmazonDisclosure />
      </div>
    </div>
  )
}

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AmazonProductGrid from "./amazon-product-grid"

export default function GiftCategoryTabs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shop by Category</h2>

      <Tabs defaultValue="tech" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-pewter/20">
          <TabsTrigger value="tech" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Tech Gifts
          </TabsTrigger>
          <TabsTrigger value="gaming" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Gaming Gifts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tech">
          <AmazonProductGrid title="" category="tech" />
        </TabsContent>

        <TabsContent value="gaming">
          <AmazonProductGrid title="" category="gaming" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

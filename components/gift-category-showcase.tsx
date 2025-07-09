"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Laptop, Gift, Shirt, Home, Gamepad2 } from "lucide-react"
import { motion } from "framer-motion"

const categories = [
  {
    name: "Tech Gifts",
    description: "The latest gadgets and electronics",
    icon: Laptop,
    color: "bg-blue-100 text-blue-600",
    link: "/gift-finder", // Changed to existing page
  },
  {
    name: "Personalized Gifts",
    description: "Unique and customized presents",
    icon: Gift,
    color: "bg-purple-100 text-purple-600",
    link: "/gift-finder", // Changed to existing page
  },
  {
    name: "Fashion & Accessories",
    description: "Stylish clothing and accessories",
    icon: Shirt,
    color: "bg-pink-100 text-pink-600",
    link: "/gift-finder", // Changed to existing page
  },
  {
    name: "Home & Kitchen",
    description: "Practical and decorative home items",
    icon: Home,
    color: "bg-green-100 text-green-600",
    link: "/gift-finder", // Changed to existing page
  },
  {
    name: "Gaming & Entertainment",
    description: "Fun games and entertainment options",
    icon: Gamepad2,
    color: "bg-red-100 text-red-600",
    link: "/gift-finder", // Changed to existing page
  },
]

export function GiftCategoryShowcase() {
  return (
    <section className="py-20 relative overflow-hidden bg-pewter/10">
      <div className="absolute inset-0 pattern-bg opacity-30"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-primary text-sm font-medium mb-4">
            Browse By Category
          </div>
          <h2 className="text-3xl font-bold tracking-tight relative">
            Explore Gift Categories
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></div>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">
            Browse our wide selection of gift categories to find the perfect present
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.link}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-none shadow-card bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 ${category.color}`}
                    >
                      <category.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-primary/10 w-full">
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// Define the product type with required SiteStripe parameters
export interface AmazonProduct {
  name: string
  price: number
  imageUrl: string
  affiliateLink: string
  category?: string
}

// Products with SiteStripe parameters provided by the user
const products: AmazonProduct[] = [
  {
    name: "Apple AirPods Pro (2nd Generation)",
    price: 199.0,
    imageUrl: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SX522_.jpg",
    affiliateLink: "https://amzn.to/3YeBUW9",
    category: "tech",
  },
  {
    name: "Echo Dot (5th Gen) Smart Speaker",
    price: 49.99,
    imageUrl: "https://m.media-amazon.com/images/I/71168bJdfnL._AC_SY450_.jpg",
    affiliateLink: "https://amzn.to/3G3t1Zd",
    category: "tech",
  },
  {
    name: "Kindle Paperwhite E-reader",
    price: 159.99,
    imageUrl: "https://m.media-amazon.com/images/I/61MdbBO+SEL._AC_SX679_.jpg",
    affiliateLink: "https://amzn.to/4lj8BMi",
    category: "tech",
  },
  {
    name: "Bose QuietComfort Wireless Headphones",
    price: 349.99,
    imageUrl: "https://m.media-amazon.com/images/I/51aw022aEaL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
    affiliateLink: "https://amzn.to/446MsdB",
    category: "tech",
  },
  {
    name: "Nintendo Switch Console",
    price: 279.99,
    imageUrl: "https://m.media-amazon.com/images/I/71wpE+ZIehL._SX522_.jpg",
    affiliateLink: "https://amzn.to/4l41nLM",
    category: "gaming",
  },
]

export function FeaturedGiftsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pattern-bg opacity-50"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-primary text-sm font-medium mb-4">
            Top Picks
          </div>
          <h2 className="text-3xl font-bold tracking-tight relative">
            Featured Gift Ideas
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></div>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">
            Discover our hand-picked selection of popular gifts that are sure to delight your loved ones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 btn-modern">View All Gift Ideas</Button>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index }: { product: AmazonProduct; index: number }) {
  const [imageError, setImageError] = useState(false)
  const { name, price, imageUrl, affiliateLink } = product

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <a href={affiliateLink} target="_blank" rel="nofollow noopener noreferrer" className="block h-full">
        <Card className="h-full overflow-hidden border-none shadow-soft hover:shadow-card transition-all duration-300">
          <div className="aspect-square relative bg-gray-50">
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <span className="text-sm">Product Image</span>
              </div>
            ) : (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
                onError={() => setImageError(true)}
              />
            )}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">{name}</h3>
              <p className="text-primary font-bold">${price.toFixed(2)}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary btn-modern"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                View on Amazon
              </Button>
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  )
}

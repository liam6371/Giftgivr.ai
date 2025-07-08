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

interface ProductGridProps {
  title?: string
  category?: string
}

export default function AmazonProductGrid({ title = "Recommended Products", category }: ProductGridProps) {
  // If category is provided, filter products by category
  const displayProducts = category ? products.filter((product) => product.category === category) : products

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: AmazonProduct }) {
  const [imageError, setImageError] = useState(false)
  const { name, price, imageUrl, affiliateLink } = product

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
      <a href={affiliateLink} target="_blank" rel="nofollow noopener noreferrer" className="block h-full">
        <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
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
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem]">{name}</h3>
              <p className="text-primary font-bold">${price.toFixed(2)}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
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

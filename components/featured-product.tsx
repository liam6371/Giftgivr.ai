"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface FeaturedProductProps {
  name: string
  price: number
  imageUrl: string
  affiliateLink: string
  description: string
  features?: string[]
}

export default function FeaturedProduct({
  name,
  price,
  imageUrl,
  affiliateLink,
  description,
  features = [],
}: FeaturedProductProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-secondary/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square relative bg-gray-50 p-4">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-sm">Product Image</span>
            </div>
          ) : (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              onError={() => setImageError(true)}
              priority
            />
          )}
        </div>

        <CardContent className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Featured Product
            </div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-primary font-bold text-2xl">${price.toFixed(2)}</p>
            <p className="text-gray-600">{description}</p>

            {features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Features:</h4>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-secondary mr-2">•</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a href={affiliateLink} target="_blank" rel="noreferrer nofollow noopener">
              <Button className="w-full bg-secondary hover:bg-secondary/90">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Amazon
              </Button>
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

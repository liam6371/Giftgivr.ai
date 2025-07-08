"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, Gift, ThumbsUp } from "lucide-react"
import { motion } from "framer-motion"

export function HowItWorksSection() {
  const features = [
    {
      icon: Search,
      title: "Browse Categories",
      description: "Explore our curated gift categories to find inspiration for any occasion.",
      color: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      icon: Gift,
      title: "Discover Perfect Gifts",
      description: "Find thoughtful, high-quality gifts that match your recipient's interests.",
      color: "bg-secondary/10",
      textColor: "text-secondary",
    },
    {
      icon: ThumbsUp,
      title: "Make Someone Happy",
      description: "Purchase with confidence knowing you've found a gift they'll truly appreciate.",
      color: "bg-accent/10",
      textColor: "text-accent",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-pewter/10">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-block bg-secondary/10 px-4 py-1.5 rounded-full text-secondary text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl font-bold tracking-tight relative">
            How It Works
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></div>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">Finding the perfect gift has never been easier</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 hidden md:block"></div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-none shadow-card h-full relative z-10 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div
                    className={`${feature.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>

                  {/* Step number */}
                  <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-xl font-bold text-primary">
                    {index + 1}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

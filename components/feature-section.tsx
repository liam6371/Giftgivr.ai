"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export function FeatureSection() {
  const features = [
    "Personalized gift recommendations",
    "Filter by occasion, recipient, and price",
    "Curated selections for every interest",
    "Exclusive deals and discounts",
    "Secure shopping with trusted retailers",
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-xl bg-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 z-10 rounded-xl"></div>
            <Image
              src="/placeholder.svg?height=500&width=800"
              alt="Gift finder feature"
              width={800}
              height={500}
              className="object-cover"
            />

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-lg bg-primary/20 rotate-12"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-secondary/20"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full text-primary text-sm font-medium mb-4">
                Smart Technology
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Our Smart Gift Finder Makes Gift-Giving Easy</h2>
              <p className="mt-4 text-lg text-gray-600">
                Our intelligent gift recommendation engine helps you find the perfect gift based on the recipient's
                interests, the occasion, and your budget.
              </p>
            </div>

            <ul className="grid gap-3 mt-2">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

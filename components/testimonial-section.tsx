"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Birthday Gift Shopper",
    content:
      "GiftGivr helped me find the perfect birthday present for my tech-savvy brother. The recommendations were spot-on!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Holiday Gift Shopper",
    content:
      "I was struggling to find gifts for my entire family until I discovered this site. Saved me so much time and everyone loved their presents!",
    rating: 5,
  },
  {
    name: "Jessica Williams",
    role: "Anniversary Gift Shopper",
    content:
      "Found an amazing anniversary gift for my husband that I never would have thought of on my own. He absolutely loved it!",
    rating: 4,
  },
]

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pattern-bg opacity-30"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-block bg-accent/10 px-4 py-1.5 rounded-full text-accent text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight relative">
            What Our Users Say
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></div>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl">
            Discover how GiftGivr has helped people find the perfect gifts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-none shadow-card h-full bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 relative">
                  {/* Quote mark */}
                  <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif">"</div>

                  <div className="flex mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-accent fill-accent" : "text-gray-300"}`}
                        />
                      ))}
                  </div>
                  <p className="text-gray-600 mb-6 relative z-10">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
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

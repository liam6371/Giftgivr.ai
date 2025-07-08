"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your newsletter service
    setSubmitted(true)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-10"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
        >
          <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-4 relative">
            Get Gift Ideas in Your Inbox
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-secondary rounded-full"></div>
          </h2>
          <p className="text-gray-600 mb-8 mt-4">
            Subscribe to our newsletter for personalized gift recommendations, exclusive deals, and gift-giving tips.
          </p>

          {submitted ? (
            <div className="glass-effect text-secondary p-6 rounded-xl w-full">
              <div className="text-lg font-medium mb-1">Thanks for subscribing!</div>
              <p>Check your inbox soon for gift ideas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 border-primary/20 focus:border-primary focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white btn-modern">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          )}

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/5 blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-secondary/5 blur-2xl"></div>
        </motion.div>
      </div>
    </section>
  )
}

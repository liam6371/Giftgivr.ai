"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function SiteHeader() {
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-gradient">
              giftgivr
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-10">
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/gift-finder" className="text-sm font-medium hover:text-primary transition-colors">
              Gift Finder
            </Link>
            <Link href="/featured" className="text-sm font-medium hover:text-primary transition-colors">
              Featured
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="relative w-full max-w-sm">
              <Input
                type="search"
                placeholder="Search gifts..."
                className="pr-8 border-primary/20 focus:border-primary focus:ring-primary"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-primary" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
              className="hover:bg-primary/10"
            >
              <Search className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
            </Button>
          )}

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 btn-modern bg-transparent"
              >
                Log In
              </Button>
            </Link>

            <Link href="/signup">
              <Button className="bg-secondary hover:bg-secondary/90 text-white btn-modern">Sign Up</Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t p-4 bg-white"
        >
          <nav className="flex flex-col gap-4">
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/gift-finder" className="text-sm font-medium hover:text-primary transition-colors">
              Gift Finder
            </Link>
            <Link href="/featured" className="text-sm font-medium hover:text-primary transition-colors">
              Featured
            </Link>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 btn-modern bg-transparent"
                disabled
              >
                Log In (Coming Soon)
              </Button>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white btn-modern" disabled>
                Sign Up (Coming Soon)
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}

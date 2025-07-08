"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Sparkles } from "lucide-react"
import Link from "next/link"

export function GiftFinder() {
  const [occasion, setOccasion] = useState("")
  const [recipient, setRecipient] = useState("")
  const [priceRange, setPriceRange] = useState("")

  return (
    <Card className="border-secondary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">Gift Finder</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="occasion" className="text-sm font-medium">
              Occasion
            </label>
            <Select value={occasion} onValueChange={setOccasion}>
              <SelectTrigger id="occasion">
                <SelectValue placeholder="Select occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="recipient" className="text-sm font-medium">
              Recipient
            </label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="coworker">Coworker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price Range
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under25">Under $25</SelectItem>
                <SelectItem value="25to50">$25 - $50</SelectItem>
                <SelectItem value="50to100">$50 - $100</SelectItem>
                <SelectItem value="100to200">$100 - $200</SelectItem>
                <SelectItem value="over200">Over $200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link href="/categories">
            <Button className="w-full bg-primary hover:bg-primary/90">Find Gifts</Button>
          </Link>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/gift-finder">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Try AI Gift Finder
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

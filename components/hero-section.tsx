import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-snow">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-10 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Find the Perfect Gift
            </h1>
            <p className="mx-auto max-w-[700px] text-xl text-gray-700 md:text-2xl">
              Discover thoughtful gifts for everyone special in your life.
              <br />
              Curated recommendations based on interests and occasions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/get-started">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg">Get Started</Button>
            </Link>
            <Link href="/learn-more">
              <Button variant="outline" className="border-secondary text-secondary px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="w-full max-w-3xl">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="People celebrating with gifts"
              width={800}
              height={400}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

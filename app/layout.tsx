import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata
export const metadata = {
  title: "GiftGivr - Find the Perfect Gift",
  description: "Discover the perfect gifts for everyone special in your life",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* The SiteFooter is already included in page.tsx, so we don't need it here */}
      </body>
    </html>
  )
}

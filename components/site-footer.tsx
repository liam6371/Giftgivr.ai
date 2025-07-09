import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-secondary">giftgivr</span>
            </Link>
            <p className="text-sm text-gray-500">Find the perfect gift for everyone on your list</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Gift Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-sm text-gray-500 hover:text-primary">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-sm text-gray-500 hover:text-primary">
                  Featured Gifts
                </Link>
              </li>
              <li>
                <Link href="/gift-finder" className="text-sm text-gray-500 hover:text-primary">
                  AI Gift Finder
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">Tech Gifts (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Gaming Gifts (Coming Soon)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-400">About Us (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Contact (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Privacy Policy (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Terms of Service (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Affiliate Disclosure (Coming Soon)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-6">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© 2023 GiftGivr. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2 md:mt-0">As an Amazon Associate I earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  )
}

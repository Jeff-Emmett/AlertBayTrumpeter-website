"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StripeProduct {
  id: string
  name: string
  description: string | null
  images: string[]
  price: {
    id: string
    amount: number | null
    currency: string
  }
}

export default function MasksArtPage() {
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products")
      }

      setProducts(data.products)
    } catch (err) {
      console.error("[v0] Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (priceId: string, productName: string) => {
    try {
      console.log("[v0] Starting purchase for:", productName)

      const response = await fetch("/api/create-product-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      console.log("[v0] Checkout session created, redirecting to:", data.url)

      // Open in new tab to avoid ad blocker issues
      const newWindow = window.open(data.url, "_blank")

      if (!newWindow) {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(data.url)
        alert(
          "Popup blocked! The checkout URL has been copied to your clipboard. Please paste it in a new tab to complete your purchase.",
        )
      }
    } catch (err) {
      console.error("[v0] Error during purchase:", err)
      alert(`Error: ${err instanceof Error ? err.message : "Failed to start checkout"}`)
    }
  }

  const formatPrice = (amount: number | null, currency: string) => {
    if (!amount) return "Price not available"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 py-6 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome to</h1>
          <h2 className="text-4xl font-serif font-bold text-white">AlertBayTrumpeter.com!</h2>

          {/* Navigation */}
          <nav className="mt-6 flex justify-center space-x-8 text-sm">
            <Link
              href="/"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/jerry-story"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Jerry's Story
            </Link>
            <Link href="/masks-art" className="text-blue-200 font-bold underline">
              Traditional Indigenous Masks & Art
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      {/* Masks & Art Content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-slate-700 mb-8 text-center">
            Traditional Indigenous Masks & Art
          </h1>

          <div className="text-center mb-12 bg-slate-50 rounded-lg p-8">
            <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto text-lg">
              Alert Bay is home to rich Indigenous culture and traditional art. Explore and purchase beautiful masks and
              artwork that represent the heritage and traditions of the local First Nations communities.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <Button onClick={fetchProducts} className="bg-blue-800 hover:bg-blue-600">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No products available at this time.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 bg-gradient-to-b from-white to-blue-50"
                >
                  <CardContent className="p-6">
                    <div className="w-full h-64 relative mb-4">
                      <Image
                        src={
                          product.images[0] || "/placeholder.svg?height=256&width=300&query=traditional indigenous art"
                        }
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{product.name}</h3>
                    {product.description && <p className="text-slate-600 mb-4">{product.description}</p>}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-slate-700">
                        {formatPrice(product.price.amount, product.price.currency)}
                      </span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(product.price.id, product.name)}
                      className="w-full bg-blue-800 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Purchase Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Get in Touch call-to-action section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-serif font-bold text-slate-700 mb-4">Interested in Jerry's Art?</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Have questions about a piece or want to commission custom artwork? Jerry would love to hear from you!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get in Touch
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Jerry's contact information */}
      <footer className="bg-blue-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Contact Jerry</h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start">
                  <span className="font-semibold mb-1 md:mb-0 md:mr-2">Email:</span>
                  <a href="mailto:alertbaytrumpeter@icloud.com" className="hover:text-blue-300 transition-colors">
                    alertbaytrumpeter@icloud.com
                  </a>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start">
                  <span className="font-semibold mb-1 md:mb-0 md:mr-2">Phone:</span>
                  <a href="tel:250-641-6204" className="hover:text-blue-300 transition-colors">
                    250 - 641- 6204
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Location</h3>
              <div className="text-blue-100 leading-relaxed">
                <p>Hyde Creek Rd</p>
                <p>British Columbia V0N 2R0</p>
                <p>Canada</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Alert Bay Trumpeter</h3>
              <p className="text-blue-100">Spreading smiles at sea since 1996</p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-6">
                <Link href="/jerry-story" className="hover:text-blue-300 transition-colors">
                  Jerry's Story
                </Link>
                <Link href="/masks-art" className="hover:text-blue-300 transition-colors">
                  Art Collection
                </Link>
                <Link href="/contact" className="hover:text-blue-300 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 text-center">
            <p className="text-blue-200">© 2024 Alert Bay Trumpeter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface SubscriptionProduct {
  id: string
  name: string
  description: string | null
  price: number | null
  currency: string
  lookup_key: string | null
  images: string[]
}

export default function HomePage() {
  const [subscriptionProducts, setSubscriptionProducts] = useState<SubscriptionProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionProducts()
  }, [])

  const fetchSubscriptionProducts = async () => {
    try {
      console.log("[v0] Fetching subscription products...")
      const response = await fetch("/api/subscription-products")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch products")
      }

      const data = await response.json()
      console.log("[v0] Received subscription products:", data.products)
      setSubscriptionProducts(data.products)
    } catch (error) {
      console.error("[v0] Error fetching subscription products:", error)
      setError(error instanceof Error ? error.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async (product: SubscriptionProduct) => {
    try {
      console.log("[v0] Starting donation process for product:", product.name)

      let requestBody: any

      if (product.lookup_key) {
        // Use lookup_key for one-time donations (legacy sponsor tiers)
        requestBody = { lookup_key: product.lookup_key }
      } else {
        // Use product info for subscription checkouts
        requestBody = {
          productId: product.id,
          productName: product.name,
          price: product.price,
          currency: product.currency,
          description: product.description,
          mode: "subscription",
        }
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Checkout session created, opening checkout:", data.url)

      if (data.url) {
        const newWindow = window.open(data.url, "_blank", "noopener,noreferrer")

        if (!newWindow) {
          const userConfirmed = confirm(
            "Please allow popups for this site to complete your donation, or click OK to copy the checkout link.",
          )
          if (userConfirmed) {
            navigator.clipboard
              .writeText(data.url)
              .then(() => {
                alert("Checkout link copied to clipboard! Please paste it in a new tab to complete your donation.")
              })
              .catch(() => {
                alert(`Please visit this link to complete your donation: ${data.url}`)
              })
          }
        }
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error("No checkout URL received from server")
      }
    } catch (error) {
      console.error("[v0] Error in donation process:", error)

      let errorMessage = "Unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      }

      alert(`Error processing donation: ${errorMessage}`)
    }
  }

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return "Contact for pricing"
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(price / 100)
  }

  const getSponsorTierInfo = (index: number) => {
    const tiers = [
      {
        name: "Copper",
        color: "orange",
        bgGradient: "from-white to-orange-50",
        borderColor: "orange-300",
        buttonColor: "orange-600",
      },
      {
        name: "Bronze",
        color: "amber",
        bgGradient: "from-white to-amber-50",
        borderColor: "amber-400",
        buttonColor: "amber-600",
      },
      {
        name: "Silver",
        color: "gray",
        bgGradient: "from-white to-gray-50",
        borderColor: "gray-400",
        buttonColor: "gray-600",
      },
      {
        name: "Gold",
        color: "yellow",
        bgGradient: "from-white to-yellow-50",
        borderColor: "yellow-400",
        buttonColor: "yellow-600",
      },
    ]
    return tiers[index] || tiers[0]
  }

  const getSponsorImage = (index: number) => {
    const images = [
      "/images/copper-sponsor.avif",
      "/images/gold-sponsor.avif",
      "/images/silver-sponsor.avif",
      "/images/bronze-sponsor.avif",
    ]
    return images[index] || images[0]
  }

  const getSponsorCardClasses = (index: number) => {
    const cardClasses = [
      {
        card: "text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 bg-gradient-to-b from-white to-orange-50",
        title: "text-xl font-bold text-orange-600 mb-3",
      },
      {
        card: "text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50",
        title: "text-xl font-bold text-amber-600 mb-3",
      },
      {
        card: "text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-400 bg-gradient-to-b from-white to-gray-50",
        title: "text-xl font-bold text-gray-600 mb-3",
      },
      {
        card: "text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-400 bg-gradient-to-b from-white to-yellow-50",
        title: "text-xl font-bold text-yellow-600 mb-3",
      },
    ]
    return cardClasses[index] || cardClasses[0]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 py-6 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome to</h1>
          <h2 className="text-4xl font-serif font-bold text-white">AlertBayTrumpeter.com!</h2>

          {/* Navigation */}
          <nav className="mt-8 flex justify-center space-x-8 text-base">
            <Link
              href="/"
              className="text-blue-100 hover:text-white font-bold transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1"
            >
              Home
            </Link>
            <Link
              href="/jerry-story"
              className="text-blue-100 hover:text-white font-bold transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1"
            >
              Jerry's Story
            </Link>
            <Link
              href="/masks-art"
              className="text-blue-100 hover:text-white font-bold transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1"
            >
              Traditional Indigenous Masks & Art
            </Link>
            <Link
              href="/contact"
              className="text-blue-100 hover:text-white font-bold transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-96 relative">
          <Image
            src="/images/jerry-hero.avif"
            alt="Jerry Higginson on boat with Alert Bay Trumpeter flag"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Jerry's Story Section */}
      <section className="bg-blue-800 text-white py-16 px-6 text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">
              The Story of Jerry Higginson, the Alert Bay Trumpeter
            </h2>
            <Button
              variant="outline"
              className="text-blue-800 bg-white hover:bg-blue-50 border-white hover:border-blue-100"
            >
              Learn more about Jerry's Story
            </Button>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Over 1000 nautical serenades to cruise ship passengers since 1996
            </h3>
            <p className="text-blue-100 mb-4">
              If you've ever cruised through the Johnstone Straits of northern Vancouver Island, you've probably met
              Jerry Higginson. Jerry has been energetically entertaining passengers of his hometown of Alert Bay for
              over 27 years, to the delight of millions.
            </p>
            <p className="text-blue-100">Donate to support Jerry's mission to spread smiles at sea!</p>
          </div>
        </div>
      </section>

      {/* Support Musicians Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-blue-600 mb-12">Support Independent Artists at Sea!</h2>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-gray-600 mb-4">
              Donations to the Alert Bay Trumpeter go to support Jerry in his mission to spread smiles at sea by
              serenading cruise ship passengers with his trumpet.
            </p>
          </div>

          {/* Sponsor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Loading sponsorship options...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600">Error loading sponsorship options: {error}</p>
              </div>
            ) : subscriptionProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No sponsorship options available at this time.</p>
              </div>
            ) : (
              subscriptionProducts.slice(0, 4).map((product, index) => {
                const cardClasses = getSponsorCardClasses(index)
                return (
                  <Card key={product.id} className={cardClasses.card}>
                    <CardContent className="p-6">
                      <div className="w-full h-48 relative mb-6 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={product.images[0] || getSponsorImage(index)}
                          alt={`${product.name} sponsor`}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className={cardClasses.title}>{product.name}</h3>
                      <p className="text-2xl font-semibold text-gray-800 mb-4">
                        {formatPrice(product.price, product.currency)}/month
                      </p>
                      {product.description && <p className="text-sm text-gray-600 mb-4">{product.description}</p>}
                      <Button
                        onClick={() => handleDonate(product)}
                        className="w-full bg-blue-800 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 px-6 bg-blue-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-8">All Videos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/vfKJjCgnmOU"
                title="Jerry Higginson Video 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>

            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/RzWGdnx13hw"
                title="Jerry Higginson Video 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>

            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/qkn8V8qf7Ow"
                title="Jerry Higginson Video 3"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Listen to Jerry Section */}
      <section
        className="py-16 px-6 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/placeholder.svg?height=400&width=1200')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white bg-opacity-90 rounded-lg p-8">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              Listen to Jerry Singing with the Eagles
            </h2>
            <p className="text-gray-600 mb-6">
              Jerry and his eagle friend have been flying and singing together for years.
            </p>
            <div className="w-full aspect-video mb-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/DjPrfIlcWUk"
                title="Jerry Singing with the Eagles"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Art Collection Call-to-Action Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Buy Traditional Indigenous Artwork</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Explore Jerry's beautiful collection of traditional Indigenous masks and artwork, each piece telling a
              story of cultural heritage and artistic mastery.
            </p>
            <div className="w-full max-w-2xl mx-auto mb-8">
              <Image
                src="/images/indigenous-masks.jpeg"
                alt="Traditional Indigenous masks with cedar bark fringe"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full"
              />
            </div>
            <Link href="/masks-art">
              <Button className="bg-blue-800 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Check out Jerry's Indigenous Mask & Art Collection
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Jerry's Contact Information */}
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
                <Link href="/jerry-story" className="hover:text-blue-300 transition-colors text-center">
                  Jerry's Story
                </Link>
                <Link href="/masks-art" className="hover:text-blue-300 transition-colors text-center">
                  Art Collection
                </Link>
                <Link href="/contact" className="hover:text-blue-300 transition-colors text-center">
                  Contact Jerry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

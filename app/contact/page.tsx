"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleMonthlySponsorship = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Starting monthly sponsorship process")

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "buck_a_month",
          sponsorTier: "Monthly Supporter",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()

      // Open Stripe checkout in new tab to avoid ad blocker issues
      window.open(data.url, "_blank")
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert("There was an error processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            <Link
              href="/masks-art"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Traditional Indigenous Masks & Art
            </Link>
            <Link href="/contact" className="text-blue-200 font-bold underline">
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      {/* Contact Content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-slate-700 mb-8 text-center">Get in Touch</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl border-2 border-blue-100 bg-gradient-to-b from-white to-blue-50">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-700">Contact Jerry Directly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Ready to get in touch with Jerry? Reach out directly using his contact information below.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-slate-700 mb-2">Email</h3>
                      <a
                        href="mailto:alertbaytrumpeter@icloud.com"
                        className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                      >
                        alertbaytrumpeter@icloud.com
                      </a>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-slate-700 mb-2">Phone</h3>
                      <a
                        href="tel:250-641-6204"
                        className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                      >
                        250 - 641- 6204
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-4">
                    Jerry loves hearing from visitors and fellow music enthusiasts!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-700 mb-4">About Jerry</h3>
                <div className="w-full h-64 relative mb-4">
                  <Image
                    src="/images/jerry-boat.avif"
                    alt="Jerry Higginson on his boat with trumpet"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Jerry Higginson has been entertaining cruise ship passengers in Alert Bay for over 27 years. His
                  passion for music and dedication to spreading joy has made him a beloved figure in the maritime
                  community.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Support Jerry's Mission</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Jerry Higginson has been entertaining cruise ship passengers in Alert Bay for over 27 years. His
                  passion for music and dedication to spreading joy has made him a beloved figure in the maritime
                  community. Help support Jerry's mission to spread smiles at sea by making a donation. Your
                  contribution helps Jerry continue his musical serenades for cruise ship passengers.
                </p>
                <Button
                  onClick={handleMonthlySponsorship}
                  disabled={isLoading}
                  className="bg-blue-800 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Support Jerry - $1/Month"}
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Visit Alert Bay</h3>
                <p className="text-slate-600 leading-relaxed">
                  Alert Bay is located on Cormorant Island in British Columbia, Canada. The community is rich in Indigenous culture and maritime heritage. Come explore the wilderness of Vancouver Island!   
                </p>
              </div>
            </div>
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

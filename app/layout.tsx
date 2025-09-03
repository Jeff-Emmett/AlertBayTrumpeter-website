import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Inter } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Alert Bay Trumpeter - Jerry Higginson",
  description:
    "The official website of Jerry Higginson, the Alert Bay Trumpeter, entertaining cruise ship passengers since 1996",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

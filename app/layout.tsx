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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎺</text></svg>",
  },
  openGraph: {
    title: "Alert Bay Trumpeter - Jerry Higginson",
    description:
      "The official website of Jerry Higginson, the Alert Bay Trumpeter, entertaining cruise ship passengers since 1996",
    url: "https://alertbaytrumpeter.com",
    siteName: "Alert Bay Trumpeter",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jerry Higginson - Alert Bay Trumpeter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alert Bay Trumpeter - Jerry Higginson",
    description:
      "The official website of Jerry Higginson, the Alert Bay Trumpeter, entertaining cruise ship passengers since 1996",
    images: ["/og-image.jpg"],
  },
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

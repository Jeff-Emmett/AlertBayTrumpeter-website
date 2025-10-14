import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function GET() {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    if (stripeSecretKey === "sk_test_your_secret_key_here" || stripeSecretKey.includes("your_secret_key_here")) {
      return NextResponse.json({ error: "Please configure your actual Stripe secret key" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })

    // Fetch products and their prices
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    })

    // Filter for one-time payment products (not recurring subscriptions)
    const oneTimeProducts = products.data.filter((product) => {
      const price = product.default_price as Stripe.Price
      return price && price.type === "one_time"
    })

    const productsWithPrices = oneTimeProducts.map((product) => {
      const price = product.default_price as Stripe.Price
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        price: {
          id: price.id,
          amount: price.unit_amount,
          currency: price.currency,
        },
      }
    })

    return NextResponse.json({ products: productsWithPrices })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

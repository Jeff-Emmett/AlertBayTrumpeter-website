import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not set" }, { status: 500 })
    }

    if (stripeSecretKey === "sk_test_your_secret_key_here" || stripeSecretKey.includes("your_secret_key_here")) {
      return NextResponse.json(
        {
          error:
            "Please replace the placeholder STRIPE_SECRET_KEY with your actual Stripe secret key from your Stripe dashboard",
        },
        { status: 500 },
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })

    console.log("[v0] Fetching Stripe subscription products...")

    // Fetch all products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    })

    // Filter for subscription products and sort by price
    const subscriptionProducts = products.data
      .filter((product) => {
        const price = product.default_price as Stripe.Price
        return price && price.type === "recurring" && price.recurring?.interval === "month"
      })
      .map((product) => {
        const price = product.default_price as Stripe.Price
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount,
          currency: price.currency,
          lookup_key: price.lookup_key,
          images: product.images,
        }
      })
      .sort((a, b) => (a.price || 0) - (b.price || 0))

    console.log("[v0] Found subscription products:", subscriptionProducts.length)

    return NextResponse.json({ products: subscriptionProducts })
  } catch (error) {
    console.error("[v0] Error fetching subscription products:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch subscription products" },
      { status: 500 },
    )
  }
}

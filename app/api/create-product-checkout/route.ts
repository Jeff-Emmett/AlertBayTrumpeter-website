import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

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

    const origin = request.headers.get("origin")
    const baseUrl = origin || `https://${request.headers.get("host")}`

    if (!baseUrl || (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://"))) {
      console.error("[v0] Invalid origin/host for URL construction:", { origin, host: request.headers.get("host") })
      return NextResponse.json({ error: "Unable to construct return URLs" }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Error creating product checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

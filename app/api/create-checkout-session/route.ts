import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY environment variable is not set" }, { status: 500 })
    }

    const trimmedKey = stripeSecretKey.trim()

    // Check if it's still the placeholder value
    if (trimmedKey === "sk_test_your_secret_key_here" || trimmedKey.includes("your_secret_key_here")) {
      return NextResponse.json(
        {
          error:
            "Please replace the placeholder STRIPE_SECRET_KEY with your actual Stripe secret key from your Stripe dashboard",
        },
        { status: 500 },
      )
    }

    // Validate that it's a proper Stripe key format
    if (!trimmedKey.startsWith("sk_test_") && !trimmedKey.startsWith("sk_live_")) {
      return NextResponse.json(
        { error: "Invalid Stripe key format. Must start with sk_test_ or sk_live_" },
        { status: 500 },
      )
    }

    const stripe = new Stripe(trimmedKey, {
      apiVersion: "2024-06-20",
    })

    const body = await request.json()
    const { lookup_key, priceId, sponsorTier, productId, productName, price, currency, description, mode } = body

    if (mode === "subscription" && productId && price) {
      console.log("[v0] Creating subscription checkout for product:", productName)

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: currency || "cad",
              product_data: {
                name: productName,
                description: description || `Monthly subscription to support Jerry Higginson, the Alert Bay Trumpeter`,
              },
              unit_amount: price,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/cancel`,
      })

      console.log("[v0] Subscription checkout session created successfully:", session.id)
      return NextResponse.json({ url: session.url })
    }

    if (priceId === "buck_a_month" || sponsorTier === "Monthly Supporter") {
      console.log("[v0] Creating monthly subscription checkout session")

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name: "Buck-A-Month Sponsor - Alert Bay Trumpeter",
                description: "Monthly $1 CAD subscription to support Jerry Higginson, the Alert Bay Trumpeter",
              },
              unit_amount: 100, // $1.00 CAD in cents
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/cancel`,
      })

      console.log("[v0] Monthly subscription checkout session created successfully:", session.id)
      return NextResponse.json({ url: session.url })
    }

    if (!lookup_key) {
      return NextResponse.json({ error: "Missing lookup_key for sponsor tier" }, { status: 400 })
    }

    // Define price mapping for sponsor tiers
    const priceMap: { [key: string]: number } = {
      copper: 1000, // $10.00 in cents
      bronze: 2500, // $25.00 in cents
      silver: 5000, // $50.00 in cents
      gold: 10000, // $100.00 in cents
    }

    const tierNames: { [key: string]: string } = {
      copper: "Copper Sponsor",
      bronze: "Bronze Sponsor",
      silver: "Silver Sponsor",
      gold: "Gold Sponsor",
    }

    const amount = priceMap[lookup_key]
    const tierName = tierNames[lookup_key]

    if (!amount || !tierName) {
      return NextResponse.json({ error: "Invalid sponsor tier" }, { status: 400 })
    }

    console.log("[v0] Creating checkout session for:", tierName, "Amount:", amount)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${tierName} - Alert Bay Trumpeter`,
              description: `Support Jerry Higginson, the Alert Bay Trumpeter, with a ${tierName.toLowerCase()} donation.`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
    })

    console.log("[v0] Checkout session created successfully:", session.id)
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("[v0] Error creating checkout session:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

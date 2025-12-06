import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

function getBaseUrl(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host")
  const protocol = request.headers.get("x-forwarded-proto") || "https"
  if (host) {
    return `${protocol}://${host}`
  }
  return "https://alertbaytrumpeter.com"
}

export async function POST(request: NextRequest) {
  try {
    const baseUrl = getBaseUrl(request)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()

    if (!stripeSecretKey) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })

    const { session_id } = await request.json()

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    if (!checkoutSession.customer) {
      return NextResponse.json({ error: "No customer found" }, { status: 400 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: baseUrl,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

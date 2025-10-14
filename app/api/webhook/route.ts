import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

    if (!stripeSecretKey || !webhookSecret) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`💰 Payment successful for session: ${session.id}`)
        // Handle successful payment here
        break
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💰 Payment succeeded: ${paymentIntent.id}`)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

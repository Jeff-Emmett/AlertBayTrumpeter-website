import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "edge"

async function sendThankYouEmail(
  customerEmail: string,
  customerName: string | null,
  amount: number,
  currency: string,
  productName: string
) {
  const sendgridApiKey = process.env.SENDGRID_API_KEY?.trim()

  if (!sendgridApiKey) {
    console.log("⚠️ SENDGRID_API_KEY not configured, skipping email")
    return
  }

  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)

  const name = customerName || "Valued Supporter"

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: customerEmail, name: name }],
          },
        ],
        from: {
          email: "noreply@alertbaytrumpeter.com",
          name: "Alert Bay Trumpeter",
        },
        subject: "Thank You for Supporting the Alert Bay Trumpeter!",
        content: [
          {
            type: "text/html",
            value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Thank You, ${name}!</h1>
            <p>Your generous support means the world to Jerry Higginson, the Alert Bay Trumpeter.</p>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e40af; margin-top: 0;">Subscription Details</h2>
              <p><strong>Amount:</strong> ${formattedAmount}/month</p>
              <p><strong>Plan:</strong> ${productName}</p>
            </div>
            <p>Your monthly contribution helps Jerry continue spreading smiles at sea by serenading cruise ship passengers with his trumpet.</p>
            <p>With over 1,000 nautical serenades since 1996, your support keeps the music playing!</p>
            <p style="margin-top: 30px;">
              With gratitude,<br>
              <strong>Jerry Higginson</strong><br>
              The Alert Bay Trumpeter
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              If you have any questions, contact us at alertbaytrumpeter@icloud.com
            </p>
          </div>
        `,
          },
        ],
      }),
    })

    if (response.ok || response.status === 202) {
      console.log(`✅ Thank you email sent to ${customerEmail}`)
    } else {
      const error = await response.text()
      console.error(`❌ Failed to send email: ${error}`)
    }
  } catch (error) {
    console.error("❌ Error sending email:", error)
  }
}

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

        // Send thank you email for subscriptions
        if (session.mode === "subscription" && session.customer_details?.email) {
          // Get subscription details
          const subscriptionId = session.subscription as string
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const item = subscription.items.data[0]
            const amount = item.price.unit_amount || 0
            const currency = item.price.currency
            const productId = item.price.product as string
            const product = await stripe.products.retrieve(productId)

            await sendThankYouEmail(
              session.customer_details.email,
              session.customer_details.name,
              amount,
              currency,
              product.name
            )
          }
        }
        break

      case "customer.subscription.created":
        const newSubscription = event.data.object as Stripe.Subscription
        console.log(`🎉 New subscription created: ${newSubscription.id}`)
        break

      case "invoice.paid":
        const invoice = event.data.object as Stripe.Invoice
        console.log(`💵 Invoice paid: ${invoice.id}`)
        break

      case "customer.subscription.deleted":
        const cancelledSubscription = event.data.object as Stripe.Subscription
        console.log(`😢 Subscription cancelled: ${cancelledSubscription.id}`)
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

import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    console.log("[v0] Email submission received:", {
      name,
      email,
      subject,
      message: message.substring(0, 100) + "...",
    })

    // For now, we'll log the email details
    // In a production environment, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Nodemailer with SMTP
    console.log("[v0] Email would be sent to: alertbaytrumpeter@icloud.com")
    console.log("[v0] From:", name, "<" + email + ">")
    console.log("[v0] Subject:", subject)
    console.log("[v0] Message:", message)

    // Simulate email sending success
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error processing email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

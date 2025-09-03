"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [showPortalButton, setShowPortalButton] = useState(false)

  useEffect(() => {
    if (sessionId) {
      setShowPortalButton(true)
    }
  }, [sessionId])

  const handleManageBilling = async () => {
    if (!sessionId) return

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating portal session:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Support!</h1>
          <p className="text-gray-600 mb-6">
            Your donation to support Jerry Higginson, the Alert Bay Trumpeter, has been processed successfully. Jerry
            appreciates your contribution to help him continue spreading smiles at sea!
          </p>

          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>

            {showPortalButton && (
              <Button variant="outline" className="w-full bg-transparent" onClick={handleManageBilling}>
                Manage Billing Information
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

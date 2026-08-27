"use client"

import { claimGuestOrders } from "@lib/data/orders"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

const ClaimGuestOrdersOnMount = () => {
  const hasClaimedRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (hasClaimedRef.current) {
      return
    }

    hasClaimedRef.current = true

    const claimOrders = async () => {
      try {
        const result = await claimGuestOrders()

        if (result.claimed_count > 0) {
          router.refresh()
        }
      } catch (error) {
        console.error("No se pudieron reclamar órdenes de invitado:", error)
      }
    }

    void claimOrders()
  }, [router])

  return null
}

export default ClaimGuestOrdersOnMount

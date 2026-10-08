"use client"

import { trackPurchase } from "@lib/tracking"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useRef } from "react"

type PurchaseTrackerProps = {
  order: HttpTypes.StoreOrder
}

const PurchaseTracker = ({ order }: PurchaseTrackerProps) => {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) {
      return
    }

    hasTracked.current = true

    trackPurchase(
      order.display_id?.toString() || order.id,
      order.total ?? 0,
      order.items ?? []
    )
  }, [order])

  return null
}

export default PurchaseTracker

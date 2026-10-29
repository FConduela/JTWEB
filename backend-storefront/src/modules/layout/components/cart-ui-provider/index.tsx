"use client"

import { Suspense } from "react"

import { CartUIProvider } from "@lib/context/cart-ui-context"
import RefreshCartAfterAuth from "@modules/layout/components/refresh-cart-after-auth"

export default function CartUIProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartUIProvider>
      <Suspense fallback={null}>
        <RefreshCartAfterAuth />
      </Suspense>
      {children}
    </CartUIProvider>
  )
}

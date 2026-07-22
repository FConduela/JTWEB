"use client"

import { CartUIProvider } from "@lib/context/cart-ui-context"

export default function CartUIProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <CartUIProvider>{children}</CartUIProvider>
}

"use client"

import { transferCart } from "@lib/data/customer"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { StoreCart, StoreCustomer } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

function CartMismatchBanner(props: {
  customer: StoreCustomer
  cart: StoreCart
}) {
  const { customer, cart } = props
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!customer || !!cart.customer_id) {
    return null
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setFailed(false)
      await transferCart()
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
      role="status"
    >
      <div className="content-container flex flex-col items-center justify-center gap-2 small:flex-row small:gap-3">
        <span className="inline-flex items-center gap-2 text-left small:text-center">
          <ExclamationCircleSolid className="h-4 w-4 shrink-0 text-brand-accent" />
          <span>
            {failed
              ? "No pudimos vincular tu carrito a la cuenta. Intenta de nuevo."
              : "Tu carrito de invitado aún no está asociado a tu sesión."}
          </span>
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-brand-accent px-4 text-xs font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Vinculando…" : "Vincular carrito"}
        </button>
      </div>
    </div>
  )
}

export default CartMismatchBanner

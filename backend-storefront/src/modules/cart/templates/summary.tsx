"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  checkoutDisabled?: boolean
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, checkoutDisabled = false }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-brand-accent md:text-xl">
        Resumen
      </h2>
      <CartTotals totals={cart} />
      <DiscountCode cart={cart} />
      {checkoutDisabled ? (
        <span
          className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-gray-200 px-6 py-2.5 text-sm font-semibold text-brand-text/50"
          data-testid="checkout-button"
          aria-disabled="true"
        >
          Continuar
        </span>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
        >
          Continuar
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary

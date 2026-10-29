"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"

import PaymentButton from "../payment-button"
import ErrorMessage from "../error-message"
import { useSearchParams } from "next/navigation"
import { isTransbank } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { updateTransbankPaymentSession } from "@lib/data/payment"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const tokenWs = searchParams.get("token_ws")

  const isOpen = searchParams.get("step") === "review"

  const [isCompletingTransbank, setIsCompletingTransbank] = useState(false)
  const [transbankError, setTransbankError] = useState<string | null>(null)
  const hasHandledReturn = useRef(false)

  useEffect(() => {
    if (!tokenWs || hasHandledReturn.current) {
      return
    }

    const transbankSession = cart?.payment_collection?.payment_sessions?.find(
      (session: any) => isTransbank(session.provider_id)
    )

    if (!transbankSession) {
      return
    }

    hasHandledReturn.current = true
    setIsCompletingTransbank(true)
    setTransbankError(null)

    const completeTransbankOrder = async () => {
      try {
        await updateTransbankPaymentSession(transbankSession.id, tokenWs)
        await placeOrder()
      } catch (err: any) {
        setTransbankError(
          err?.message ?? "No se pudo confirmar el pago con Webpay."
        )
        setIsCompletingTransbank(false)
        hasHandledReturn.current = false
      }
    }

    completeTransbankOrder()
  }, [tokenWs, cart])

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  if (isCompletingTransbank) {
    return (
      <div className="bg-brand-card">
        <Heading
          level="h2"
          className="mb-6 flex flex-row items-baseline gap-x-2 text-2xl font-bold text-brand-text"
        >
          Revisión
        </Heading>
        <Text className="txt-medium text-brand-text/70">
          Confirmando tu pago con Webpay, no cierres esta ventana...
        </Text>
      </div>
    )
  }

  return (
    <div className="bg-brand-card">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row items-baseline gap-x-2 text-2xl font-bold text-brand-text",
            {
              "pointer-events-none select-none opacity-50": !isOpen,
            }
          )}
        >
          Revisión
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="mb-6 flex w-full items-start gap-x-1">
            <div className="w-full text-sm leading-relaxed text-brand-text/80">
              Al confirmar el pedido, declaras que has leído y aceptas nuestros{" "}
              <LocalizedClientLink
                href="/politicas/terminos"
                className="font-medium text-brand-accent hover:underline"
              >
                Términos y condiciones
              </LocalizedClientLink>
              ,{" "}
              <LocalizedClientLink
                href="/politicas/devoluciones"
                className="font-medium text-brand-accent hover:underline"
              >
                política de devoluciones
              </LocalizedClientLink>{" "}
              y la{" "}
              <LocalizedClientLink
                href="/politicas/privacidad"
                className="font-medium text-brand-accent hover:underline"
              >
                Política de privacidad
              </LocalizedClientLink>{" "}
              de Jugando Toy.
            </div>
          </div>
          <ErrorMessage
            error={transbankError}
            data-testid="transbank-return-error-message"
          />
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review

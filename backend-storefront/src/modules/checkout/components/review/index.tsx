"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"

import PaymentButton from "../payment-button"
import ErrorMessage from "../error-message"
import { useSearchParams } from "next/navigation"
import { isTransbank } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { updateTransbankPaymentSession } from "@lib/data/payment"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const tokenWs = searchParams.get("token_ws")

  const isOpen = searchParams.get("step") === "review"

  const [isCompletingTransbank, setIsCompletingTransbank] = useState(false)
  const [transbankError, setTransbankError] = useState<string | null>(null)
  const hasHandledReturn = useRef(false)

  // "La Vuelta": Webpay redirige aquí con `token_ws` en la URL. Inyectamos el
  // token en la sesión de pago de Transbank y completamos la orden de forma
  // automática, sin requerir otro clic del usuario.
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
      <div className="bg-white">
        <Heading level="h2" className="flex flex-row text-3xl-regular gap-x-2 items-baseline mb-6">
          Review
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle">
          Confirmando tu pago con Webpay, no cierres esta ventana...
        </Text>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
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

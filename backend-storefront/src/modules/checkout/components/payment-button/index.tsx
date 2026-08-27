"use client"

import { isBankTransfer, isManual, isMercadopago, isTransbank } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { confirmMercadopagoPayment } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React, { useRef, useState } from "react"
import ErrorMessage from "../error-message"
import { useMercadopagoFormData } from "../payment-form-provider"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isMercadopago(paymentSession?.provider_id):
      return (
        <MercadopagoPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isTransbank(paymentSession?.provider_id):
      return (
        <TransbankPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isBankTransfer(paymentSession?.provider_id):
      return (
        <BankTransferPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Selecciona un método de pago</Button>
  }
}

const MercadopagoPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { formData } = useMercadopagoFormData()

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!formData?.formData) {
      setErrorMessage("Completa los datos de pago antes de continuar.")
      setSubmitting(false)
      return
    }

    try {
      await confirmMercadopagoPayment(formData.formData)
      await onPaymentCompleted()
    } catch (err: any) {
      setErrorMessage(err.message ?? "No se pudo procesar el pago.")
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady || !formData?.formData}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Confirmar pedido
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="mercadopago-payment-error-message"
      />
    </>
  )
}

/**
 * "La Ida": Webpay Plus requiere que el navegador del comprador haga un POST
 * de formulario tradicional (no fetch/XHR) hacia la `url` de Transbank, con
 * un input oculto `token_ws`. Este botón NO completa la orden; solo redirige.
 * El comprador vuelve al Storefront en `TRANSBANK_RETURN_URL`, donde el
 * componente `Review` intercepta el `token_ws` de retorno y allí sí se
 * completa la orden.
 */
const TransbankPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const session = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => isTransbank(paymentSession.provider_id)
  )

  const sessionData = session?.data as
    | { token?: string; url?: string }
    | undefined

  const token = sessionData?.token
  const url = sessionData?.url

  const handlePayment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token || !url) {
      setErrorMessage(
        "No se pudo iniciar la transacción con Webpay. Vuelve al paso de pago e intenta de nuevo."
      )
      return
    }

    // "HTML Bounce": el navegador borra la cookie _medusa_cart_id al volver
    // desde un dominio externo (Transbank) hacia localhost. Guardamos el
    // cart_id en localStorage para que el puente de retorno
    // (src/app/api/transbank/return/route.ts) pueda recuperarlo y restaurar
    // la cookie manualmente, sin depender del `context` del proveedor.
    if (cart?.id) {
      localStorage.setItem("tbk_cart_id", cart.id)
    }

    setSubmitting(true)
    formRef.current?.submit()
  }

  return (
    <>
      {/* Formulario oculto: Webpay Plus exige un POST tradicional con token_ws */}
      <form ref={formRef} action={url} method="POST" className="hidden">
        <input type="hidden" name="token_ws" value={token ?? ""} />
      </form>
      <Button
        disabled={notReady || !token || !url}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Pagar con Webpay
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="transbank-payment-error-message"
      />
    </>
  )
}

/**
 * La transferencia bancaria es un proveedor dummy: se autoriza de inmediato
 * en el backend (sin pasarela externa), así que solo hace falta llamar a
 * `placeOrder()` directamente, sin formularios ocultos ni retornos.
 */
const BankTransferPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Confirmar pedido
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="bank-transfer-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Confirmar pedido
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton

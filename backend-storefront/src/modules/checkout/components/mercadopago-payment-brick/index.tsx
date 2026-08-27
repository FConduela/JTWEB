"use client"

import { ensureMercadoPagoInit } from "@lib/mercadopago-init"
import { Payment as MpPaymentBrick } from "@mercadopago/sdk-react"
import { Text } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useState } from "react"

type MercadopagoPaymentBrickProps = {
  amount: number
  email?: string | null
  onReady?: () => void
  onError?: (message: string) => void
}

const MercadopagoPaymentBrick = ({
  amount,
  email,
  onReady,
  onError,
}: MercadopagoPaymentBrickProps) => {
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    ensureMercadoPagoInit()
    setSdkReady(true)
  }, [])

  const initialization = useMemo(
    () => ({
      amount,
      payer: email ? { email } : undefined,
    }),
    [amount, email]
  )

  const customization = useMemo(
    () => ({
      paymentMethods: {
        creditCard: "all" as const,
        debitCard: "all" as const,
      },
      visual: {
        hidePaymentButton: true,
        hideFormTitle: true,
      },
    }),
    []
  )

  const handleReady = useCallback(() => {
    onReady?.()
  }, [onReady])

  const handleError = useCallback(
    (error: { message?: string }) => {
      onError?.(error.message ?? "Error al cargar el formulario de pago.")
    },
    [onError]
  )

  const handleSubmit = useCallback(async () => {
    return Promise.resolve()
  }, [])

  if (!sdkReady || amount <= 0) {
    return (
      <Text className="txt-medium text-ui-fg-subtle">
        {amount <= 0
          ? "Preparando sesión de pago..."
          : "Cargando formulario de pago..."}
      </Text>
    )
  }

  return (
    <div className="mt-4 w-full min-h-[420px] rounded-rounded border border-ui-border-base p-4 bg-ui-bg-base">
      <MpPaymentBrick
        id="mercadopago-payment-brick"
        initialization={initialization}
        customization={customization}
        onReady={handleReady}
        onError={handleError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default MercadopagoPaymentBrick

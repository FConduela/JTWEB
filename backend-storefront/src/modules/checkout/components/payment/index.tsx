"use client"

import { RadioGroup } from "@headlessui/react"
import { isManual, isMercadopago, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { getMercadopagoBrickAmount } from "@lib/util/mercadopago-payment"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { StoreCart } from "@medusajs/types"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import MercadopagoPaymentBrick from "@modules/checkout/components/mercadopago-payment-brick"
import PaymentContainer from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMercadopagoFormData } from "../payment-form-provider"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: StoreCart
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const mercadopagoProvider = useMemo(
    () => availablePaymentMethods.find((method) => isMercadopago(method.id)),
    [availablePaymentMethods]
  )

  const otherPaymentMethods = useMemo(
    () =>
      availablePaymentMethods.filter((method) => !isMercadopago(method.id)),
    [availablePaymentMethods]
  )

  const defaultPaymentMethod =
    activeSession?.provider_id ??
    mercadopagoProvider?.id ??
    availablePaymentMethods[0]?.id ??
    ""

  const [isLoading, setIsLoading] = useState(false)
  const [isInitializingSession, setIsInitializingSession] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brickReady, setBrickReady] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultPaymentMethod
  )

  const sessionInitRef = useRef<string | null>(null)

  const { setFormData, setAdditionalData, formData } = useMercadopagoFormData()

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"
  const isMp = isMercadopago(selectedPaymentMethod)
  const mercadopagoAmount = useMemo(() => getMercadopagoBrickAmount(cart), [cart])

  const ensurePaymentSession = useCallback(
    async (providerId: string) => {
      if (!providerId) {
        return
      }

      const hasPendingSession = cart.payment_collection?.payment_sessions?.some(
        (session) =>
          session.status === "pending" && session.provider_id === providerId
      )

      if (hasPendingSession) {
        sessionInitRef.current = providerId
        return
      }

      setIsInitializingSession(true)

      try {
        await initiatePaymentSession(cart, { provider_id: providerId })
        sessionInitRef.current = providerId
        router.refresh()
      } finally {
        setIsInitializingSession(false)
      }
    },
    [cart, router]
  )

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setBrickReady(false)
    setSelectedPaymentMethod(method)

    if (isMercadopago(method)) {
      await ensurePaymentSession(method)
    }
  }

  useEffect(() => {
    if (!mercadopagoProvider || !isOpen) {
      return
    }

    const providerId = selectedPaymentMethod || mercadopagoProvider.id

    if (!selectedPaymentMethod) {
      setSelectedPaymentMethod(providerId)
    }

    ensurePaymentSession(providerId).catch((err: Error) => {
      setError(err.message ?? "No se pudo iniciar la sesión de pago.")
    })
  }, [mercadopagoProvider, isOpen, selectedPaymentMethod, ensurePaymentSession])

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) ||
    paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!selectedPaymentMethod) {
        setError("Selecciona un método de pago.")
        return
      }

      await ensurePaymentSession(selectedPaymentMethod)

      if (isMp) {
        if (!window.paymentBrickController) {
          setError(
            "El formulario de pago aún no está listo. Espera unos segundos e intenta de nuevo."
          )
          return
        }

        const additionalData =
          await window.paymentBrickController.getAdditionalData()
        const mpFormData =
          await window.paymentBrickController.getFormData()

        if (additionalData) {
          setAdditionalData(additionalData)
        }

        if (!mpFormData?.formData) {
          setError("Completa los datos de tu tarjeta antes de continuar.")
          return
        }

        setFormData(mpFormData)
      }

      router.push(pathname + "?" + createQueryString("step", "review"), {
        scroll: false,
      })
    } catch (err: any) {
      setError(err.message ?? "No se pudo validar el método de pago.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const handleBrickReady = useCallback(() => {
    setBrickReady(true)
  }, [])

  const handleBrickError = useCallback((message: string) => {
    setError(message)
    setBrickReady(false)
  }, [])

  const canContinue =
    paidByGiftcard ||
    (isMp ? brickReady && !isInitializingSession : Boolean(selectedPaymentMethod))

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Pago
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Editar
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && !availablePaymentMethods?.length && (
            <Text className="txt-medium text-ui-fg-subtle">
              No hay métodos de pago disponibles para esta región.
            </Text>
          )}

          {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
            <>
              {(otherPaymentMethods.length > 0 || mercadopagoProvider) && (
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(value: string) => setPaymentMethod(value)}
                >
                  {otherPaymentMethods.map((paymentMethod) => (
                    <div key={paymentMethod.id}>
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    </div>
                  ))}
                  {mercadopagoProvider && (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={mercadopagoProvider.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  )}
                </RadioGroup>
              )}

              {isInitializingSession && (
                <Text className="txt-medium text-ui-fg-subtle mt-4">
                  Preparando sesión de pago...
                </Text>
              )}

              {isMp && mercadopagoProvider && (
                <div className="w-full">
                  <Text className="txt-medium-plus text-ui-fg-base mb-3">
                    Ingresa los datos de tu tarjeta
                  </Text>
                  <MercadopagoPaymentBrick
                    amount={mercadopagoAmount}
                    email={cart.email}
                    onReady={handleBrickReady}
                    onError={handleBrickError}
                  />
                </div>
              )}

              {!isMp && isManual(selectedPaymentMethod) && (
                <Text className="txt-medium text-ui-fg-subtle mt-4">
                  Confirmarás el pago manualmente en el siguiente paso.
                </Text>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!canContinue}
            data-testid="submit-payment-button"
          >
            Continuar a revisión
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Método de pago
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Detalles de pago
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isMercadopago(selectedPaymentMethod) && formData?.formData
                      ? "Tarjeta ingresada"
                      : isMercadopago(selectedPaymentMethod)
                        ? "Completa los datos de la tarjeta"
                        : "Otro paso aparecerá"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Método de pago
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment

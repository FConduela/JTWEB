import { StoreCart } from "@medusajs/types"
import { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type"

export type MercadopagoPaymentPayload = {
  token: string
  transaction_amount: number
  installments: number
  payment_method_id: string
  payer:
    | {
        email?: string
        identification?: {
          type: string
          number: string
        }
      }
    | {
        type: string
        id: string
      }
}

/**
 * Medusa guarda el monto en la unidad mínima de la moneda (p. ej. centavos en USD).
 * El plugin @nicogorga/medusa-payment-mercadopago valida igualdad estricta con
 * transaction_amount del Payment Brick, así que NO hay que dividir por 100.
 */
export const getMercadopagoBrickAmount = (cart: StoreCart) => {
  const pendingSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

  return Number(pendingSession?.amount ?? cart.total ?? 0)
}

export const mapMercadopagoPaymentData = (
  raw: IPaymentFormData["formData"]
): MercadopagoPaymentPayload => {
  if (!raw || typeof raw !== "object") {
    throw new Error(
      "Datos de pago inválidos. Vuelve al paso de pago e ingresa tu tarjeta."
    )
  }

  const data = raw as Record<string, unknown>

  const token = String(data.token ?? "")
  const payment_method_id = String(data.payment_method_id ?? "")
  const transaction_amount = Number(data.transaction_amount)
  const installments = Number(data.installments ?? 1)

  if (!token) {
    throw new Error(
      "No se recibió el token de la tarjeta. Vuelve al paso de pago e intenta de nuevo."
    )
  }

  if (!payment_method_id) {
    throw new Error("No se recibió el método de pago desde Mercado Pago.")
  }

  if (!Number.isFinite(transaction_amount) || transaction_amount <= 0) {
    throw new Error("El monto de la transacción es inválido.")
  }

  if (!Number.isFinite(installments) || installments < 1) {
    throw new Error("El número de cuotas es inválido.")
  }

  return {
    token,
    transaction_amount,
    installments,
    payment_method_id,
    payer: normalizeMercadopagoPayer(data.payer),
  }
}

const normalizeMercadopagoPayer = (
  payer: unknown
): MercadopagoPaymentPayload["payer"] => {
  if (!payer || typeof payer !== "object") {
    return { email: undefined }
  }

  const rawPayer = payer as Record<string, unknown>

  if ("type" in rawPayer && "id" in rawPayer) {
    return {
      type: String(rawPayer.type),
      id: String(rawPayer.id),
    }
  }

  const normalized: {
    email?: string
    identification?: { type: string; number: string }
  } = {}

  if (rawPayer.email) {
    normalized.email = String(rawPayer.email)
  }

  if (rawPayer.identification && typeof rawPayer.identification === "object") {
    const identification = rawPayer.identification as Record<string, unknown>

    if (identification.type && identification.number) {
      normalized.identification = {
        type: String(identification.type),
        number: String(identification.number),
      }
    }
  }

  return normalized
}

export const extractMedusaFetchErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== "object") {
    return "Error desconocido al comunicarse con Medusa."
  }

  const err = error as {
    message?: string
    status?: number
    statusText?: string
    body?: unknown
    response?: {
      data?: {
        message?: string
        type?: string
      }
    }
  }

  console.error("[Medusa API error]", {
    message: err.message,
    status: err.status,
    statusText: err.statusText,
    body: err.body,
    responseData: err.response?.data,
  })

  if (err.body && typeof err.body === "object" && err.body !== null) {
    const body = err.body as Record<string, unknown>

    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message
    }

    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error
    }
  }

  if (err.response?.data?.message) {
    return String(err.response.data.message)
  }

  if (err.message && err.message !== "An unknown error occurred") {
    return err.message
  }

  if (err.status) {
    return `Error del servidor Medusa (${err.status}${err.statusText ? `: ${err.statusText}` : ""}).`
  }

  return "No se pudo confirmar el pago con Mercado Pago."
}

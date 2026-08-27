"use server"

import { isMercadopago } from "@lib/constants"
import { sdk } from "@lib/config"
import {
  extractMedusaFetchErrorMessage,
  mapMercadopagoPaymentData,
} from "@lib/util/mercadopago-payment"
import { initiatePaymentSession, retrieveFreshCart } from "./cart"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type"

const MERCADOPAGO_PROVIDER_ID = "pp_mercadopago_mercadopago"

const findPendingMercadopagoSession = (cart: HttpTypes.StoreCart) =>
  cart.payment_collection?.payment_sessions?.find(
    (session) =>
      session.status === "pending" && isMercadopago(session.provider_id)
  )

const resolveMercadopagoPaymentSession = async () => {
  let cart = await retrieveFreshCart()

  if (!cart) {
    throw new Error("No se encontró el carrito activo.")
  }

  let session = findPendingMercadopagoSession(cart)

  if (!session) {
    await initiatePaymentSession(cart, {
      provider_id: MERCADOPAGO_PROVIDER_ID,
    })

    cart = await retrieveFreshCart()

    if (!cart) {
      throw new Error("No se pudo actualizar el carrito antes del pago.")
    }

    session = findPendingMercadopagoSession(cart)
  }

  if (!session) {
    throw new Error(
      "No hay una sesión de pago activa. Vuelve al paso de pago e ingresa tu tarjeta nuevamente."
    )
  }

  return session
}

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}

export const confirmMercadopagoPayment = async (
  paymentData: IPaymentFormData["formData"]
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  let mappedPaymentData

  try {
    mappedPaymentData = mapMercadopagoPaymentData(paymentData)
  } catch (error) {
    console.error("[confirmMercadopagoPayment] Invalid brick payload:", {
      paymentData,
      error,
    })
    throw error instanceof Error
      ? error
      : new Error("Datos de pago inválidos del Payment Brick.")
  }

  const paymentSession = await resolveMercadopagoPaymentSession()

  try {
    return await sdk.client.fetch("/store/mercadopago/payment", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: {
        paymentSessionId: paymentSession.id,
        paymentData: mappedPaymentData,
      },
    })
  } catch (error) {
    console.error("[confirmMercadopagoPayment] Medusa request failed:", error)
    throw new Error(extractMedusaFetchErrorMessage(error))
  }
}

/**
 * Injects the `token_ws` returned by Webpay into the Transbank payment
 * session's `data`, so the backend's `authorizePayment` can commit the
 * transaction when `placeOrder()` runs.
 */
export const updateTransbankPaymentSession = async (
  paymentSessionId: string,
  tokenWs: string
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    return await sdk.client.fetch("/store/transbank/update-session", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: {
        payment_session_id: paymentSessionId,
        token_ws: tokenWs,
      },
    })
  } catch (error) {
    console.error(
      "[updateTransbankPaymentSession] Medusa request failed:",
      error
    )
    throw new Error(extractMedusaFetchErrorMessage(error))
  }
}

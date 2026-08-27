"use client"

import { initMercadoPago } from "@mercadopago/sdk-react"

let initialized = false

export const ensureMercadoPagoInit = () => {
  if (initialized || typeof window === "undefined") {
    return
  }

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

  if (!publicKey) {
    console.error(
      "Falta NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY en las variables de entorno."
    )
    return
  }

  initMercadoPago(publicKey, { locale: "es-CL" })
  initialized = true
}

import React from "react"
import { CreditCard } from "@medusajs/icons"

import PayPal from "@modules/common/icons/paypal"

/**
 * La tienda opera únicamente en Chile bajo el dominio .cl, por lo que ya no
 * existe un segmento dinámico [countryCode] en las rutas. Este valor se usa
 * como región por defecto para las consultas a Medusa que la requieren.
 */
export const DEFAULT_COUNTRY_CODE = "cl"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_mercadopago_mercadopago: {
    title: "Mercado Pago",
    icon: <CreditCard />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  pp_transbank_transbank: {
    title: "Webpay Plus (Transbank)",
    icon: <CreditCard />,
  },
  bank_transfer: {
    title: "Transferencia Bancaria",
    icon: <CreditCard />,
  },
  pp_bank_transfer_bank_transfer: {
    title: "Transferencia Bancaria",
    icon: <CreditCard />,
  },
}

export const isMercadopago = (providerId?: string) => {
  return providerId?.startsWith("pp_mercadopago_")
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

export const isTransbank = (providerId?: string) => {
  return providerId?.startsWith("pp_transbank_")
}

export const isBankTransfer = (providerId?: string) => {
  return (
    providerId === "bank_transfer" ||
    providerId?.startsWith("pp_bank_transfer_")
  )
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

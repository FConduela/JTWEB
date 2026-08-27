"use client"

import React from "react"
import MercadopagoWrapper from "./mercadopago-wrapper"
import { HttpTypes } from "@medusajs/types"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const mercadopagoKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ children }) => {
  if (!mercadopagoKey) {
    console.warn(
      "NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurada. El Payment Brick no funcionará."
    )
    return <div>{children}</div>
  }

  return <MercadopagoWrapper>{children}</MercadopagoWrapper>
}

export default PaymentWrapper

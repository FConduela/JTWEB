"use client"

import { ensureMercadoPagoInit } from "@lib/mercadopago-init"
import { useEffect } from "react"

type MercadopagoWrapperProps = {
  children: React.ReactNode
}

const MercadopagoWrapper: React.FC<MercadopagoWrapperProps> = ({ children }) => {
  useEffect(() => {
    ensureMercadoPagoInit()
  }, [])

  return <>{children}</>
}

export default MercadopagoWrapper

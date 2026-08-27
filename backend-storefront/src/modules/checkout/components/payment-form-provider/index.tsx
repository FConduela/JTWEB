"use client"

import {
  IAdditionalData,
  IPaymentFormData,
} from "@mercadopago/sdk-react/esm/bricks/payment/type"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react"

type PaymentFormContextType = {
  formData: IPaymentFormData | null
  additionalData: IAdditionalData | null
  setFormData: Dispatch<SetStateAction<IPaymentFormData | null>>
  setAdditionalData: Dispatch<SetStateAction<IAdditionalData | null>>
}

const MercadopagoPaymentDataContext =
  createContext<PaymentFormContextType | null>(null)

export const useMercadopagoFormData = () => {
  const context = useContext(MercadopagoPaymentDataContext)

  if (!context) {
    throw new Error(
      "useMercadopagoFormData debe usarse dentro de PaymentFormProvider"
    )
  }

  return context
}

const PaymentFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<IPaymentFormData | null>(null)
  const [additionalData, setAdditionalData] = useState<IAdditionalData | null>(
    null
  )

  return (
    <MercadopagoPaymentDataContext.Provider
      value={{ formData, setFormData, additionalData, setAdditionalData }}
    >
      {children}
    </MercadopagoPaymentDataContext.Provider>
  )
}

export default PaymentFormProvider

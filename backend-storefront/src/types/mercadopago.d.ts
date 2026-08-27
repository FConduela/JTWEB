import {
  IAdditionalData,
  IPaymentFormData,
} from "@mercadopago/sdk-react/esm/bricks/payment/type"

declare global {
  interface Window {
    paymentBrickController?: {
      getFormData: () => Promise<IPaymentFormData>
      getAdditionalData: () => Promise<IAdditionalData>
      unmount: () => void
      update: (values: Record<string, unknown>) => void
    }
  }
}

export {}

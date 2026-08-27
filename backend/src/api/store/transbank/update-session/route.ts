import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes, Modules } from "@medusajs/framework/utils"

type UpdateTransbankSessionBody = {
  payment_session_id?: string
  token_ws?: string
}

/**
 * Medusa v2's Store API doesn't expose a route to update an existing payment
 * session's `data` without re-triggering `initiatePayment` (which would create
 * a brand new Webpay transaction). This custom route calls the Payment
 * Module's `updatePaymentSession` directly, which invokes the provider's
 * `updatePayment` method instead, merging `token_ws` into the session's data
 * so `authorizePayment` can later commit the transaction.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { payment_session_id, token_ws } = (req.body ??
    {}) as UpdateTransbankSessionBody

  if (!payment_session_id || typeof payment_session_id !== "string") {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "payment_session_id es requerido."
    )
  }

  if (!token_ws || typeof token_ws !== "string") {
    throw new MedusaError(MedusaErrorTypes.INVALID_DATA, "token_ws es requerido.")
  }

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)

  const session = await paymentModuleService.retrievePaymentSession(
    payment_session_id,
    {
      select: ["id", "data", "amount", "currency_code", "provider_id"],
    }
  )

  if (!session) {
    throw new MedusaError(
      MedusaErrorTypes.NOT_FOUND,
      `No se encontró la sesión de pago ${payment_session_id}.`
    )
  }

  const updated = await paymentModuleService.updatePaymentSession({
    id: session.id,
    amount: session.amount,
    currency_code: session.currency_code,
    data: { ...(session.data ?? {}), token_ws },
  })

  return res.status(200).json({ payment_session: updated })
}

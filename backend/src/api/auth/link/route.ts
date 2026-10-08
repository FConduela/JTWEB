import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { extractEmailFromBearerToken } from "../../../utils/decode-bearer-token-email"
import { linkCustomerIdentityWorkflow } from "../../../workflows/link-customer-identity"

function isIdentityAlreadyLinkedError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error)

  return (
    message.includes("already exists in app metadata") ||
    message.includes("already has an account") ||
    message.includes("customer_id already exists")
  )
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  if (req.auth_context.actor_id) {
    return res.status(200).json({
      customer_id: req.auth_context.actor_id,
      already_linked: true,
    })
  }

  if (!req.auth_context.auth_identity_id) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "No se encontró una identidad de autenticación válida."
    )
  }

  const emailFromToken = extractEmailFromBearerToken(
    req.headers.authorization
  )

  try {
    const { result } = await linkCustomerIdentityWorkflow(req.scope).run({
      input: {
        auth_identity_id: req.auth_context.auth_identity_id,
        email: emailFromToken,
      },
    })

    return res.status(200).json(result)
  } catch (error) {
    if (isIdentityAlreadyLinkedError(error)) {
      return res.status(200).json({
        success: true,
        message: "Identity already linked",
      })
    }

    throw error
  }
}

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
  MedusaErrorTypes,
  Modules,
} from "@medusajs/framework/utils"
import { generateJwtTokenForAuthIdentity } from "@medusajs/medusa/api/auth/utils/generate-jwt-token"
import jwt from "jsonwebtoken"

import {
  linkProviderIdentitiesToCustomer,
  ProviderIdentityWithAuth,
} from "../../../../utils/link-provider-identities-to-customer"
import { resolveCustomerEmailFromProviderIdentities } from "../../../../utils/resolve-auth-identity-email"

type MergeConfirmBody = {
  token?: string
}

type MergeTokenPayload = {
  email?: string
  purpose?: string
}

type OrderClaimCandidate = {
  id: string
  email?: string | null
  customer_id?: string | null
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { token } = (req.body ?? {}) as MergeConfirmBody

  if (!token || typeof token !== "string") {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El campo token es requerido."
    )
  }

  const jwtSecret = process.env.JWT_SECRET || "supersecret"

  let email: string

  try {
    const decoded = jwt.verify(token, jwtSecret) as MergeTokenPayload

    if (!decoded?.email || typeof decoded.email !== "string") {
      throw new Error("Token sin email válido")
    }

    if (decoded.purpose !== "account_merge") {
      throw new Error("Token con propósito inválido")
    }

    email = decoded.email.trim().toLowerCase()
  } catch {
    throw new MedusaError(
      MedusaErrorTypes.UNAUTHORIZED,
      "Token inválido o expirado."
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const orderModuleService = req.scope.resolve(Modules.ORDER)
  const authModuleService = req.scope.resolve(Modules.AUTH)

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: {
      email,
    },
  })

  const customer = customers?.[0] as { id: string; email: string } | undefined

  if (!customer) {
    throw new MedusaError(
      MedusaErrorTypes.NOT_FOUND,
      `No se encontró un cliente con el correo ${email}.`
    )
  }

  const providerIdentityFields = [
    "id",
    "provider",
    "entity_id",
    "provider_metadata",
    "user_metadata",
    "auth_identity_id",
    "auth_identity.id",
    "auth_identity.app_metadata",
  ] as const

  const { data: emailProviderIdentities } = await query.graph({
    entity: "provider_identity",
    fields: [...providerIdentityFields],
    filters: {
      entity_id: email,
    },
  })

  const { data: googleProviderIdentities } = await query.graph({
    entity: "provider_identity",
    fields: [...providerIdentityFields],
    filters: {
      provider: "google",
    },
  })

  const providerIdentitiesByAuthId = new Map<string, (typeof emailProviderIdentities)[0]>()

  for (const providerIdentity of [
    ...(emailProviderIdentities ?? []),
    ...(googleProviderIdentities ?? []),
  ]) {
    const resolvedEmail = resolveCustomerEmailFromProviderIdentities([
      providerIdentity as Parameters<
        typeof resolveCustomerEmailFromProviderIdentities
      >[0][0],
    ])

    if (resolvedEmail !== email) {
      continue
    }

    const authId = (
      providerIdentity as { auth_identity_id?: string }
    ).auth_identity_id

    if (authId) {
      providerIdentitiesByAuthId.set(authId, providerIdentity)
    }
  }

  let linkedAuthIdentityId = await linkProviderIdentitiesToCustomer(
    req.scope,
    Array.from(
      providerIdentitiesByAuthId.values()
    ) as ProviderIdentityWithAuth[],
    email,
    customer.id
  )

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "email", "customer_id"],
    filters: {
      email,
    },
  })

  const orphanOrders = (orders as OrderClaimCandidate[]).filter(
    (order) =>
      order.email?.trim().toLowerCase() === email &&
      order.customer_id !== customer.id
  )

  if (orphanOrders.length) {
    await orderModuleService.updateOrders(
      { id: orphanOrders.map((order) => order.id) },
      { customer_id: customer.id }
    )
  }

  if (!linkedAuthIdentityId) {
    linkedAuthIdentityId =
      Array.from(providerIdentitiesByAuthId.values())
        .map(
          (providerIdentity) =>
            (
              providerIdentity as {
                auth_identity?: {
                  id: string
                  app_metadata?: Record<string, unknown>
                } | null
              }
            ).auth_identity
        )
        .find(
          (authIdentity) =>
            authIdentity?.app_metadata?.customer_id === customer.id
        )?.id ?? null
  }

  if (!linkedAuthIdentityId) {
    throw new MedusaError(
      MedusaErrorTypes.NOT_FOUND,
      "No se encontró una identidad de Google vinculable. Inicia sesión con Google una vez para completar la unificación."
    )
  }

  const authIdentity = await authModuleService.retrieveAuthIdentity(
    linkedAuthIdentityId,
    {
      relations: ["provider_identities"],
    }
  )

  const authToken = await generateJwtTokenForAuthIdentity(
    {
      authIdentity,
      actorType: "customer",
      authProvider: "google",
      container: req.scope,
    },
    {
      secret: jwtSecret,
      expiresIn: "7d",
    }
  )

  return res.status(200).json({
    success: true,
    token: authToken,
    customer_id: customer.id,
    claimed_orders: orphanOrders.length,
  })
}

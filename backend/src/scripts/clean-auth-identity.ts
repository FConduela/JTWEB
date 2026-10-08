import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import {
  linkProviderIdentitiesToCustomer,
  ProviderIdentityWithAuth,
} from "../utils/link-provider-identities-to-customer"
import { resolveCustomerEmailFromProviderIdentities } from "../utils/resolve-auth-identity-email"

const TARGET_EMAIL = "felipe.c.ramirez@gmail.com"

export default async function cleanAuthIdentity({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const normalizedEmail = TARGET_EMAIL.trim().toLowerCase()

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: {
      email: normalizedEmail,
    },
  })

  const customer = customers?.[0] as { id: string; email: string } | undefined

  if (!customer) {
    console.log(`No se encontró customer para ${normalizedEmail}`)
    return
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
      entity_id: normalizedEmail,
    },
  })

  const { data: googleProviderIdentities } = await query.graph({
    entity: "provider_identity",
    fields: [...providerIdentityFields],
    filters: {
      provider: "google",
    },
  })

  const providerIdentitiesByAuthId = new Map<string, unknown>()

  for (const providerIdentity of [
    ...(emailProviderIdentities ?? []),
    ...(googleProviderIdentities ?? []),
  ]) {
    const resolvedEmail = resolveCustomerEmailFromProviderIdentities([
      providerIdentity as Parameters<
        typeof resolveCustomerEmailFromProviderIdentities
      >[0][0],
    ])

    if (resolvedEmail !== normalizedEmail) {
      continue
    }

    const authIdentity = (
      providerIdentity as {
        auth_identity?: { id: string } | null
      }
    ).auth_identity

    if (authIdentity?.id) {
      providerIdentitiesByAuthId.set(authIdentity.id, providerIdentity)
    }
  }

  const identities = Array.from(providerIdentitiesByAuthId.values())

  if (!identities.length) {
    console.log(
      `No se encontraron identidades de auth para ${normalizedEmail}.`
    )
  }

  for (const providerIdentity of identities) {
    const authIdentity = (
      providerIdentity as {
        auth_identity?: {
          id: string
          app_metadata?: Record<string, unknown>
        } | null
      }
    ).auth_identity

    if (!authIdentity?.id) {
      continue
    }

    const existingCustomerId = authIdentity.app_metadata?.customer_id

    if (existingCustomerId === customer.id) {
      console.log(
        `Auth identity ${authIdentity.id} ya está vinculada correctamente.`
      )
      continue
    }

    if (existingCustomerId && existingCustomerId !== customer.id) {
      console.log(
        `Auth identity ${authIdentity.id} tiene customer_id corrupto (${existingCustomerId}). Ejecuta limpieza manual en la base de datos o elimina la identidad duplicada.`
      )
      continue
    }

    console.log(
      `Vinculando auth identity ${authIdentity.id} al customer ${customer.id}`
    )
  }

  await linkProviderIdentitiesToCustomer(
    container,
    identities as ProviderIdentityWithAuth[],
    normalizedEmail,
    customer.id
  )

  console.log(`Limpieza completada para ${normalizedEmail}`)
}

import type { MedusaContainer } from "@medusajs/framework/types"

import { linkCustomerIdentityWorkflow } from "../workflows/link-customer-identity"
import {
  ProviderIdentityLike,
  resolveCustomerEmailFromProviderIdentities,
} from "./resolve-auth-identity-email"

export type ProviderIdentityWithAuth = ProviderIdentityLike & {
  auth_identity?: {
    id: string
    app_metadata?: Record<string, unknown> | null
  } | null
}

export async function linkProviderIdentitiesToCustomer(
  container: MedusaContainer,
  providerIdentities: ProviderIdentityWithAuth[],
  normalizedEmail: string,
  customerId: string
): Promise<string | null> {
  let linkedAuthIdentityId: string | null = null

  for (const providerIdentity of providerIdentities) {
    const resolvedEmail = resolveCustomerEmailFromProviderIdentities([
      providerIdentity,
    ])

    if (resolvedEmail !== normalizedEmail) {
      continue
    }

    const authIdentity = providerIdentity.auth_identity

    if (!authIdentity?.id) {
      continue
    }

    const existingCustomerId = authIdentity.app_metadata?.customer_id

    if (existingCustomerId === customerId) {
      linkedAuthIdentityId = authIdentity.id
      continue
    }

    if (existingCustomerId && existingCustomerId !== customerId) {
      continue
    }

    await linkCustomerIdentityWorkflow(container).run({
      input: {
        auth_identity_id: authIdentity.id,
      },
    })

    linkedAuthIdentityId = authIdentity.id
  }

  return linkedAuthIdentityId
}

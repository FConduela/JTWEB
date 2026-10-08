export type ProviderIdentityLike = {
  provider?: string
  entity_id?: string
  provider_metadata?: Record<string, unknown> | null
  user_metadata?: Record<string, unknown> | null
}

function emailFromMetadata(
  metadata: Record<string, unknown> | null | undefined
): string | null {
  if (!metadata) {
    return null
  }

  const direct = metadata.email
  if (typeof direct === "string" && direct.includes("@")) {
    return direct.trim().toLowerCase()
  }

  const nested = metadata.user_metadata
  if (
    nested &&
    typeof nested === "object" &&
    "email" in nested &&
    typeof (nested as { email?: unknown }).email === "string"
  ) {
    const nestedEmail = (nested as { email: string }).email
    if (nestedEmail.includes("@")) {
      return nestedEmail.trim().toLowerCase()
    }
  }

  return null
}

export function resolveCustomerEmailFromProviderIdentities(
  providerIdentities: ProviderIdentityLike[]
): string | null {
  for (const providerIdentity of providerIdentities) {
    const entityId = providerIdentity.entity_id?.trim()
    if (entityId && entityId.includes("@")) {
      return entityId.toLowerCase()
    }
  }

  for (const providerIdentity of providerIdentities) {
    const fromProvider = emailFromMetadata(providerIdentity.provider_metadata)
    if (fromProvider) {
      return fromProvider
    }

    const fromUser = emailFromMetadata(providerIdentity.user_metadata)
    if (fromUser) {
      return fromUser
    }
  }

  return null
}

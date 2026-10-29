import { isBlankCustomerField } from "./customer-display"

function pickString(
  obj: Record<string, unknown> | undefined,
  keys: string[]
): string {
  if (!obj) {
    return ""
  }

  for (const key of keys) {
    const value = obj[key]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return ""
}

function metadataFromPayload(
  payload: Record<string, unknown>
): Record<string, unknown> | undefined {
  const userMetadata = payload.user_metadata

  if (userMetadata && typeof userMetadata === "object") {
    return userMetadata as Record<string, unknown>
  }

  const appMetadata = payload.app_metadata

  if (appMetadata && typeof appMetadata === "object") {
    return appMetadata as Record<string, unknown>
  }

  return undefined
}

export type GoogleAuthProfile = {
  email: string
  firstName: string
  lastName: string
}

export function extractGoogleProfileFromJwtPayload(
  payload: Record<string, unknown> | null | undefined
): GoogleAuthProfile {
  if (!payload) {
    return { email: "", firstName: "", lastName: "" }
  }

  const meta = metadataFromPayload(payload)

  const email = pickString(meta, ["email"]) || pickString(payload, ["email"])

  let firstName = pickString(meta, [
    "given_name",
    "first_name",
    "givenName",
    "firstName",
  ])
  let lastName = pickString(meta, [
    "family_name",
    "last_name",
    "familyName",
    "lastName",
  ])

  const fullName = pickString(meta, ["name", "full_name", "displayName"])

  if (fullName && (isBlankCustomerField(firstName) || isBlankCustomerField(lastName))) {
    const parts = fullName.split(/\s+/).filter(Boolean)

    if (parts.length >= 2) {
      if (isBlankCustomerField(firstName)) {
        firstName = parts[0]
      }

      if (isBlankCustomerField(lastName)) {
        lastName = parts.slice(1).join(" ")
      }
    } else if (parts.length === 1 && isBlankCustomerField(firstName)) {
      firstName = parts[0]
    }
  }

  return {
    email,
    firstName,
    lastName,
  }
}

export function googleProfileForNewCustomer(
  payload: Record<string, unknown> | null | undefined
): { email: string; first_name: string; last_name: string } {
  const profile = extractGoogleProfileFromJwtPayload(payload)

  return {
    email: profile.email,
    first_name: profile.firstName || "Usuario",
    last_name:
      profile.lastName || (profile.firstName ? profile.lastName : "Google"),
  }
}

export function customerNeedsNameBackfill(customer: {
  first_name?: string | null
  last_name?: string | null
}): boolean {
  return (
    isBlankCustomerField(customer.first_name) ||
    isBlankCustomerField(customer.last_name)
  )
}

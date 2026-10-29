export function isBlankCustomerField(value: unknown): boolean {
  if (value == null) {
    return true
  }

  const normalized = String(value).trim()

  if (!normalized) {
    return true
  }

  return normalized.toLowerCase() === "null"
}

export function formatCustomerFullName(
  firstName?: string | null,
  lastName?: string | null
): string {
  const parts = [firstName, lastName]
    .filter((part) => !isBlankCustomerField(part))
    .map((part) => String(part).trim())

  return parts.length > 0 ? parts.join(" ") : "Sin nombre"
}

export function formatCustomerPhone(phone?: string | null): string {
  return isBlankCustomerField(phone) ? "Sin teléfono" : String(phone).trim()
}

export function customerFirstNameOrFallback(
  firstName?: string | null,
  fallback = "Usuario"
): string {
  return isBlankCustomerField(firstName) ? fallback : String(firstName).trim()
}

/** Texto del enlace de cuenta en el navbar (invitado vs logueado). */
export function getNavAccountLabel(customer: {
  first_name?: string | null
  email?: string | null
} | null): string {
  if (!customer) {
    return "Mi cuenta"
  }

  if (!isBlankCustomerField(customer.first_name)) {
    return String(customer.first_name).trim()
  }

  const email = customer.email?.trim()

  if (email?.includes("@")) {
    const localPart = email.split("@")[0]?.trim()

    if (localPart) {
      return localPart
    }
  }

  return "Usuario"
}

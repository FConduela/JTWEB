const REQUEST_SETUP_PREFIX = /^Error setting up the request:\s*/i

/**
 * Mensajes amigables en español a partir de errores de Medusa / SDK.
 */
export function formatStorefrontError(error: unknown): string {
  let raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Ocurrió un error. Intenta de nuevo."

  raw = raw.replace(REQUEST_SETUP_PREFIX, "").trim()

  const invalidPromotion = raw.match(
    /(?:the\s+)?promotion code\s+(.+?)\s+is invalid\.?/i
  )
  if (invalidPromotion) {
    const code = invalidPromotion[1].replace(/\.$/, "")
    return `El código "${code}" no es válido.`
  }

  if (/promotion.*invalid|invalid.*promotion|promo.*invalid/i.test(raw)) {
    return "Ese código de descuento no es válido."
  }

  if (/already been applied|already applied/i.test(raw)) {
    return "Este código ya está aplicado."
  }

  if (/not found|was not found/i.test(raw) && /promotion|promo|code/i.test(raw)) {
    return "No encontramos ese código de descuento."
  }

  if (
    /invalid email or password|invalid credentials|unauthorized|authentication failed/i.test(
      raw
    )
  ) {
    return "Correo o contraseña incorrectos."
  }

  if (/identity with email already exists|email.*already exists/i.test(raw)) {
    return "Ya existe una cuenta con este correo."
  }

  if (raw.endsWith(".")) {
    return raw
  }

  return `${raw}.`
}

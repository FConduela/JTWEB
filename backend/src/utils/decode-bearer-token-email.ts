function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1]
    if (!segment) {
      return null
    }

    return JSON.parse(
      Buffer.from(segment, "base64url").toString("utf8")
    ) as Record<string, unknown>
  } catch {
    try {
      const segment = token.split(".")[1]
      if (!segment) {
        return null
      }

      return JSON.parse(
        Buffer.from(segment, "base64").toString("utf8")
      ) as Record<string, unknown>
    } catch {
      return null
    }
  }
}

export function extractEmailFromBearerToken(
  authorizationHeader: string | undefined
): string | undefined {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return undefined
  }

  const token = authorizationHeader.slice("Bearer ".length).trim()
  const payload = decodeJwtPayload(token)

  if (!payload) {
    return undefined
  }

  const userMetadata = payload.user_metadata
  if (
    userMetadata &&
    typeof userMetadata === "object" &&
    "email" in userMetadata &&
    typeof (userMetadata as { email?: unknown }).email === "string"
  ) {
    return (userMetadata as { email: string }).email.trim().toLowerCase()
  }

  if (typeof payload.email === "string" && payload.email.includes("@")) {
    return payload.email.trim().toLowerCase()
  }

  return undefined
}

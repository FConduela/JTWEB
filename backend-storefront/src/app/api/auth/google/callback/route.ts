import { linkGuestCartToCustomerIfNeeded } from "@lib/data/cart"
import {
  customerNeedsNameBackfill,
  extractGoogleProfileFromJwtPayload,
  googleProfileForNewCustomer,
} from "@lib/util/google-auth-profile"
import { isBlankCustomerField } from "@lib/util/customer-display"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"

const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    ) as Record<string, unknown>
  } catch {
    return null
  }
}

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "x-publishable-api-key": PUBLISHABLE_API_KEY,
  }
}

async function refreshAuthToken(currentToken: string): Promise<string | null> {
  try {
    const refreshRes = await fetch(`${MEDUSA_BACKEND_URL}/auth/token/refresh`, {
      method: "POST",
      headers: getAuthHeaders(currentToken),
    })

    if (!refreshRes.ok) {
      return null
    }

    const refreshData = (await refreshRes.json()) as { token?: string }
    return refreshData.token ?? null
  } catch {
    return null
  }
}

async function fetchCustomerMe(token: string) {
  return fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
    headers: getAuthHeaders(token),
  })
}

async function linkCustomerIdentity(token: string) {
  return fetch(`${MEDUSA_BACKEND_URL}/auth/link`, {
    method: "POST",
    headers: getAuthHeaders(token),
  })
}

async function createCustomer(
  token: string,
  body: {
    email: string
    first_name: string
    last_name: string
  }
) {
  return fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(body),
  })
}

async function updateCustomerProfile(
  token: string,
  body: { first_name?: string; last_name?: string }
) {
  return fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(body),
  })
}

/** Rellena nombre/apellido en Medusa solo si faltan; no sobrescribe datos editados por el usuario. */
async function backfillCustomerNamesFromGoogleIfMissing(
  token: string,
  jwtPayload: Record<string, unknown> | null
) {
  const meRes = await fetchCustomerMe(token)

  if (!meRes.ok) {
    return
  }

  const data = (await meRes.json()) as {
    customer?: { first_name?: string | null; last_name?: string | null }
  }

  const customer = data.customer

  if (!customer || !customerNeedsNameBackfill(customer)) {
    return
  }

  const profile = extractGoogleProfileFromJwtPayload(jwtPayload)
  const patch: { first_name?: string; last_name?: string } = {}

  if (
    isBlankCustomerField(customer.first_name) &&
    !isBlankCustomerField(profile.firstName)
  ) {
    patch.first_name = profile.firstName
  }

  if (
    isBlankCustomerField(customer.last_name) &&
    !isBlankCustomerField(profile.lastName)
  ) {
    patch.last_name = profile.lastName
  }

  if (Object.keys(patch).length === 0) {
    return
  }

  const updateRes = await updateCustomerProfile(token, patch)

  if (!updateRes.ok) {
    console.warn(
      "No se pudo completar nombre del cliente tras login con Google:",
      updateRes.status,
      await updateRes.text().catch(() => "")
    )
  }
}

function shouldSkipCustomerCreate(errorText: string) {
  return (
    errorText.includes("customer_id already exists") ||
    errorText.includes("already has an account") ||
    errorText.includes("already exists")
  )
}

function shouldTreatIdentityAlreadyLinked(errorText: string) {
  return (
    errorText.includes("already exists in app metadata") ||
    errorText.includes("already has an account") ||
    errorText.includes("customer_id already exists") ||
    errorText.includes("Identity already linked")
  )
}

async function recoverTokenAfterIdentityAlreadyLinked(
  authToken: string
): Promise<string> {
  const refreshedToken = await refreshAuthToken(authToken)
  let token = refreshedToken ?? authToken

  const meRes = await fetchCustomerMe(token)

  if (meRes.ok || decodeJwtPayload(token)?.actor_id) {
    return token
  }

  const secondRefresh = await refreshAuthToken(token)

  if (secondRefresh) {
    token = secondRefresh
  }

  return token
}

async function resolveAuthenticatedToken(initialToken: string) {
  let authToken = initialToken

  let meRes = await fetchCustomerMe(authToken)

  if (meRes.ok) {
    return authToken
  }

  const refreshedToken = await refreshAuthToken(authToken)

  if (refreshedToken) {
    authToken = refreshedToken
    meRes = await fetchCustomerMe(authToken)

    if (meRes.ok) {
      return authToken
    }
  }

  const payload = decodeJwtPayload(authToken)
  const actorId = payload?.actor_id

  if (!actorId) {
    const linkRes = await linkCustomerIdentity(authToken)

    if (linkRes.ok) {
      const linkedRefresh = await refreshAuthToken(authToken)

      if (linkedRefresh) {
        authToken = linkedRefresh
      }

      meRes = await fetchCustomerMe(authToken)

      if (meRes.ok) {
        return authToken
      }
    } else {
      const linkErrorText = await linkRes.text().catch(() => "")

      if (shouldTreatIdentityAlreadyLinked(linkErrorText)) {
        return recoverTokenAfterIdentityAlreadyLinked(authToken)
      }
    }
  }

  if (!decodeJwtPayload(authToken)?.actor_id) {
    const email =
      (payload?.user_metadata as { email?: string } | undefined)?.email ??
      (payload?.email as string | undefined) ??
      ""

    if (email) {
      const createRes = await createCustomer(
        authToken,
        googleProfileForNewCustomer(payload)
      )

      if (createRes.ok) {
        const createdRefresh = await refreshAuthToken(authToken)

        if (createdRefresh) {
          authToken = createdRefresh
        }

        meRes = await fetchCustomerMe(authToken)

        if (meRes.ok) {
          return authToken
        }
      } else {
        const errorText = await createRes.text().catch(() => "")

        if (shouldSkipCustomerCreate(errorText)) {
          const recoveredRefresh = await refreshAuthToken(authToken)

          if (recoveredRefresh) {
            authToken = recoveredRefresh
          }

          meRes = await fetchCustomerMe(authToken)

          if (meRes.ok || decodeJwtPayload(authToken)?.actor_id) {
            return authToken
          }
        }

        console.warn(
          "No se pudo crear ni vincular el customer tras login con Google:",
          createRes.status,
          errorText
        )

        return null
      }
    }
  }

  const finalRefresh = await refreshAuthToken(authToken)

  if (finalRefresh) {
    authToken = finalRefresh
  }

  meRes = await fetchCustomerMe(authToken)

  if (meRes.ok || decodeJwtPayload(authToken)?.actor_id) {
    return authToken
  }

  return null
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const backendUrl = `${MEDUSA_BACKEND_URL}/auth/customer/google/callback?${searchParams.toString()}`

  try {
    const response = await fetch(backendUrl, { method: "GET" })
    const data = (await response.json()) as { token?: string }

    if (!data.token) {
      throw new Error("El backend no devolvió token de autenticación")
    }

    const authToken = await resolveAuthenticatedToken(data.token)

    const initialJwtPayload = decodeJwtPayload(data.token)

    if (!authToken) {
      const payload = initialJwtPayload
      const email =
        (payload?.user_metadata as { email?: string } | undefined)?.email ??
        (payload?.email as string | undefined) ??
        ""

      if (email) {
        return NextResponse.redirect(
          new URL(
            `/verify-account?email=${encodeURIComponent(email)}`,
            request.url
          )
        )
      }

      return NextResponse.redirect(
        new URL("/account?error=auth_failed", request.url)
      )
    }

    await backfillCustomerNamesFromGoogleIfMissing(
      authToken,
      initialJwtPayload ?? decodeJwtPayload(authToken)
    )

    const cookieStore = await cookies()
    cookieStore.set("_medusa_jwt", authToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    revalidateTag("customer")
    revalidateTag("cart")

    try {
      await linkGuestCartToCustomerIfNeeded()
    } catch (linkError) {
      console.error(
        "No se pudo vincular el carrito tras login con Google:",
        linkError
      )
    }

    return NextResponse.redirect(
      new URL("/account?cart_sync=1", request.url)
    )
  } catch (err) {
    console.error("Error en el callback de Auth:", err)
  }

  return NextResponse.redirect(
    new URL("/account?error=auth_failed", request.url)
  )
}

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    return JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    )
  } catch {
    return null
  }
}

async function refreshAuthToken(currentToken: string): Promise<string | null> {
  try {
    const refreshRes = await fetch(`${MEDUSA_BACKEND_URL}/auth/token/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
    })

    if (!refreshRes.ok) {
      return null
    }

    const refreshData = await refreshRes.json()
    return refreshData.token ?? null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const backendUrl = `${MEDUSA_BACKEND_URL}/auth/customer/google/callback?${searchParams.toString()}`

  try {
    const response = await fetch(backendUrl, { method: "GET" })
    const data = await response.json()

    if (data.token) {
      let authToken = data.token as string

      const meRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
      })

      if (!meRes.ok && meRes.status === 401) {
        const payload = decodeJwtPayload(authToken)
        const email =
          payload?.user_metadata?.email ??
          payload?.email ??
          `nuevo_${Date.now()}@google.com`
        const first_name = payload?.user_metadata?.given_name ?? "Usuario"
        const last_name = payload?.user_metadata?.family_name ?? "Google"

        let createRes: Response
        try {
          createRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": PUBLISHABLE_API_KEY,
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ email, first_name, last_name }),
          })
        } catch (createError) {
          console.error(
            "Error al crear customer tras login con Google:",
            createError
          )
          return NextResponse.redirect(
            new URL(
              `/verify-account?email=${encodeURIComponent(email)}`,
              request.url
            )
          )
        }

        if (createRes.ok) {
          const refreshedToken = await refreshAuthToken(authToken)
          if (refreshedToken) {
            authToken = refreshedToken
          }
        } else {
          console.warn(
            "No se pudo crear el customer tras login con Google:",
            createRes.status,
            await createRes.text().catch(() => "")
          )
          return NextResponse.redirect(
            new URL(
              `/verify-account?email=${encodeURIComponent(email)}`,
              request.url
            )
          )
        }
      }

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

      return NextResponse.redirect(new URL("/account", request.url))
    }
  } catch (err) {
    console.error("Error en el callback de Auth:", err)
  }

  return NextResponse.redirect(
    new URL("/account?error=auth_failed", request.url)
  )
}

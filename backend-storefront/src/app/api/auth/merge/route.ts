import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(
      new URL("/account?error=missing_token", request.url)
    )
  }

  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/merge/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      throw new Error(errorText || "No se pudo confirmar la unificación")
    }

    const data = (await response.json()) as { token?: string }

    if (!data.token) {
      throw new Error("El backend no devolvió un token de sesión")
    }

    const message =
      "Cuenta unificada con éxito. Ya puedes gestionar tus pedidos desde tu cuenta."

    const redirectResponse = NextResponse.redirect(
      new URL(
        `/account?message=${encodeURIComponent(message)}`,
        request.url
      )
    )

    redirectResponse.cookies.set("_medusa_jwt", data.token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    revalidateTag("customer")
    revalidateTag("cart")

    return redirectResponse
  } catch (error) {
    console.error("Error en merge de cuentas:", error)

    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent("Token inválido o expirado")}`,
        request.url
      )
    )
  }
}

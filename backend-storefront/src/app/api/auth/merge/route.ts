import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

type MergeTokenPayload = {
  email?: string
  purpose?: string
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(
      new URL("/account?error=missing_token", request.url)
    )
  }

  const jwtSecret = process.env.JWT_SECRET || "supersecret"

  try {
    const decoded = jwt.verify(token, jwtSecret) as MergeTokenPayload
    const email = decoded?.email

    if (!email || typeof email !== "string") {
      throw new Error("Token sin email válido")
    }

    const message =
      "Cuenta unificada con éxito. Ya puedes iniciar sesión con Google."

    return NextResponse.redirect(
      new URL(
        `/account?message=${encodeURIComponent(message)}`,
        request.url
      )
    )
  } catch {
    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent("Token inválido o expirado")}`,
        request.url
      )
    )
  }
}

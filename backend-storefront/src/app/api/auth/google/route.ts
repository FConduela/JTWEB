import { NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Puente OAuth para Google Login.
 *
 * El endpoint de Medusa `/auth/customer/google` responde con JSON
 * `{ location: "https://accounts.google.com/..." }`, no con un redirect
 * HTTP. Un `<a href>` directo al backend muestra ese JSON en pantalla.
 * Este Route Handler inicia el flujo server-side y redirige (302) al
 * navegador hacia la URL de Google, permitiendo usar un enlace nativo
 * `<a href="/api/auth/google">` en el storefront.
 */
export async function GET() {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudo iniciar el login con Google." },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data?.location) {
      return NextResponse.json(
        { error: "El backend no devolvió la URL de redirección de Google." },
        { status: 502 }
      )
    }

    return NextResponse.redirect(data.location)
  } catch {
    return NextResponse.json(
      { error: "Error al conectar con el backend de autenticación." },
      { status: 500 }
    )
  }
}

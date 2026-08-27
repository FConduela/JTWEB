import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"

/**
 * Puente hacia el checkout para Webpay Plus, en dos pasos ("HTML Bounce"):
 *
 * PASO 1: Transbank vuelve aquí (GET o POST) sin `cart_id`, porque el backend
 * no siempre puede extraerlo del `context` del proveedor. Como todavía
 * estamos en un dominio externo -> localhost, el navegador ya descartó la
 * cookie `_medusa_cart_id`. Devolvemos un HTML mínimo que lee `tbk_cart_id`
 * de `localStorage` (guardado por `TransbankPaymentButton` antes del pago) y
 * rebota a esta misma ruta agregando `cart_id` en la URL.
 *
 * PASO 2: Ahora la request sí trae `cart_id` en los query params. Restauramos
 * la cookie `_medusa_cart_id` manualmente y redirigimos al paso de revisión
 * del checkout, donde `Review` intercepta `token_ws` y completa la orden.
 */
async function handleRequest(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  let token = searchParams.get("token_ws") || searchParams.get("TBK_TOKEN")

  if (request.method === "POST") {
    const formData = await request.formData().catch(() => null)
    if (formData) {
      token =
        token ||
        (formData.get("token_ws") as string | null) ||
        (formData.get("TBK_TOKEN") as string | null)
    }
  }

  const cartId = searchParams.get("cart_id")

  // PASO 2: la URL ya trae el cart_id, seteamos la cookie y vamos al checkout
  if (cartId && cartId !== "null") {
    const cookieStore = await cookies()
    cookieStore.set("_medusa_cart_id", cartId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })

    return NextResponse.redirect(
      new URL(`/checkout?step=review&token_ws=${token}`, request.url)
    )
  }

  // PASO 1: devolvemos HTML para extraer el cart_id de localStorage y rebotar
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Procesando Pago...</title></head>
      <body style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
        <h2>Procesando tu pago, por favor espera...</h2>
        <script>
          const savedCartId = localStorage.getItem("tbk_cart_id") || "";
          window.location.href = "/api/transbank/return?token_ws=${token}&cart_id=" + savedCartId;
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } })
}

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

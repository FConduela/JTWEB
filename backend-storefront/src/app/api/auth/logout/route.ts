import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  cookieStore.set("_medusa_jwt", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  cookieStore.set("_medusa_cart_id", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  revalidateTag("customer")
  revalidateTag("cart")

  return NextResponse.redirect(new URL("/account", request.url))
}

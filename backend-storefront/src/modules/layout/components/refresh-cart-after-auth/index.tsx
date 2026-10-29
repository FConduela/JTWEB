"use client"

import { finalizeCartAfterLogin } from "@lib/data/cart"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Tras login el layout del header puede quedar en caché sin el carrito actualizado.
 * ?cart_sync=1 dispara vinculación + router.refresh() una vez.
 */
export default function RefreshCartAfterAuth() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const ranRef = useRef(false)

  useEffect(() => {
    if (searchParams.get("cart_sync") !== "1" || ranRef.current) {
      return
    }

    ranRef.current = true

    const run = async () => {
      try {
        await finalizeCartAfterLogin()
      } catch (error) {
        console.error("No se pudo sincronizar el carrito tras login:", error)
      }

      const params = new URLSearchParams(searchParams.toString())
      params.delete("cart_sync")
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      router.refresh()
    }

    void run()
  }, [pathname, router, searchParams])

  return null
}

"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const QUERY_ERRORS: Record<string, string> = {
  auth_failed:
    "No pudimos iniciar sesión con Google. Intenta de nuevo o usa tu correo y contraseña.",
  missing_token: "Falta el enlace de verificación. Solicita uno nuevo.",
}

type AlertState = {
  type: "success" | "error"
  text: string
}

function parseAlert(searchParams: URLSearchParams): AlertState | null {
  const rawMessage = searchParams.get("message")
  const rawError = searchParams.get("error")

  if (rawMessage) {
    try {
      return { type: "success", text: decodeURIComponent(rawMessage) }
    } catch {
      return { type: "success", text: rawMessage }
    }
  }

  if (rawError) {
    const decoded = (() => {
      try {
        return decodeURIComponent(rawError)
      } catch {
        return rawError
      }
    })()
    return {
      type: "error",
      text: QUERY_ERRORS[decoded] ?? decoded,
    }
  }

  return null
}

/**
 * Avisos de ?message= y ?error= en la cuenta (p. ej. tras unificar cuentas).
 */
export default function AccountQueryAlerts() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [alert, setAlert] = useState<AlertState | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const parsed = parseAlert(searchParams)
    if (!parsed) {
      return
    }

    setAlert(parsed)
    setDismissed(false)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("message")
    params.delete("error")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar / cambio de query
  }, [searchParams.get("message"), searchParams.get("error")])

  if (!alert || dismissed) {
    return null
  }

  const isSuccess = alert.type === "success"

  return (
    <div
      className={
        isSuccess
          ? "mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-800"
          : "mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
      }
      role={isSuccess ? "status" : "alert"}
    >
      <div className="flex items-start justify-between gap-3">
        <p>{alert.text}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

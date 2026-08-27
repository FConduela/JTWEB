"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export default function VerifyAccountPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")?.trim() || ""
  const displayEmail = email || "tu correo"

  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const sendMagicLink = async () => {
    if (!email || isLoading || isSent) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${MEDUSA_BACKEND_URL}/store/merge-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_API_KEY,
          },
          body: JSON.stringify({ email }),
        }
      )

      if (!response.ok) {
        throw new Error("No se pudo enviar el enlace mágico")
      }

      setIsSent(true)
    } catch (error) {
      console.error("Error al solicitar enlace de fusión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10 small:py-16">
      <div className="rounded-2xl border border-grey-20 bg-white p-8 shadow-sm">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-brand-text mb-4">
          ¡Detectamos compras previas!
        </h1>

        <p className="text-base text-brand-text/80 leading-relaxed mb-6">
          Parece que ya has comprado en Jugando Toy con el correo{" "}
          <span className="font-semibold text-brand-primary">{displayEmail}</span>{" "}
          como invitado. Haz clic abajo para recibir un enlace seguro y unificar
          tu historial.
        </p>

        {isSent ? (
          <p className="mb-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            ¡Enlace enviado! Revisa tu bandeja de entrada (y la carpeta de spam).
          </p>
        ) : (
          <button
            type="button"
            onClick={sendMagicLink}
            disabled={!email || isLoading}
            className="mb-8 inline-flex w-full items-center justify-center rounded-lg bg-brand-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? "Enviando..." : "Enviar enlace mágico"}
          </button>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <LocalizedClientLink
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-grey-20 px-5 py-3 text-sm font-medium text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Volver al inicio
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/account"
            className="inline-flex items-center justify-center rounded-lg border border-grey-20 px-5 py-3 text-sm font-medium text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Intentar con otra cuenta
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="max-w-xl text-2xl font-bold text-brand-text md:text-3xl">
        ¡Ups! Algo pasó en nuestro taller de juguetes
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-brand-text/80">
        Estamos revisando el problema. Puedes intentar de nuevo o volver al
        inicio para seguir explorando.
      </p>
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand-primary px-6 py-2 text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-grey-20 bg-brand-bg px-6 py-2 text-base font-semibold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const STORAGE_KEY = "jugandotoy_cookies_accepted"

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      if (accepted !== "true") {
        setShowBanner(true)
      }
    } catch {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // ignore quota / private mode
    }
    setShowBanner(false)
  }

  if (!showBanner) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-900 px-4 py-4 text-white shadow-lg md:px-6 md:py-5"
    >
      <div className="content-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p
          id="cookie-banner-description"
          className="text-sm leading-relaxed text-gray-100 md:max-w-3xl md:text-base"
        >
          <span id="cookie-banner-title" className="sr-only">
            Aviso de cookies
          </span>
          Utilizamos cookies para mejorar tu experiencia. Al navegar por
          Jugando Toy, aceptas nuestra{" "}
          <Link
            href="/politicas/cookies"
            className="inline-flex min-h-[44px] items-center font-medium text-white underline underline-offset-4 transition-colors hover:text-brand-secondary"
          >
            Política de Cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-brand-secondary px-6 py-2 text-sm font-semibold text-brand-text transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

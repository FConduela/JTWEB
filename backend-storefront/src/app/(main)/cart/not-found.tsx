import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Carrito no encontrado | Jugando Toy",
  description: "No pudimos cargar tu carrito",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
        No encontramos tu carrito
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-text/80">
        El carrito al que intentaste acceder no existe. Puedes borrar las
        cookies del sitio e intentar de nuevo, o empezar una compra nueva.
      </p>
      <LocalizedClientLink
        href="/"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-accent px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
      >
        Volver al inicio
      </LocalizedClientLink>
    </div>
  )
}

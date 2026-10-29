import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout no disponible | Jugando Toy",
  description: "No pudimos cargar tu checkout",
}

export default function CheckoutNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
        No pudimos cargar el checkout
      </h1>
      <p className="max-w-md text-sm text-brand-text/80">
        Tu carrito puede estar vacío o expiró. Vuelve al carrito e intenta de
        nuevo.
      </p>
      <LocalizedClientLink
        href="/cart"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-accent px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent/90"
      >
        Ir al carrito
      </LocalizedClientLink>
    </div>
  )
}

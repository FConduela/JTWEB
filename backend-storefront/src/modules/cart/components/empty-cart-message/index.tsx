import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Mensaje vacío dentro de la tarjeta de productos (mismo layout que carrito con ítems). */
const EmptyCartMessage = () => {
  return (
    <div
      className="rounded-lg border border-dashed border-gray-200 bg-brand-bg/50 px-4 py-10 text-center"
      data-testid="empty-cart-message"
    >
      <p className="text-sm text-brand-text/80 md:text-base">
        Aún no tienes productos en tu carrito.
      </p>
      <LocalizedClientLink
        href="/store"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-accent px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#c91c22] hover:shadow-md active:scale-[0.98]"
      >
        Explorar productos
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage

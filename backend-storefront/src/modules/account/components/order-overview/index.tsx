"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex w-full flex-col gap-y-6">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-center gap-y-4 rounded-2xl border border-dashed border-gray-200 bg-brand-bg/40 px-4 py-10 text-center"
      data-testid="no-orders-container"
    >
      <h2 className="text-lg font-semibold text-brand-text">
        Aún no hay pedidos
      </h2>
      <p className="max-w-sm text-sm text-brand-text/80">
        Cuando compres, verás aquí el historial y el detalle de cada compra.
      </p>
      <LocalizedClientLink
        href="/store"
        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-accent px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#c91c22] hover:shadow-md"
        data-testid="continue-shopping-button"
      >
        Explorar productos
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview

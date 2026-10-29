"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
          Detalle del pedido
        </h1>
        <LocalizedClientLink
          href="/account/orders"
          className="inline-flex min-h-[44px] w-fit items-center gap-2 text-sm font-semibold text-brand-accent transition-colors hover:text-[#c91c22] sm:shrink-0"
          data-testid="back-to-overview-button"
        >
          <ChevronDown
            className="rotate-90 transform shrink-0"
            size={18}
            aria-hidden="true"
          />
          Volver a pedidos
        </LocalizedClientLink>
      </div>
      <div
        className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate

"use client"

import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const itemsLabel =
    numberOfLines === 1 ? "1 artículo" : `${numberOfLines} artículos`

  return (
    <div className="flex flex-col" data-testid="order-card">
      <div className="mb-2 text-lg font-bold text-brand-accent">
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-text/80">
        <span data-testid="order-created-at">
          {dateFormatter.format(new Date(order.created_at))}
        </span>
        <span aria-hidden>·</span>
        <span data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span aria-hidden>·</span>
        <span>{itemsLabel}</span>
      </div>
      <div className="my-4 grid grid-cols-2 gap-4 small:grid-cols-4">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              <div className="flex items-center text-sm text-brand-text">
                <span className="font-semibold" data-testid="item-title">
                  {i.title}
                </span>
                <span className="ml-2">×</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 3 && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-brand-bg/50 text-sm text-brand-text/70">
            <span>+ {numberOfProducts - 3}</span>
            <span>más</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="inline-flex min-h-9 items-center justify-center rounded-full border border-brand-accent px-5 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-white"
          data-testid="order-details-link"
        >
          Ver detalle
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard

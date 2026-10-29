import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-brand-text">
        Resumen del pedido
      </h2>
      <div className="my-2 text-sm text-brand-text">
        <div className="mb-2 flex items-center justify-between">
          <span>Subtotal</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Descuento</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Tarjeta regalo</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Impuestos</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="my-4 h-px w-full border-b border-dashed border-gray-200" />
        <div className="mb-2 flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span className="text-brand-accent">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary

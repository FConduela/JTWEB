import { HttpTypes } from "@medusajs/types"
import { formatOrderStatusLabel } from "@lib/util/order-status-label"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  return (
    <div className="text-sm text-brand-text md:text-base">
      <p>
        Enviamos la confirmación del pedido a{" "}
        <span
          className="font-semibold text-brand-text"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p>
      <p className="mt-2 font-semibold text-brand-text">
        Fecha del pedido:{" "}
        <span data-testid="order-date">
          {dateFormatter.format(new Date(order.created_at))}
        </span>
      </p>
      <p className="mt-2 font-medium text-brand-accent">
        Número de pedido:{" "}
        <span data-testid="order-id">{order.display_id}</span>
      </p>

      {showStatus && (
        <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-brand-text sm:flex-row sm:gap-6">
          <p>
            Estado del envío:{" "}
            <span data-testid="order-status">
              {formatOrderStatusLabel(order.fulfillment_status, "fulfillment")}
            </span>
          </p>
          <p>
            Estado del pago:{" "}
            <span data-testid="order-payment-status">
              {formatOrderStatusLabel(order.payment_status, "payment")}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderDetails

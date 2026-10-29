import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <h2 className="my-4 text-lg font-semibold text-brand-text">Entrega</h2>
      <div className="flex flex-col items-start gap-6 md:flex-row md:gap-x-8">
        <div
          className="flex w-full flex-col md:w-1/3"
          data-testid="shipping-address-summary"
        >
          <p className="mb-1 text-sm font-semibold text-brand-text">
            Dirección de envío
          </p>
          <p className="text-sm text-brand-text/80">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </p>
          <p className="text-sm text-brand-text/80">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </p>
          <p className="text-sm text-brand-text/80">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </p>
          <p className="text-sm text-brand-text/80">
            {order.shipping_address?.country_code?.toUpperCase()}
          </p>
        </div>

        <div
          className="flex w-full flex-col md:w-1/3"
          data-testid="shipping-contact-summary"
        >
          <p className="mb-1 text-sm font-semibold text-brand-text">Contacto</p>
          <p className="text-sm text-brand-text/80">
            {order.shipping_address?.phone}
          </p>
          <p className="text-sm text-brand-text/80">{order.email}</p>
        </div>

        <div
          className="flex w-full flex-col md:w-1/3"
          data-testid="shipping-method-summary"
        >
          <p className="mb-1 text-sm font-semibold text-brand-text">Método</p>
          <p className="text-sm text-brand-text/80">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </p>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails

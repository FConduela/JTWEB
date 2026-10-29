import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { SHOW_ORDER_TRANSFER_FORM } from "@lib/constants"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Historial y estado de tus compras.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <header className="mb-6 border-b border-gray-200 pb-4 md:mb-8">
        <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
          Pedidos
        </h1>
        <p className="mt-2 text-sm text-brand-text/80 md:text-base">
          Revisa tus compras anteriores y consulta el detalle de cada pedido.
        </p>
      </header>
      <div>
        <OrderOverview orders={orders} />
        {SHOW_ORDER_TRANSFER_FORM && (
          <>
            <Divider className="my-10 md:my-12" />
            <TransferRequestForm />
          </>
        )}
      </div>
    </div>
  )
}

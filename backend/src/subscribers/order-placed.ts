import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import {
  buildOrderReceiptHtml,
  getCustomerFirstName,
} from "./utils/order-receipt-html"

type OrderWithReceiptDetails = {
  id: string
  email?: string | null
  display_id?: string | number | null
  currency_code?: string
  total?: unknown
  shipping_total?: unknown
  item_total?: unknown
  items?: Array<{
    title?: string | null
    product_title?: string | null
    quantity?: number | null
    unit_price?: unknown
    subtotal?: unknown
    total?: unknown
  }>
  shipping_address?: {
    first_name?: string | null
  } | null
  summary?: {
    current_order_total?: unknown
    accounting_total?: unknown
    paid_total?: unknown
    original_order_total?: unknown
  } | null
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "email",
      "display_id",
      "currency_code",
      "total",
      "shipping_total",
      "item_total",
      "items.*",
      "shipping_address.*",
      "summary.*",
    ],
    filters: {
      id: data.id,
    },
  })

  const order = orders?.[0] as OrderWithReceiptDetails | undefined

  if (!order) {
    console.warn(
      `[Resend] No se encontró la orden ${data.id}; se omite la notificación.`
    )
    return
  }

  if (!order.email) {
    console.warn(
      `[Resend] Orden ${order.id} sin email; se omite la notificación.`
    )
    return
  }

  const customerName = getCustomerFirstName(order.shipping_address)
  const displayId = order.display_id ?? order.id

  const htmlTemplate = buildOrderReceiptHtml({
    displayId,
    customerName,
    items: order.items ?? [],
    total: order.total,
    shippingTotal: order.shipping_total,
    itemTotal: order.item_total,
    summary: order.summary,
    currencyCode: order.currency_code ?? "clp",
  })

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order_placed",
    data: {
      html: htmlTemplate,
      subject: `Confirmación de pedido #${displayId} - Jugando Toy`,
      order_id: displayId,
      first_name: customerName,
    },
  })

  console.log(
    `[Resend] Recibo enviado para la orden: ${order.id} (#${displayId})`
  )
}

export const config: SubscriberConfig = {
  event: "order.placed",
}

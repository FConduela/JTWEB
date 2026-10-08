import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService = container.resolve(Modules.ORDER)

  const order = await orderModuleService.retrieveOrder(
    (event.data as { id: string }).id,
    {
      relations: ["customer"],
    }
  )

  if (!order.email) return

  const orderWithCustomer = order as typeof order & {
    customer?: { first_name?: string | null } | null
  }

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order_receipt",
    data: {
      order_id: order.display_id,
      total: order.total,
      currency: order.currency_code,
      customer_name: orderWithCustomer.customer?.first_name || "Cliente",
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}

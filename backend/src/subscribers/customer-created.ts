import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const customerModuleService = container.resolve(Modules.CUSTOMER)

  const customer = await customerModuleService.retrieveCustomer(
    (event.data as { id: string }).id
  )

  if (!customer.email) return

  await notificationModuleService.createNotifications({
    to: customer.email,
    channel: "email",
    template: "welcome_email",
    data: {
      first_name: customer.first_name || "Cliente",
      email: customer.email,
    },
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
}

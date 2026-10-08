import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function abandonedCartJob(container: MedusaContainer) {
  const cartModuleService = container.resolve(Modules.CART)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const yesterday = new Date()
  yesterday.setHours(yesterday.getHours() - 24)

  const [carts] = await cartModuleService.listAndCountCarts({
    updated_at: { $lt: yesterday.toISOString() },
  })

  const eligibleCarts = carts.filter((cart) => {
    const metadata = (cart.metadata ?? {}) as Record<string, unknown>
    return metadata.abandoned_email_sent !== true
  })

  for (const cart of eligibleCarts) {
    if (!cart.email) {
      continue
    }

    await notificationModuleService.createNotifications({
      to: cart.email,
      channel: "email",
      template: "abandoned_cart",
      data: {
        cart_id: cart.id,
        email: cart.email,
      },
    })

    const metadata = (cart.metadata ?? {}) as Record<string, unknown>

    await cartModuleService.updateCarts(cart.id, {
      metadata: {
        ...metadata,
        abandoned_email_sent: true,
      },
    })
  }
}

export const config = {
  name: "abandoned-cart-recovery",
  schedule: "0 0 * * 0",
}

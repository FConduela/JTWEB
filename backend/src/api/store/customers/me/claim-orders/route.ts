import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
  MedusaErrorTypes,
  Modules,
} from "@medusajs/framework/utils"

type OrderClaimCandidate = {
  id: string
  email?: string | null
  customer_id?: string | null
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  const orderModuleService = req.scope.resolve(Modules.ORDER)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const customer = await customerModuleService.retrieveCustomer(customerId)

  if (!customer.email) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El cliente autenticado no tiene email."
    )
  }

  const normalizedEmail = customer.email.trim().toLowerCase()

  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "email", "customer_id"],
    filters: {
      email: normalizedEmail,
    },
  })

  const orphanOrders = (orders as OrderClaimCandidate[]).filter(
    (order) =>
      order.email?.trim().toLowerCase() === normalizedEmail &&
      order.customer_id !== customerId
  )

  if (!orphanOrders.length) {
    return res.status(200).json({
      success: true,
      claimed_count: 0,
    })
  }

  await orderModuleService.updateOrders(
    { id: orphanOrders.map((order) => order.id) },
    { customer_id: customerId }
  )

  return res.status(200).json({
    success: true,
    claimed_count: orphanOrders.length,
  })
}

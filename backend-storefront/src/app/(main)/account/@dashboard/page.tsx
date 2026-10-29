import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { claimGuestOrders, listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Resumen de tu actividad en la tienda.",
}

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  try {
    await claimGuestOrders()
  } catch (error) {
    console.error("No se pudieron reclamar órdenes de invitado:", error)
  }

  const orders = (await listOrders().catch(() => null)) || null

  return <Overview customer={customer} orders={orders} />
}

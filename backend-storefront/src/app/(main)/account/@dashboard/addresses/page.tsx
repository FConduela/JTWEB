import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Direcciones",
  description: "Administra tus direcciones de envío.",
}

export default async function Addresses() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <header className="mb-6 border-b border-gray-200 pb-4 md:mb-8">
        <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
          Direcciones de envío
        </h1>
        <p className="mt-2 text-sm text-brand-text/80 md:text-base">
          Agrega o edita direcciones para usarlas más rápido al pagar.
        </p>
      </header>
      <AddressBook customer={customer} />
    </div>
  )
}

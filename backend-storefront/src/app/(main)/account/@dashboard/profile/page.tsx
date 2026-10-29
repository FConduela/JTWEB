import { Metadata } from "next"

import ProfilePhone from "@modules/account/components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"

import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Perfil",
  description: "Consulta y actualiza tu información personal.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <header className="mb-6 border-b border-gray-200 pb-4 md:mb-8">
        <h1 className="text-xl font-bold text-brand-accent md:text-2xl">
          Perfil
        </h1>
        <p className="mt-2 text-sm text-brand-text/80 md:text-base">
          Actualiza tu nombre, correo, teléfono y dirección de facturación.
        </p>
      </header>
      <div className="flex w-full flex-col gap-y-4">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfileBillingAddress customer={customer} />
      </div>
    </div>
  )
}

import React, { Suspense } from "react"

import UnderlineLink from "@modules/common/components/interactive-link"
import AccountQueryAlerts from "@modules/account/components/account-query-alerts"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const guestFooter = (
  <div className="mt-10 border-t border-gray-200 pt-8 text-center small:text-left">
    <h3 className="mb-2 text-base font-semibold text-brand-text">
      ¿Necesitas ayuda?
    </h3>
    <p className="mb-4 text-sm text-brand-text/80">
      Revisa las preguntas frecuentes o contáctanos si tienes dudas con tu
      cuenta o tus pedidos.
    </p>
    <UnderlineLink href="/preguntas-frecuentes">
      Preguntas frecuentes
    </UnderlineLink>
  </div>
)

const dashboardFooter = (
  <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-8 small:flex-row small:items-end">
    <div>
      <h3 className="mb-2 text-base font-semibold text-brand-text">
        ¿Necesitas ayuda?
      </h3>
      <p className="max-w-xl text-sm text-brand-text/80">
        Encuentra respuestas en nuestras preguntas frecuentes o escríbenos desde
        la página de contacto.
      </p>
    </div>
    <UnderlineLink href="/preguntas-frecuentes">
      Preguntas frecuentes
    </UnderlineLink>
  </div>
)

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <div className="flex-1 py-6 md:py-10" data-testid="account-page">
        <div className="content-container flex flex-col items-center">
          {children}
          <div className="w-full max-w-md">{guestFooter}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-6 md:py-10" data-testid="account-page">
      <div className="content-container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 small:grid-cols-[minmax(0,220px)_1fr] lg:gap-10">
          <aside className="small:sticky small:top-24 small:self-start">
            <div className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-5">
              <AccountNav customer={customer} />
            </div>
          </aside>
          <main className="min-w-0">
            <Suspense fallback={null}>
              <AccountQueryAlerts />
            </Suspense>
            {children}
          </main>
        </div>
        {dashboardFooter}
      </div>
    </div>
  )
}

export default AccountLayout

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { customerFirstNameOrFallback } from "@lib/util/customer-display"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressesCount = customer?.addresses?.length || 0
  const recentOrders = orders?.slice(0, 5) ?? []

  return (
    <section
      className="flex flex-col gap-6"
      data-testid="overview-page-wrapper"
      aria-labelledby="account-overview-heading"
    >
      <header className="border-b border-gray-200 pb-4">
        <h1
          id="account-overview-heading"
          className="text-xl font-bold text-brand-accent md:text-2xl"
          data-testid="welcome-message"
          data-value={customer?.first_name}
        >
          Hola, {customerFirstNameOrFallback(customer?.first_name)}
        </h1>
        <p className="mt-2 text-sm text-brand-text/80">
          Sesión iniciada como{" "}
          <span
            className="font-medium text-brand-text"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </p>
      </header>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        <article className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
          <h2 className="mb-3 text-base font-semibold text-brand-text">
            Perfil
          </h2>
          <p className="flex items-end gap-x-2">
            <span
              className="text-3xl font-bold leading-none text-brand-accent"
              data-testid="customer-profile-completion"
              data-value={profileCompletion}
            >
              {profileCompletion}%
            </span>
            <span className="text-xs font-medium uppercase text-brand-text/60">
              Completado
            </span>
          </p>
          <LocalizedClientLink
            href="/account/profile"
            className="mt-4 inline-block text-sm font-medium text-brand-accent hover:underline"
          >
            Editar perfil
          </LocalizedClientLink>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
          <h2 className="mb-3 text-base font-semibold text-brand-text">
            Direcciones
          </h2>
          <p className="flex items-end gap-x-2">
            <span
              className="text-3xl font-bold leading-none text-brand-accent"
              data-testid="addresses-count"
              data-value={addressesCount}
            >
              {addressesCount}
            </span>
            <span className="text-xs font-medium uppercase text-brand-text/60">
              Guardadas
            </span>
          </p>
          <LocalizedClientLink
            href="/account/addresses"
            className="mt-4 inline-block text-sm font-medium text-brand-accent hover:underline"
          >
            Gestionar direcciones
          </LocalizedClientLink>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:col-span-2 md:p-6">
          <header className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-brand-text">
              Pedidos recientes
            </h2>
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm font-medium text-brand-accent hover:underline"
            >
              Ver todos
            </LocalizedClientLink>
          </header>

          <ul className="flex flex-col gap-3" data-testid="orders-wrapper">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <li
                  key={order.id}
                  data-testid="order-wrapper"
                  data-value={order.id}
                >
                  <LocalizedClientLink
                    href={`/account/orders/details/${order.id}`}
                    className="block rounded-xl border border-gray-200 bg-brand-bg/30 p-4 transition-colors hover:border-brand-accent/30 hover:bg-brand-section/30"
                  >
                    <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 sm:gap-4">
                      <div>
                        <span className="block text-xs font-semibold uppercase text-brand-text/60">
                          Fecha
                        </span>
                        <time
                          dateTime={new Date(order.created_at).toISOString()}
                          data-testid="order-created-date"
                        >
                          {dateFormatter.format(new Date(order.created_at))}
                        </time>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase text-brand-text/60">
                          Número
                        </span>
                        <span
                          data-testid="order-id"
                          data-value={order.display_id}
                        >
                          #{order.display_id}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase text-brand-text/60">
                          Total
                        </span>
                        <span data-testid="order-amount">
                          {convertToLocale({
                            amount: order.total,
                            currency_code: order.currency_code,
                          })}
                        </span>
                      </div>
                    </div>
                  </LocalizedClientLink>
                </li>
              ))
            ) : (
              <li>
                <p
                  className="text-sm text-brand-text/70"
                  data-testid="no-orders-message"
                >
                  Aún no tienes pedidos recientes.
                </p>
              </li>
            )}
          </ul>
        </article>
      </div>
    </section>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview

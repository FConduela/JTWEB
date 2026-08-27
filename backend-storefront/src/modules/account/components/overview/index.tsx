import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ClaimGuestOrdersOnMount from "@modules/account/components/claim-guest-orders"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)
  const addressesCount = customer?.addresses?.length || 0
  const recentOrders = orders?.slice(0, 5) ?? []

  return (
    <section
      className="flex flex-col gap-4 md:gap-6"
      data-testid="overview-page-wrapper"
      aria-labelledby="account-overview-heading"
    >
      <ClaimGuestOrdersOnMount />
      <header className="flex flex-col gap-2 border-b border-ui-border-base pb-4">
        <h1
          id="account-overview-heading"
          className="text-xl-semi"
          data-testid="welcome-message"
          data-value={customer?.first_name}
        >
          Hola, {customer?.first_name}
        </h1>
        <p className="text-small-regular text-ui-fg-subtle">
          Sesión iniciada como{" "}
          <span
            className="font-medium text-ui-fg-base"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </p>
      </header>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        <article className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 md:p-6">
          <h2 className="text-base-semi mb-3">Perfil</h2>
          <p className="flex items-end gap-x-2">
            <span
              className="text-3xl-semi leading-none"
              data-testid="customer-profile-completion"
              data-value={profileCompletion}
            >
              {profileCompletion}%
            </span>
            <span className="text-small-regular text-ui-fg-subtle uppercase">
              Completado
            </span>
          </p>
          <LocalizedClientLink
            href="/account/profile"
            className="mt-4 inline-block text-small-regular underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
          >
            Editar perfil
          </LocalizedClientLink>
        </article>

        <article className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 md:p-6">
          <h2 className="text-base-semi mb-3">Direcciones</h2>
          <p className="flex items-end gap-x-2">
            <span
              className="text-3xl-semi leading-none"
              data-testid="addresses-count"
              data-value={addressesCount}
            >
              {addressesCount}
            </span>
            <span className="text-small-regular text-ui-fg-subtle uppercase">
              Guardadas
            </span>
          </p>
          <LocalizedClientLink
            href="/account/addresses"
            className="mt-4 inline-block text-small-regular underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
          >
            Gestionar direcciones
          </LocalizedClientLink>
        </article>

        <nav
          className="flex flex-col gap-2 rounded-lg border border-ui-border-base p-4 md:p-6"
          aria-label="Accesos rápidos de cuenta"
        >
          <h2 className="text-base-semi mb-1">Accesos rápidos</h2>
          <ul className="flex flex-col gap-2 text-small-regular">
            <li>
              <LocalizedClientLink
                href="/account/profile"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline"
                data-testid="profile-link"
              >
                Mi perfil
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/account/addresses"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline"
                data-testid="addresses-link"
              >
                Mis direcciones
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/account/orders"
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline"
                data-testid="orders-link"
              >
                Mis pedidos
              </LocalizedClientLink>
            </li>
          </ul>
        </nav>

        <article className="rounded-lg border border-ui-border-base p-4 md:p-6 md:col-span-2">
          <header className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-base-semi">Pedidos recientes</h2>
            <LocalizedClientLink
              href="/account/orders"
              className="text-small-regular underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
            >
              Ver todos
            </LocalizedClientLink>
          </header>

          <ul className="flex flex-col gap-3" data-testid="orders-wrapper">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                  <LocalizedClientLink
                    href={`/account/orders/details/${order.id}`}
                    className="block rounded-md border border-ui-border-base bg-ui-bg-subtle p-4 transition-colors hover:bg-ui-bg-subtle-hover"
                  >
                    <div className="grid grid-cols-1 gap-2 text-small-regular sm:grid-cols-3 sm:gap-4">
                      <div>
                        <span className="block font-semibold">Fecha</span>
                        <time dateTime={order.created_at} data-testid="order-created-date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </time>
                      </div>
                      <div>
                        <span className="block font-semibold">Número</span>
                        <span data-testid="order-id" data-value={order.display_id}>
                          #{order.display_id}
                        </span>
                      </div>
                      <div>
                        <span className="block font-semibold">Total</span>
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
                <p className="text-small-regular text-ui-fg-subtle" data-testid="no-orders-message">
                  Aún no tienes pedidos recientes.
                </p>
              </li>
            )}
          </ul>
        </article>
      </div>

      <footer className="border-t border-ui-border-base pt-4">
        <a
          href="/api/auth/logout"
          className="inline-flex items-center text-small-regular text-ui-fg-subtle underline hover:text-ui-fg-base"
          data-testid="logout-button"
        >
          Cerrar sesión
        </a>
      </footer>
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

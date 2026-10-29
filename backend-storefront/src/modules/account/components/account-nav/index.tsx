"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { customerFirstNameOrFallback } from "@lib/util/customer-display"

const logoutHref = "/api/auth/logout"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== "/account" ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 py-2 text-sm font-medium text-brand-accent"
            data-testid="account-main-link"
          >
            <ChevronDown className="rotate-90 transform" />
            <span>Mi cuenta</span>
          </LocalizedClientLink>
        ) : (
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-brand-bg/40">
              <li>
                <LocalizedClientLink
                  href="/account/profile"
                  className="flex items-center justify-between px-4 py-3.5 text-sm text-brand-text"
                  data-testid="profile-link"
                >
                  <div className="flex items-center gap-x-2">
                    <User size={20} />
                    <span>Perfil</span>
                  </div>
                  <ChevronDown className="-rotate-90 transform" />
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/addresses"
                  className="flex items-center justify-between px-4 py-3.5 text-sm text-brand-text"
                  data-testid="addresses-link"
                >
                  <div className="flex items-center gap-x-2">
                    <MapPin size={20} />
                    <span>Direcciones</span>
                  </div>
                  <ChevronDown className="-rotate-90 transform" />
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/account/orders"
                  className="flex items-center justify-between px-4 py-3.5 text-sm text-brand-text"
                  data-testid="orders-link"
                >
                  <div className="flex items-center gap-x-2">
                    <Package size={20} />
                    <span>Pedidos</span>
                  </div>
                  <ChevronDown className="-rotate-90 transform" />
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href={logoutHref}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-sm text-brand-text"
                  data-testid="logout-button"
                >
                  <div className="flex items-center gap-x-2">
                    <ArrowRightOnRectangle />
                    <span>Cerrar sesión</span>
                  </div>
                  <ChevronDown className="-rotate-90 transform" />
                </a>
              </li>
            </ul>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div className="pb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-text/60">
            Mi cuenta
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-text">
            {customerFirstNameOrFallback(customer?.first_name)}
          </p>
        </div>
        <ul className="flex flex-col gap-y-1">
          <li>
            <AccountNavLink
              href="/account"
              route={route!}
              data-testid="overview-link"
            >
              Resumen
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/profile"
              route={route!}
              data-testid="profile-link"
            >
              Perfil
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/addresses"
              route={route!}
              data-testid="addresses-link"
            >
              Direcciones
            </AccountNavLink>
          </li>
          <li>
            <AccountNavLink
              href="/account/orders"
              route={route!}
              data-testid="orders-link"
            >
              Pedidos
            </AccountNavLink>
          </li>
          <li className="mt-3 border-t border-gray-200 pt-3">
            <a
              href={logoutHref}
              className="text-sm text-brand-text/70 transition-colors hover:text-brand-accent"
              data-testid="logout-button"
            >
              Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const active = route === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "block rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-brand-accent/10 font-semibold text-brand-accent"
          : "text-brand-text/80 hover:bg-brand-section/50 hover:text-brand-text"
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav

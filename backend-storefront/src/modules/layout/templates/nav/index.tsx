import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const desktopNavLinks = [
  { label: "Juegos de Mesa", href: "/store" },
  { label: "Didácticos", href: "/store" },
  { label: "Ofertas", href: "/store" },
]

export default function Nav() {
  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full bg-brand-bg border-b border-grey-20">
      <nav
        className="content-container flex h-16 w-full items-center justify-between px-4 md:px-6"
        aria-label="Navegación principal"
      >
        {/* Móvil: menú hamburguesa (izquierda) */}
        <div className="flex flex-1 items-center justify-start md:hidden">
          <SideMenu />
        </div>

        {/* Escritorio: logo + enlaces inline */}
        <div className="hidden md:flex flex-1 items-center gap-x-8">
          <LocalizedClientLink
            href="/"
            className="text-brand-primary font-bold text-xl shrink-0"
            data-testid="nav-store-link"
          >
            Jugando Toy
          </LocalizedClientLink>

          <ul className="flex items-center gap-x-6">
            {desktopNavLinks.map(({ label, href }) => (
              <li key={label}>
                <LocalizedClientLink
                  href={href}
                  className="text-brand-text text-sm font-medium transition-colors hover:text-brand-primary"
                >
                  {label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Móvil: logo centrado */}
        <div className="flex flex-1 items-center justify-center md:hidden">
          <LocalizedClientLink
            href="/"
            className="text-brand-primary font-bold text-xl"
            data-testid="nav-store-link-mobile"
          >
            Jugando Toy
          </LocalizedClientLink>
        </div>

        {/* Derecha: cuenta (escritorio) + carrito */}
        <div className="flex flex-1 items-center justify-end gap-x-4 md:gap-x-6">
          <div className="hidden md:flex items-center">
            <LocalizedClientLink
              className="text-brand-text text-sm font-medium transition-colors hover:text-brand-primary"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
          </div>

          <Suspense
            fallback={
              <LocalizedClientLink
                className="relative flex items-center justify-center p-2 text-brand-text transition-colors hover:text-brand-primary"
                href="/cart"
                data-testid="nav-cart-link"
                aria-label="Carrito (0 artículos)"
              >
                <span className="text-sm font-medium">Cart (0)</span>
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </header>
  )
}

import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const desktopNavLinks = [
  { label: "Juegos de Mesa", href: "/store" },
  { label: "Didácticos", href: "/store" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Blog", href: "/blog" },
]

export default function Nav() {
  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full border-b border-brand-accent bg-brand-bg">
      <nav
        className="content-container grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-x-2 px-4 md:gap-x-4 md:px-6"
        aria-label="Navegación principal"
      >
        {/* Izquierda: menú móvil / logo escritorio */}
        <div className="flex min-w-0 items-center justify-start">
          <div className="small:hidden">
            <SideMenu />
          </div>
          <LocalizedClientLink
            href="/"
            className="hidden shrink-0 text-xl font-bold text-brand-accent small:inline-block"
            data-testid="nav-store-link"
          >
            Jugando Toy
          </LocalizedClientLink>
        </div>

        {/* Centro: logo móvil / enlaces escritorio */}
        <div className="flex min-w-0 items-center justify-center">
          <LocalizedClientLink
            href="/"
            className="text-xl font-bold text-brand-accent small:hidden"
            data-testid="nav-store-link-mobile"
          >
            Jugando Toy
          </LocalizedClientLink>

          <ul className="hidden flex-wrap items-center justify-center gap-x-4 gap-y-1 small:flex lg:gap-x-6">
            {desktopNavLinks.map(({ label, href }) => (
              <li key={label} className="shrink-0">
                <LocalizedClientLink
                  href={href}
                  className="inline-flex min-h-[44px] items-center text-sm font-medium text-brand-text transition-colors hover:text-brand-accent"
                  data-testid={
                    href === "/blog" ? "nav-blog-link" : undefined
                  }
                >
                  {label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Derecha: cuenta + carrito */}
        <div className="flex shrink-0 items-center justify-end gap-x-4 small:gap-x-6">
          <div className="hidden items-center small:flex">
            <LocalizedClientLink
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-text transition-colors hover:text-brand-accent"
              href="/account"
              data-testid="nav-account-link"
            >
              <User className="h-5 w-5 shrink-0" aria-hidden="true" />
              Mi cuenta
            </LocalizedClientLink>
          </div>

          <Suspense
            fallback={
              <LocalizedClientLink
                className="relative flex min-h-[44px] items-center justify-center p-2 text-brand-text transition-colors hover:text-brand-accent"
                href="/cart"
                data-testid="nav-cart-link"
                aria-label="Carrito (0 artículos)"
              >
                <span className="text-sm font-medium">Carrito (0)</span>
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

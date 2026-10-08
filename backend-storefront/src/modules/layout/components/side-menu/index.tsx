"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { BarsThree, XMark } from "@medusajs/icons"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"

const sideMenuItems = [
  { label: "Inicio", href: "/", testId: "home-link" },
  { label: "Tienda", href: "/store", testId: "store-link" },
  { label: "Blog", href: "/blog", testId: "blog-link" },
  { label: "Carrito", href: "/cart", testId: "cart-link" },
] as const

const SideMenu = () => {
  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label="Abrir menú de navegación"
                  aria-expanded={open}
                  className="relative inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-brand-text transition-colors duration-200 hover:text-brand-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <BarsThree className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">Menú</span>
                </Popover.Button>
              </div>

              <Transition show={open} as={Fragment}>
                <Transition.Child
                  as="div"
                  enter="transition-opacity ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  className="fixed inset-0 z-[50] bg-black/30"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                  aria-hidden="true"
                />

                <Transition.Child
                  as="div"
                  enter="transition-transform ease-out duration-300"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition-transform ease-in duration-250"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                  className="fixed inset-y-0 left-0 z-[51] h-dvh w-[min(20rem,85vw)] shadow-xl small:hidden"
                >
                  <PopoverPanel static className="flex h-full flex-col text-brand-text">
                    <div
                      data-testid="nav-menu-popup"
                      className="flex h-full flex-col justify-between border-r border-grey-20 bg-brand-bg"
                    >
                      <div
                        className="flex w-full items-center justify-between gap-3 border-b border-grey-20 bg-brand-section px-5 py-4"
                        id="xmark"
                      >
                        <LocalizedClientLink
                          href="/account"
                          data-testid="account-link"
                          onClick={close}
                          className="inline-flex min-h-[44px] items-center gap-2 text-2xl font-medium leading-tight text-brand-text transition-colors hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                        >
                          <User
                            className="h-7 w-7 shrink-0"
                            size="28"
                            aria-hidden="true"
                          />
                          Mi cuenta
                        </LocalizedClientLink>
                        <button
                          type="button"
                          data-testid="close-menu-button"
                          onClick={close}
                          aria-label="Cerrar menú"
                          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md p-2 text-brand-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                        >
                          <XMark className="h-7 w-7" aria-hidden="true" />
                        </button>
                      </div>

                      <nav
                        aria-label="Menú principal"
                        className="flex-1 px-6 py-4"
                      >
                        <ul className="flex flex-col items-start gap-1">
                          {sideMenuItems.map(({ label, href, testId }) => (
                            <li key={href} className="w-full">
                              <LocalizedClientLink
                                href={href}
                                className="flex min-h-[44px] w-full items-center py-3 text-2xl font-medium leading-tight text-brand-text transition-colors hover:text-brand-accent"
                                onClick={close}
                                data-testid={testId}
                              >
                                {label}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      <div className="border-t border-grey-20 px-6 pb-6 pt-6">
                        <p className="text-left text-sm text-brand-text/80">
                          © {new Date().getFullYear()} Jugando Toy. Todos los
                          derechos reservados.
                        </p>
                      </div>
                    </div>
                  </PopoverPanel>
                </Transition.Child>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { useCartUI } from "@lib/context/cart-ui-context"
import ShoppingCart from "@modules/common/icons/shopping-cart"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()
  const { registerCartHandlers } = useCartUI()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }

    itemRef.current = totalItems
  }, [totalItems, pathname])

  useEffect(() => {
    return registerCartHandlers(
      () => {
        setActiveTimer((timer) => {
          if (timer) {
            clearTimeout(timer)
          }

          return undefined
        })
        setCartDropdownOpen(true)
      },
      () => setCartDropdownOpen(false)
    )
  }, [registerCartHandlers])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="relative flex items-center justify-center p-2 text-brand-text transition-colors hover:text-brand-accent">
          <LocalizedClientLink
            className="relative flex items-center justify-center"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Carrito (${totalItems} artículos)`}
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-secondary px-1 text-[10px] font-bold leading-none text-brand-text"
                aria-hidden="true"
              >
                {totalItems}
              </span>
            )}
            <span className="sr-only">{`Carrito (${totalItems} artículos)`}</span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as="div"
          className="max-small:fixed max-small:inset-0 max-small:z-[100] small:absolute small:right-0 small:top-full small:z-[100] small:w-[min(100vw-2rem,400px)] small:origin-top-right small:pt-2"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-[0.97] -translate-y-0.5"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-[0.97] -translate-y-0.5"
        >
          <div
            className="fixed inset-0 z-[90] bg-black/40 small:hidden"
            aria-hidden="true"
            onClick={close}
          />
          <PopoverPanel
            static
            className="relative w-full max-small:fixed max-small:inset-x-0 max-small:bottom-0 max-small:top-auto max-small:flex max-small:max-h-[85vh] max-small:w-full max-small:flex-col"
            data-testid="nav-cart-dropdown"
          >
            <div
              className="pointer-events-none absolute right-[14px] top-1 z-[102] hidden h-3 w-3 rotate-45 border border-brand-accent/25 border-b-0 border-r-0 bg-brand-bg shadow-[0_2px_6px_rgba(74,74,74,0.08)] small:block"
              aria-hidden="true"
            />
            <div className="relative flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl border border-brand-accent/25 bg-brand-bg text-brand-text shadow-[0_12px_40px_rgba(74,74,74,0.14)] small:-mt-[7px] max-small:max-h-[85vh] max-small:flex-1 max-small:rounded-t-2xl max-small:rounded-b-none max-small:border-x-0 max-small:border-b-0 max-small:shadow-2xl max-small:mt-0">
              <div className="flex shrink-0 items-center justify-between border-b border-brand-accent/20 bg-brand-section/60 px-5 py-3.5">
                <h3 className="text-base font-bold text-brand-accent">
                  Tu carrito
                  {totalItems > 0 && (
                    <span className="ml-1.5 font-semibold text-brand-text/70">
                      ({totalItems})
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="text-sm font-medium text-brand-text transition-colors hover:text-brand-accent small:hidden"
                  aria-label="Cerrar carrito"
                >
                  Cerrar
                </button>
              </div>
              {cartState && cartState.items?.length ? (
                <>
                  <div className="grid max-h-[360px] flex-1 grid-cols-1 gap-y-0 overflow-y-auto px-4 py-2 no-scrollbar max-small:max-h-none">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[96px_1fr] gap-x-3 border-b border-brand-section py-4 last:border-b-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-sm font-medium overflow-hidden text-ellipsis text-brand-text">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="transition-colors hover:text-brand-accent"
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Cantidad: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Quitar
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="sticky bottom-0 z-[100] flex shrink-0 flex-col gap-y-3 border-t border-brand-accent/20 bg-brand-section/50 p-4 pb-5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-brand-text">
                      Subtotal
                    </span>
                    <span
                      className="text-base font-bold text-gray-900"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    passHref
                    onClick={close}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-accent/90"
                    data-testid="go-to-cart-button"
                  >
                    Ver carrito completo
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col px-5 pb-6 pt-2">
                <div className="flex flex-col items-center justify-center gap-y-3 py-10 text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/35 text-brand-text"
                    aria-hidden="true"
                  >
                    <ShoppingCart className="h-7 w-7" />
                  </div>
                  <p className="text-sm leading-relaxed text-brand-text">
                    Aún no has agregado juguetes.
                    <br />
                    <span className="text-brand-text/70">
                      ¡Hay mucho por descubrir!
                    </span>
                  </p>
                  <LocalizedClientLink
                    href="/store"
                    onClick={close}
                    className="mt-1 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-accent/90"
                  >
                    Explorar productos
                  </LocalizedClientLink>
                </div>
              </div>
            )}
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown

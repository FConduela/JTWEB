"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { useCartUI } from "@lib/context/cart-ui-context"
import { ShoppingBag } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
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
        <PopoverButton className="relative flex items-center justify-center p-2 text-brand-text transition-colors hover:text-brand-primary">
          <LocalizedClientLink
            className="relative flex items-center justify-center"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Carrito (${totalItems} artículos)`}
          >
            <ShoppingBag className="h-6 w-6" />
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
          className="max-small:fixed max-small:inset-0 max-small:z-[100] small:contents"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div
            className="fixed inset-0 z-[90] bg-black/40 small:hidden"
            aria-hidden="true"
            onClick={close}
          />
          <PopoverPanel
            static
            className="absolute top-[calc(100%+1px)] right-0 z-[100] w-[420px] border-x border-b border-gray-200 bg-white text-ui-fg-base max-small:fixed max-small:inset-x-0 max-small:bottom-0 max-small:top-auto max-small:flex max-small:max-h-[85vh] max-small:w-full max-small:flex-col max-small:overflow-hidden max-small:rounded-t-2xl max-small:shadow-2xl"
            data-testid="nav-cart-dropdown"
          >
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
                <h3 className="text-large-semi">Carrito</h3>
                <button
                  type="button"
                  onClick={close}
                  className="text-sm font-medium text-brand-text transition-colors hover:text-brand-primary small:hidden"
                  aria-label="Cerrar carrito"
                >
                  Cerrar
                </button>
              </div>
              {cartState && cartState.items?.length ? (
                <>
                  <div className="grid max-h-[402px] flex-1 grid-cols-1 gap-y-8 overflow-y-auto px-4 py-4 no-scrollbar max-small:max-h-none">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
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
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
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
                                  Quantity: {item.quantity}
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
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="sticky bottom-0 z-[100] flex shrink-0 flex-col gap-y-4 border-t border-gray-200 bg-white p-4 pb-6 text-small-regular shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ui-fg-base">
                      Subtotal{" "}
                      <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref onClick={close}>
                    <Button
                      className="h-12 w-full !border-none !bg-brand-secondary !text-brand-text !shadow-none transition-colors hover:!bg-brand-primary hover:!text-white"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Ir al Carrito
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col items-center justify-center gap-y-4 py-16">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-small-regular text-white">
                    <span>0</span>
                  </div>
                  <span>Tu carrito está vacío.</span>
                  <LocalizedClientLink href="/store" onClick={close}>
                    <Button onClick={close}>Explorar productos</Button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown

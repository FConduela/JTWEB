"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Divider from "@modules/common/components/divider"
import ChevronDown from "@modules/common/icons/chevron-down"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-brand-card">
      <LocalizedClientLink
        href="/cart"
        className="mb-4 inline-flex items-center gap-x-2 text-sm font-medium text-brand-text transition-colors hover:text-brand-accent"
        data-testid="back-to-cart-link"
      >
        <ChevronDown className="rotate-90" size={16} aria-hidden />
        <span className="hidden small:inline">Volver al carrito</span>
        <span className="small:hidden">Volver</span>
      </LocalizedClientLink>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="flex flex-row items-baseline gap-x-2 text-2xl font-bold text-brand-text md:text-3xl"
        >
          Dirección de envío
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="font-medium text-brand-accent hover:underline"
              data-testid="edit-address-button"
            >
              Editar
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="gap-x-4 pb-6 pt-8 text-xl font-semibold text-brand-text"
                >
                  Dirección de facturación
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6" data-testid="submit-address-button">
              Continuar al envío
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex w-full items-start gap-x-1">
                  <div
                    className="flex w-1/3 flex-col"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus mb-1 font-semibold text-brand-text">
                      Dirección de envío
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex w-1/3 flex-col"
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus mb-1 font-semibold text-brand-text">
                      Contacto
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-brand-text/70">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex w-1/3 flex-col"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus mb-1 font-semibold text-brand-text">
                      Facturación
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-brand-text/70">
                        Misma dirección que el envío.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-brand-text/70">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-brand-text/70">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-brand-text/70">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-brand-text/70">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses

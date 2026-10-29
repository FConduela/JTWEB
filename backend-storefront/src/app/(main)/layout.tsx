import { Metadata } from "next"

import {
  listCartOptions,
  retrieveCart,
  retrieveFreshCart,
} from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getNavAccountLabel } from "@lib/util/customer-display"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CookieBanner from "@modules/layout/components/cookie-banner"
import CartUIProviderWrapper from "@modules/layout/components/cart-ui-provider"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()

  const cart = customer
    ? await retrieveFreshCart()
    : await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <CartUIProviderWrapper>
      <Nav accountLabel={getNavAccountLabel(customer)} isLoggedIn={!!customer} />
      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
      <CookieBanner />
    </CartUIProviderWrapper>
  )
}

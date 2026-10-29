import ItemsTemplate from "./items"
import Summary from "./summary"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const hasItems = (cart?.items?.length ?? 0) > 0

  return (
    <div className="py-6 md:py-10">
      <div className="content-container" data-testid="cart-container">
        <h1 className="mb-5 text-xl font-bold text-brand-accent md:text-2xl">
          Tu carrito
        </h1>
        <div className="grid grid-cols-1 gap-8 small:grid-cols-[1fr_280px] small:gap-x-8 lg:gap-x-10">
          <div className="flex flex-col gap-y-6 rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
            {!customer && (
              <>
                <SignInPrompt />
                <Divider />
              </>
            )}
            <ItemsTemplate cart={cart} />
          </div>
          <div className="relative">
            <div className="sticky top-24 flex flex-col gap-y-8">
              {cart && cart.region && (
                <div className="rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
                  <Summary cart={cart as any} checkoutDisabled={!hasItems} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTemplate

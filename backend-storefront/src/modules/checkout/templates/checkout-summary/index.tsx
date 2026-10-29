import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse gap-y-8 py-8 small:flex-col small:py-0">
      <div className="flex w-full flex-col rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
        <Divider className="my-6 small:hidden" />
        <h2 className="text-lg font-bold text-brand-accent md:text-xl">
          Resumen del pedido
        </h2>
        <Divider className="my-6" />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
        <CartTotals totals={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary

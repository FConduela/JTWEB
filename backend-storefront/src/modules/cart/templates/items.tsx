import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart | null
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const hasItems = (items?.length ?? 0) > 0

  return (
    <div>
      <div className="flex items-center pb-3">
        <h2 className="text-lg font-semibold text-brand-text md:text-xl">
          Productos
        </h2>
      </div>
      {hasItems ? (
        <>
          <div className="hidden border-b border-gray-200 pb-2 text-sm font-medium text-brand-text/70 sm:grid sm:grid-cols-[5rem_minmax(0,1fr)_1fr] sm:gap-4">
            <span className="col-span-2 sm:col-span-1 sm:col-start-2">
              Producto
            </span>
            <span className="text-right">Precio / Total</span>
          </div>
          <ul
            className="list-none border-t border-gray-200"
            data-testid="products-list"
          >
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "")
                      ? -1
                      : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency_code}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </ul>
        </>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  )
}

export default ItemsTemplate

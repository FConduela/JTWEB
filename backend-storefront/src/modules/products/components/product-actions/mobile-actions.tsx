import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo } from "react"
import { Transition } from "@headlessui/react"

import { getProductPrice } from "@lib/util/get-product-price"
import { getStorefrontProductOptions } from "@lib/util/product-options"
import { isSimpleProduct } from "@lib/util/product"
import OptionSelect from "./option-select"
import QuantitySelect from "./quantity-select"
import { HttpTypes } from "@medusajs/types"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  quantity: number
  onQuantityChange: (value: number) => void
  maxQuantity: number
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  quantity,
  onQuantityChange,
  maxQuantity,
}) => {
  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)
  const storefrontOptions = getStorefrontProductOptions(product.options)
  const showOptionSelectors =
    !isSimple && (product.variants?.length ?? 0) > 1 && storefrontOptions.length

  return (
    <div
      className={clx("fixed inset-x-0 bottom-0 z-40 lg:hidden", {
        "pointer-events-none": !show,
      })}
    >
      <Transition
        as={Fragment}
        show={show}
        enter="ease-in-out duration-300"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <div
          className="max-h-[min(70vh,520px)] w-full overflow-y-auto border-t border-gray-300 bg-brand-card p-4 shadow-[0_-4px_20px_rgba(74,74,74,0.12)]"
          data-testid="mobile-actions"
        >
          <div className="mb-3 flex min-w-0 items-center gap-x-2 text-sm text-brand-text">
            <span className="truncate font-medium" data-testid="mobile-title">
              {product.title}
            </span>
            <span className="shrink-0 text-brand-text/50">—</span>
            {selectedPrice ? (
              <div className="flex shrink-0 items-end gap-x-1.5 text-brand-text">
                {selectedPrice.price_type === "sale" && (
                  <span className="text-xs line-through text-brand-text/50">
                    {selectedPrice.original_price}
                  </span>
                )}
                <span
                  className={clx("text-sm font-semibold", {
                    "text-brand-accent": selectedPrice.price_type === "sale",
                  })}
                >
                  {selectedPrice.calculated_price}
                </span>
              </div>
            ) : null}
          </div>

          {showOptionSelectors && (
            <div className="mb-3 flex flex-col gap-y-3 border-b border-gray-200/90 pb-3">
              {storefrontOptions.map((option) => (
                <OptionSelect
                  key={option.id}
                  option={option}
                  variants={product.variants}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title ?? ""}
                  disabled={optionsDisabled}
                  data-testid="product-options"
                />
              ))}
            </div>
          )}

          <div className="flex w-full items-center gap-3">
            <QuantitySelect
              value={quantity}
              onChange={onQuantityChange}
              max={maxQuantity}
              disabled={optionsDisabled || !inStock || !variant}
            />
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant || optionsDisabled}
              className="h-11 min-w-0 flex-1 !border-none !bg-brand-accent !text-white !shadow-none transition-colors hover:!bg-brand-accent/90 focus-visible:!ring-brand-accent"
              isLoading={isAdding}
              data-testid="mobile-cart-button"
            >
              {!variant
                ? "Seleccionar variante"
                : !inStock
                  ? "Sin stock"
                  : "Agregar al carrito"}
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default MobileActions

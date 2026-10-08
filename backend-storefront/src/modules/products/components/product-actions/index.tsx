"use client"

import { addToCart } from "@lib/data/cart"
import { useCartUI } from "@lib/context/cart-ui-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { trackAddToCart, trackViewItem } from "@lib/tracking"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import ProductInfo from "@modules/products/templates/product-info"
import MobileActions from "./mobile-actions"
import QuantitySelect from "./quantity-select"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const getVariantPrice = (variant?: HttpTypes.StoreProductVariant) => {
  const amount = variant?.calculated_price?.calculated_amount

  return amount !== undefined && amount !== null ? Number(amount) : undefined
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = DEFAULT_COUNTRY_CODE
  const { openCart } = useCartUI()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  useEffect(() => {
    const variant = product.variants?.[0]
    trackViewItem({
      id: product.id,
      title: product.title ?? "",
      price: getVariantPrice(variant),
    })
  }, [product.id, product.title, product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const maxQuantity = useMemo(() => {
    if (!selectedVariant) {
      return 1
    }

    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) {
      return 99
    }

    return Math.max(1, selectedVariant.inventory_quantity ?? 1)
  }, [selectedVariant])

  useEffect(() => {
    setQuantity(1)
  }, [selectedVariant?.id])

  useEffect(() => {
    setQuantity((current) => Math.min(Math.max(1, current), maxQuantity))
  }, [maxQuantity])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      trackAddToCart(
        {
          id: product.id,
          title: product.title ?? "",
          price: getVariantPrice(selectedVariant),
        },
        quantity
      )

      router.refresh()
      openCart()
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-6 lg:h-full" ref={actionsRef}>
        <div className="flex flex-col gap-y-3">
          <ProductInfo product={product} />
          <Divider className="mt-0 !border-gray-400" />
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        <div className="flex flex-col gap-y-4 lg:mt-auto">
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
          <QuantitySelect
            value={quantity}
            onChange={setQuantity}
            max={maxQuantity}
            disabled={
              !!disabled ||
              isAdding ||
              !selectedVariant ||
              !inStock ||
              !isValidVariant
            }
          />
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="h-11 min-w-[10rem] flex-1 !border-none !bg-brand-accent !text-white !shadow-none transition-colors hover:!bg-brand-accent/90 focus-visible:!ring-brand-accent"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options
              ? "Seleccionar variante"
              : !inStock || !isValidVariant
              ? "Sin stock"
              : "Agregar al carrito"}
          </Button>
          </div>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={maxQuantity}
        />
      </div>
    </>
  )
}

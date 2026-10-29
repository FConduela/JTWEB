"use client"

import { Table, Text } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { formatStorefrontError } from "@lib/util/storefront-error"
import { HttpTypes } from "@medusajs/types"
import CartItemQuantity from "@modules/cart/components/cart-item-quantity"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (quantity === item.quantity) {
      return
    }

    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .then(() => {
        router.refresh()
      })
      .catch((err) => {
        setError(formatStorefrontError(err))
        router.refresh()
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory
  const quantityLimit = Math.min(10, Math.max(maxQuantity, item.quantity))

  if (type === "preview") {
    return (
      <Table.Row className="w-full" data-testid="product-row">
        <Table.Cell className="!pl-0 p-4 w-24">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex w-16"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left">
          <Text
            className="txt-medium-plus font-medium text-brand-text"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </Table.Cell>

        <Table.Cell className="!pr-0">
          <span className="flex h-full flex-col items-end justify-center !pr-0">
            <span className="flex gap-x-1">
              <Text className="text-brand-text/60">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <li
      className="border-b border-gray-200 py-4 last:border-b-0"
      data-testid="product-row"
    >
      <div className="flex gap-3 sm:gap-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="shrink-0"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="h-16 w-16 sm:h-20 sm:w-20"
          />
        </LocalizedClientLink>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Text
                className="txt-medium-plus font-medium text-brand-text"
                data-testid="product-title"
              >
                {item.product_title}
              </Text>
              <LineItemOptions
                variant={item.variant}
                data-testid="product-variant"
              />
            </div>
            <div className="shrink-0 text-right sm:hidden">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <CartItemQuantity
                value={item.quantity}
                max={quantityLimit}
                disabled={updating}
                onChange={changeQuantity}
              />
              <DeleteButton id={item.id} data-testid="product-delete-button">
                Quitar
              </DeleteButton>
            </div>
            <div className="hidden items-baseline gap-4 sm:flex">
              <span className="text-sm text-brand-text/70">
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </span>
              <span className="font-semibold text-brand-text">
                <LineItemPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </span>
            </div>
          </div>

          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      </div>
    </li>
  )
}

export default Item

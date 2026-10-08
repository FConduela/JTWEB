import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  variant = "plain",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  variant?: "plain" | "card"
}) {
  const isCard = variant === "card"
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const imageUrl = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className={`group flex w-full flex-col ${
        isCard
          ? "h-full overflow-hidden rounded-2xl border border-gray-200/90 bg-brand-card shadow-[0_2px_10px_rgba(74,74,74,0.1)] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(74,74,74,0.22)]"
          : ""
      }`}
      data-testid="product-wrapper"
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden ${
          isCard ? "rounded-none bg-brand-card" : "rounded-lg bg-brand-bg"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={50}
            loading={isFeatured ? "lazy" : undefined}
            draggable={false}
            className="object-cover object-center transition-transform duration-300 md:group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlaceholderImage size={24} />
          </div>
        )}
      </div>

      <div
        className={`flex flex-col gap-1 ${
          isCard ? "flex-1 bg-brand-card p-4 pt-3" : "mt-4"
        }`}
      >
        <h3
          className="text-base font-medium text-brand-text"
          data-testid="product-title"
        >
          {product.title}
        </h3>

        {cheapestPrice && (
          <div className="flex items-center gap-x-2">
            <PreviewPrice price={cheapestPrice} />
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}

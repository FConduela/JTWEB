import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  headingLevel = "h3",
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  headingLevel?: "h3" | "h4"
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  const HeadingTag = headingLevel

  return (
    <div className="content-container py-8 md:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <HeadingTag className="text-xl font-bold text-brand-text md:text-2xl">
          {collection.title}
        </HeadingTag>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="inline-flex min-h-11 items-center text-ui-fg-interactive hover:underline"
        >
          Ver todos
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}

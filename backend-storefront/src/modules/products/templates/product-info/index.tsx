import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h1
          className="mb-4 text-3xl font-bold text-brand-text md:text-4xl"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <p
          className="whitespace-pre-line text-medium text-brand-text/80"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo

import { HttpTypes } from "@medusajs/types"

type ProductDescriptionProps = {
  product: HttpTypes.StoreProduct
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  if (!product.description?.trim()) {
    return null
  }

  return (
    <section
      className="w-full"
      aria-labelledby="product-description-heading"
    >
      <h2
        id="product-description-heading"
        className="mb-4 text-lg font-semibold text-brand-text md:text-xl"
      >
        Detalles del producto
      </h2>
      <p
        className="whitespace-pre-line text-base leading-relaxed text-brand-text/80 md:text-medium"
        data-testid="product-description"
      >
        {product.description}
      </p>
    </section>
  )
}

export default ProductDescription

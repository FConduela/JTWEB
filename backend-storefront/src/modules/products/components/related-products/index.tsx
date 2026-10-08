import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <section
      className="product-page-constraint"
      aria-labelledby="related-products-heading"
    >
      <header className="mb-8 flex flex-col items-center text-center md:mb-16">
        <h2
          id="related-products-heading"
          className="max-w-lg text-xl font-semibold text-ui-fg-base md:text-2xl"
        >
          Productos relacionados
        </h2>
        <p className="mt-3 max-w-lg text-base text-gray-600">
          También te pueden interesar estos productos.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-3 small:gap-x-6 medium:grid-cols-4">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id}>
            <Product region={region} product={relatedProduct} />
          </li>
        ))}
      </ul>
    </section>
  )
}

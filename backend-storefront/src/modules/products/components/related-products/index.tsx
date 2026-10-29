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
      className="border-t border-gray-300 bg-brand-card pb-8 pt-5 md:pb-10 md:pt-6"
      aria-labelledby="related-products-heading"
    >
      <div className="content-container product-page-constraint">
      <header className="mb-4 md:mb-5">
        <h2
          id="related-products-heading"
          className="text-center text-sm font-semibold text-brand-text md:text-base"
        >
          Productos relacionados
        </h2>
      </header>

      <ul className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
        {products.map((relatedProduct) => (
          <li key={relatedProduct.id} className="min-w-0">
            <Product
              region={region}
              product={relatedProduct}
              variant="compact"
            />
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}

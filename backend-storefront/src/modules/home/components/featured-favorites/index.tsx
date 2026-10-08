import { listProducts } from "@lib/data/products"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

type HomeFeaturedFavoritesProps = {
  region: HttpTypes.StoreRegion
  collectionId?: string
}

export default async function HomeFeaturedFavorites({
  region,
  collectionId,
}: HomeFeaturedFavoritesProps) {
  const queryParams: Record<string, unknown> = {
    limit: 8,
    fields: "*variants.calculated_price",
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode: DEFAULT_COUNTRY_CODE,
    regionId: region.id,
    queryParams,
  })

  return (
    <section
      aria-labelledby="home-favorites-heading"
      className="bg-brand-section py-12 md:py-16"
    >
      <div className="content-container px-4">
        <h2
          id="home-favorites-heading"
          className="mb-8 text-2xl font-bold text-brand-accent md:mb-10 md:text-3xl"
        >
          Nuestros Favoritos
        </h2>

        {products.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-brand-text/70">
            Pronto verás aquí nuestros productos destacados.
          </p>
        )}
      </div>
    </section>
  )
}

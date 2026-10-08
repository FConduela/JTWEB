import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  if (!collections.length) {
    return null
  }

  const [primaryCollection, ...otherCollections] = collections

  return (
    <>
      <section aria-labelledby="home-featured-heading">
        <div className="content-container pt-10 md:pt-12">
          <h2
            id="home-featured-heading"
            className="text-2xl font-bold text-brand-text md:text-3xl"
          >
            Destacados
          </h2>
        </div>
        <ProductRail collection={primaryCollection} region={region} />
      </section>

      {otherCollections.length > 0 ? (
        <section aria-labelledby="home-collections-heading">
          <div className="content-container pt-4 md:pt-8">
            <h2
              id="home-collections-heading"
              className="text-2xl font-bold text-brand-text md:text-3xl"
            >
              Colecciones
            </h2>
          </div>
          {otherCollections.map((collection) => (
            <ProductRail
              key={collection.id}
              collection={collection}
              region={region}
            />
          ))}
        </section>
      ) : null}

      <section
        aria-labelledby="home-explore-collections-heading"
        className="content-container border-t border-gray-200 py-10 md:py-12"
      >
        <h2
          id="home-explore-collections-heading"
          className="mb-6 text-xl font-semibold text-brand-text md:text-2xl"
        >
          Explora por colección
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <LocalizedClientLink
                href={`/collections/${collection.handle}`}
                className="inline-flex min-h-11 w-full items-center rounded-lg border border-gray-200 bg-brand-bg px-4 py-3 text-base font-medium text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {collection.title}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

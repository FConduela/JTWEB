import { Suspense } from "react"

import CatalogListingSeoSection from "@modules/store/components/catalog-listing-seo-section"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogSidebar from "@modules/store/components/refinement-list/catalog-sidebar"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const metadataRecord = collection.metadata as
    | Record<string, unknown>
    | undefined
  const extendedDescription =
    typeof metadataRecord?.seo_body === "string"
      ? metadataRecord.seo_body
      : null

  return (
    <main className="content-container py-6">
      <div className="flex flex-col small:flex-row small:items-stretch small:gap-8">
        <RefinementList>
          <h1
            className="mb-5 border-b border-gray-300 pb-4 text-lg font-bold leading-tight text-brand-accent md:text-xl"
            data-testid="collection-page-title"
          >
            {collection.title}
          </h1>
          <CatalogSidebar />
        </RefinementList>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <header className="mb-4 small:hidden">
            <h1 className="border-b border-gray-300 pb-3 text-xl font-bold text-brand-accent">
              {collection.title}
            </h1>
          </header>

          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
              showCatalogSeoSection={false}
            />
          </Suspense>

          <CatalogListingSeoSection
            title={collection.title}
            description={extendedDescription}
            entityLabel="colección"
          />
        </div>
      </div>
    </main>
  )
}

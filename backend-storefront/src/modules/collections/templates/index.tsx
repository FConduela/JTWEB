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
          <CatalogSidebar />
        </RefinementList>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <header className="mb-6 md:mb-8">
            <h1
              className="text-2xl font-semibold text-brand-text md:text-3xl"
              data-testid="collection-page-title"
            >
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

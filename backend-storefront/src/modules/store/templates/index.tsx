import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogSidebar from "@modules/store/components/refinement-list/catalog-sidebar"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col py-6 content-container small:flex-row small:items-stretch small:gap-8"
      data-testid="category-container"
    >
      <RefinementList>
        <CatalogSidebar />
      </RefinementList>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        <header>
          <h1
            className="text-3xl font-bold text-brand-accent"
            data-testid="store-page-title"
          >
            Nuestro Catálogo
          </h1>
        </header>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            showCatalogSeoSection={false}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate

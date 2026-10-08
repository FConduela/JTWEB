import { notFound } from "next/navigation"
import { Suspense } from "react"

import CatalogListingSeoSection from "@modules/store/components/catalog-listing-seo-section"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogSidebar from "@modules/store/components/refinement-list/catalog-sidebar"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (current: HttpTypes.StoreProductCategory) => {
    if (current.parent_category) {
      parents.push(current.parent_category)
      getParents(current.parent_category)
    }
  }

  getParents(category)

  const metadataRecord = category.metadata as Record<string, unknown> | undefined
  const extendedDescription =
    typeof metadataRecord?.seo_body === "string" ? metadataRecord.seo_body : null

  const reversedParents = [...parents].reverse()

  return (
    <main className="content-container py-6" data-testid="category-container">
      <div className="flex flex-col small:flex-row small:items-stretch small:gap-8">
        <RefinementList data-testid="sort-by-container">
          <CatalogSidebar />
        </RefinementList>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          {reversedParents.length > 0 && (
            <nav
              aria-label="Jerarquía de categoría"
              className="mb-4 flex flex-wrap items-center gap-1 text-sm text-ui-fg-subtle"
            >
              {reversedParents.map((parent, index) => (
                <span key={parent.id} className="flex items-center gap-1">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-brand-text/40">
                      /
                    </span>
                  )}
                  <LocalizedClientLink
                    className="inline-flex min-h-11 items-center text-brand-text/70 transition-colors hover:text-brand-primary"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                </span>
              ))}
            </nav>
          )}

          <header className="mb-6 md:mb-8">
            <h1
              className="text-2xl font-semibold text-brand-text md:text-3xl"
              data-testid="category-page-title"
            >
              {category.name}
            </h1>
            {category.description ? (
              <p className="mt-3 text-base text-brand-text/80">
                {category.description}
              </p>
            ) : null}
          </header>

          {category.category_children &&
          category.category_children.length > 0 ? (
            <section
              aria-labelledby="category-children-heading"
              className="mb-8"
            >
              <h2
                id="category-children-heading"
                className="mb-4 text-lg font-semibold text-brand-text md:text-xl"
              >
                Subcategorías
              </h2>
              <ul className="grid grid-cols-1 gap-2">
                {category.category_children.map((child) => (
                  <li key={child.id}>
                    <LocalizedClientLink
                      href={`/categories/${child.handle}`}
                      className="inline-flex min-h-11 w-full items-center text-base text-ui-fg-interactive hover:underline"
                    >
                      {child.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              showCatalogSeoSection={false}
            />
          </Suspense>

          <CatalogListingSeoSection
            title={category.name}
            description={extendedDescription}
            entityLabel="categoría"
          />
        </div>
      </div>
    </main>
  )
}

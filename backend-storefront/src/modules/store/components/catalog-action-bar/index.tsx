"use client"

import { Pagination } from "@modules/store/components/pagination"
import SortProducts from "@modules/store/components/refinement-list/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type CatalogActionBarProps = {
  sortBy: SortOptions
  page: number
  totalPages: number
}

export default function CatalogActionBar({
  sortBy,
  page,
  totalPages,
}: CatalogActionBarProps) {
  return (
    <div
      className="relative z-20 flex min-w-0 flex-col gap-4 overflow-visible rounded-lg border border-gray-200 bg-brand-card p-4 small:flex-row small:items-end small:justify-between"
      role="toolbar"
      aria-label="Ordenar y paginar productos"
    >
      <SortProducts sortBy={sortBy} data-testid="catalog-sort" />
      {totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          variant="inline"
          data-testid="product-pagination-top"
        />
      ) : null}
    </div>
  )
}

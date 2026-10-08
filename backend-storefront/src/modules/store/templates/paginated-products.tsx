import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import CatalogActionBar from "@modules/store/components/catalog-action-bar"
import CatalogSeoSection from "@modules/store/components/catalog-seo-section"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  showCatalogSeoSection = true,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  showCatalogSeoSection?: boolean
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <CatalogActionBar
        sortBy={sortBy ?? "created_at"}
        page={page}
        totalPages={totalPages}
      />
      <ul
        className="mt-4 grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id} className="h-full">
              <ProductPreview product={p} region={region} variant="card" />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          variant="footer"
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
      {showCatalogSeoSection ? <CatalogSeoSection /> : null}
    </>
  )
}

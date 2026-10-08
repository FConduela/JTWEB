import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"

export const metadata: Metadata = {
  title: "Catálogo de Juguetes Didácticos y de Madera | Jugando Toy",
  description:
    "Explora nuestra selección de juguetes Montessori, de madera y didácticos diseñados para el desarrollo y la diversión de tus niños.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <div className="bg-brand-bg">
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={DEFAULT_COUNTRY_CODE}
      />
    </div>
  )
}

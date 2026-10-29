"use client"

import { ReactNode } from "react"

type RefinementListProps = {
  children?: ReactNode
  "data-testid"?: string
}

/** Barra lateral del catálogo (categorías/filtros). El ordenamiento está en CatalogActionBar. */
const RefinementList = ({
  children,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  return (
    <aside
      className="mb-8 hidden w-full shrink-0 small:mb-0 small:block small:min-h-full small:w-[200px] small:min-w-[200px] small:max-w-[200px] small:self-stretch small:rounded-2xl small:border small:border-gray-200 small:bg-brand-card small:px-4 small:pb-8 small:pt-6 small:pr-5 lg:pr-6"
      aria-label="Filtros del catálogo"
      data-testid={dataTestId}
    >
      {children}
    </aside>
  )
}

export default RefinementList

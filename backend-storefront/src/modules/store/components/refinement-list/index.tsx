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
      className="mb-8 hidden w-full shrink-0 small:mb-0 small:block small:min-h-full small:min-w-[250px] small:max-w-[280px] small:self-stretch small:rounded-2xl small:border small:border-gray-200 small:bg-brand-card small:py-8 small:pl-6 small:pr-8 lg:pr-12"
      aria-label="Filtros del catálogo"
      data-testid={dataTestId}
    >
      {children}
    </aside>
  )
}

export default RefinementList

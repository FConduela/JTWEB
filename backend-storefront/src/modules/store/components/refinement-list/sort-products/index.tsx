"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Novedades" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
]

export function getSortLabel(value: SortOptions) {
  return sortOptions.find((option) => option.value === value)?.label ?? "Novedades"
}

type SortProductsProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const optionLinkClass = (isActive: boolean) =>
  isActive
    ? "block rounded-md bg-brand-bg px-3 py-2.5 text-sm font-bold text-brand-accent"
    : "block rounded-md px-3 py-2.5 text-sm text-brand-text transition-colors hover:bg-gray-50 hover:text-brand-accent"

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
}: SortProductsProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current
      if (!details?.open) {
        return
      }

      const target = event.target
      if (target instanceof Node && details.contains(target)) {
        return
      }

      details.open = false
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return
      }

      const details = detailsRef.current
      if (details?.open) {
        details.open = false
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const getSortHref = useCallback(
    (value: SortOptions) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("sortBy", value)
      params.delete("page")

      const query = params.toString()
      return query ? `${pathname}?${query}` : pathname
    },
    [pathname, searchParams]
  )

  const currentLabel = getSortLabel(sortBy)

  const optionLinks = sortOptions.map((option) => {
    const isActive = sortBy === option.value

    return (
      <li key={option.value}>
        <LocalizedClientLink
          href={getSortHref(option.value)}
          scroll={false}
          className={optionLinkClass(isActive)}
          aria-current={isActive ? "true" : undefined}
          data-testid="sort-option"
          data-active={isActive}
        >
          {option.label}
        </LocalizedClientLink>
      </li>
    )
  })

  return (
    <div
      className="w-full min-w-0 max-w-full small:w-auto"
      data-testid={dataTestId}
    >
      <nav
        aria-label="Opciones de ordenamiento"
        className="relative z-30 w-full overflow-visible small:w-auto small:min-w-[14rem] small:max-w-xs"
      >
        <p
          id="catalog-sort-label"
          className="mb-2 hidden text-sm font-bold text-brand-text small:block"
        >
          Ordenar por
        </p>
        <details
          ref={detailsRef}
          className="group relative z-30 w-full overflow-visible"
        >
          <summary
            aria-labelledby="catalog-sort-label"
            className="flex h-11 w-full cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-gray-200 bg-brand-card px-4 py-2 text-sm font-medium text-brand-text marker:content-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-accent [&::-webkit-details-marker]:hidden"
          >
            <span className="truncate">{currentLabel}</span>
            <span
              className="shrink-0 text-brand-text/60 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ▾
            </span>
          </summary>
          <ul className="absolute left-0 top-full z-[9999] mt-2 w-full min-w-[14rem] rounded-md border border-gray-200 bg-brand-card py-1 shadow-lg">
            {optionLinks}
          </ul>
        </details>
      </nav>
    </div>
  )
}

export default SortProducts

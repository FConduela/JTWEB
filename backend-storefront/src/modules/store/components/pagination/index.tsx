"use client"

import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  variant = "footer",
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  variant?: "footer" | "inline"
  "data-testid"?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const hrefForPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", targetPage.toString())
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const pageLinkClassName =
    "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm text-brand-text transition-colors hover:bg-brand-section hover:text-brand-accent"

  const renderPageLink = (
    targetPage: number,
    label: string | number,
    isCurrent: boolean
  ) => {
    if (isCurrent) {
      return (
        <span
          key={targetPage}
          aria-current="page"
          className={clx(
            pageLinkClassName,
            "rounded-full bg-brand-primary font-bold text-brand-text"
          )}
        >
          {label}
        </span>
      )
    }

    return (
      <LocalizedClientLink
        key={targetPage}
        href={hrefForPage(targetPage)}
        scroll={false}
        className={pageLinkClassName}
        aria-label={`Ir a la página ${targetPage}`}
      >
        {label}
      </LocalizedClientLink>
    )
  }

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="inline-flex min-h-9 min-w-9 items-center justify-center text-sm text-brand-text/50"
      aria-hidden="true"
    >
      …
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageLink(p, p, p === page)
        )
      )
    } else if (page <= 4) {
      buttons.push(
        ...arrayRange(1, 5).map((p) => renderPageLink(p, p, p === page))
      )
      buttons.push(renderEllipsis("ellipsis1"))
      buttons.push(
        renderPageLink(totalPages, totalPages, totalPages === page)
      )
    } else if (page >= totalPages - 3) {
      buttons.push(renderPageLink(1, 1, 1 === page))
      buttons.push(renderEllipsis("ellipsis2"))
      buttons.push(
        ...arrayRange(totalPages - 4, totalPages).map((p) =>
          renderPageLink(p, p, p === page)
        )
      )
    } else {
      buttons.push(renderPageLink(1, 1, 1 === page))
      buttons.push(renderEllipsis("ellipsis3"))
      buttons.push(
        ...arrayRange(page - 1, page + 1).map((p) =>
          renderPageLink(p, p, p === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis4"))
      buttons.push(
        renderPageLink(totalPages, totalPages, totalPages === page)
      )
    }

    return buttons
  }

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  const arrowClass =
    "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-sm font-medium transition-colors"

  return (
    <nav
      aria-label="Paginación de productos"
      className={clx(
        "flex w-full items-center",
        variant === "footer" ? "mt-12 justify-center" : "justify-center small:justify-end"
      )}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
        data-testid={dataTestid}
      >
        {prevDisabled ? (
          <span
            className={clx(
              arrowClass,
              "cursor-not-allowed text-brand-text/30"
            )}
            aria-disabled="true"
          >
            ‹ Anterior
          </span>
        ) : (
          <LocalizedClientLink
            href={hrefForPage(page - 1)}
            scroll={false}
            className={clx(
              arrowClass,
              "text-brand-text hover:bg-brand-section hover:text-brand-accent"
            )}
            aria-label="Página anterior"
          >
            ‹ Anterior
          </LocalizedClientLink>
        )}

        {renderPageButtons()}

        {nextDisabled ? (
          <span
            className={clx(
              arrowClass,
              "cursor-not-allowed text-brand-text/30"
            )}
            aria-disabled="true"
          >
            Siguiente ›
          </span>
        ) : (
          <LocalizedClientLink
            href={hrefForPage(page + 1)}
            scroll={false}
            className={clx(
              arrowClass,
              "text-brand-text hover:bg-brand-section hover:text-brand-accent"
            )}
            aria-label="Página siguiente"
          >
            Siguiente ›
          </LocalizedClientLink>
        )}
      </div>
    </nav>
  )
}

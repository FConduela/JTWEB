import { ChevronRight } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (!items.length) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1"
              {...(isLast ? { "aria-current": "page" as const } : {})}
            >
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-brand-text/50"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span className="font-medium text-brand-primary">
                  {item.label}
                </span>
              ) : item.href ? (
                <LocalizedClientLink
                  href={item.href}
                  className="text-brand-text/70 transition-colors hover:text-brand-primary"
                >
                  {item.label}
                </LocalizedClientLink>
              ) : (
                <span className="text-brand-text/70">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs

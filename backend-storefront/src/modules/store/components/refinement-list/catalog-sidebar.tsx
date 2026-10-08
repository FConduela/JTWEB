import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Contenido por defecto de la barra lateral hasta habilitar filtros dinámicos. */
export default function CatalogSidebar() {
  return (
    <nav aria-label="Accesos del catálogo">
      <h2 className="mb-4 text-base font-bold text-brand-text">Categorías</h2>
      <ul className="flex flex-col gap-y-2 text-sm">
        <li>
          <LocalizedClientLink
            href="/store"
            className="text-brand-text transition-colors hover:text-brand-accent"
          >
            Todo el catálogo
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/ofertas"
            className="text-brand-text transition-colors hover:text-brand-accent"
          >
            Ofertas
          </LocalizedClientLink>
        </li>
      </ul>
    </nav>
  )
}

import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mapa del Sitio | Jugando Toy",
    description:
      "Índice de páginas de Jugando Toy: tienda, categorías, blog, contacto y políticas legales.",
  }
}

const siteMapLinkClassName =
  "block min-h-[44px] py-2 text-base text-brand-primary transition-colors hover:text-brand-text hover:underline"

const storeLinks = [
  { label: "Inicio", href: "/" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
]

const categoryLinks = [
  { label: "Juguetes de Madera", href: "/categories/juguetes-de-madera" },
  { label: "Didácticos y Montessori", href: "/categories/didacticos" },
  { label: "Juegos de Mesa", href: "/categories/juegos-de-mesa" },
]

const legalLinks = [
  { label: "Políticas de Envío", href: "/politicas/envio" },
  { label: "Términos y Condiciones", href: "/politicas/terminos" },
  { label: "Privacidad", href: "/politicas/privacidad" },
  { label: "Devoluciones", href: "/politicas/devoluciones" },
  { label: "Cookies", href: "/politicas/cookies" },
]

export default function MapaDelSitioPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <div className="content-container">
        <h1 className="mb-10 text-2xl font-bold text-brand-text md:text-3xl">
          Mapa del Sitio
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <nav aria-labelledby="sitemap-store-heading">
            <h2
              id="sitemap-store-heading"
              className="mb-4 text-lg font-semibold text-brand-text"
            >
              Tienda
            </h2>
            <ul className="space-y-1">
              {storeLinks.map(({ label, href }) => (
                <li key={href}>
                  <LocalizedClientLink href={href} className={siteMapLinkClassName}>
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="sitemap-categories-heading">
            <h2
              id="sitemap-categories-heading"
              className="mb-4 text-lg font-semibold text-brand-text"
            >
              Categorías
            </h2>
            <ul className="space-y-1">
              {categoryLinks.map(({ label, href }) => (
                <li key={href}>
                  <LocalizedClientLink href={href} className={siteMapLinkClassName}>
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="sitemap-legal-heading">
            <h2
              id="sitemap-legal-heading"
              className="mb-4 text-lg font-semibold text-brand-text"
            >
              Legales
            </h2>
            <ul className="space-y-1">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <LocalizedClientLink href={href} className={siteMapLinkClassName}>
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  )
}

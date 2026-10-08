import LocalizedClientLink from "@modules/common/components/localized-client-link"

const navigationLinks = [
  { label: "Juguetes de Madera", href: "/categories/juguetes-de-madera" },
  { label: "Didácticos y Montessori", href: "/categories/didacticos" },
  { label: "Juegos de Mesa", href: "/categories/juegos-de-mesa" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Blog", href: "/blog" },
]

const customerSupportLinks = [
  { label: "Políticas de Envío", href: "/politicas/envio" },
  { label: "Devoluciones", href: "/politicas/devoluciones" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
]

const footerLinkClassName =
  "flex min-h-[44px] items-center py-2 text-sm text-brand-text transition-colors hover:text-brand-primary md:min-h-0 md:py-1"

const footerHeadingClassName = "text-base font-semibold text-brand-text"

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-grey-20 bg-brand-section"
      itemScope
      itemType="http://schema.org/Organization"
    >
      <div className="content-container px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-5">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-8">
          <div>
            <p
              itemProp="name"
              className="text-2xl font-bold text-brand-accent"
            >
              Jugando Toy
            </p>
            <p
              itemProp="description"
              className="mt-4 text-sm leading-relaxed text-brand-text"
            >
              Los mejores juegos de mesa y juguetes didácticos en Chile.
              Diversión asegurada para toda la familia.
            </p>
            <link itemProp="sameAs" href="https://www.instagram.com/jugandotoy.s/" />
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className={footerHeadingClassName}>Tienda</h2>
            <ul className="mt-2 flex flex-col">
              {navigationLinks.map(({ label, href }) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className={footerLinkClassName}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={footerHeadingClassName}>Contacto</h2>
            <address className="mt-2 flex flex-col not-italic text-brand-text">
              <a
                href="tel:+56912345678"
                itemProp="telephone"
                className={footerLinkClassName}
              >
                +56 9 1234 5678
              </a>
              <a
                href="mailto:hola@jugandotoy.cl"
                itemProp="email"
                className={footerLinkClassName}
              >
                hola@jugandotoy.cl
              </a>
              <a
                href="https://wa.me/56971606638"
                className={footerLinkClassName}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <span className="flex min-h-[44px] items-center py-2 text-sm md:min-h-0 md:py-1">
                Lun - Vie: 9:00 a 18:00
              </span>
            </address>
          </div>

          <nav aria-label="Atención al cliente">
            <h2 className={footerHeadingClassName}>Atención al Cliente</h2>
            <ul className="mt-2 flex flex-col">
              {customerSupportLinks.map(({ label, href }) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className={footerLinkClassName}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sección de Redes Sociales y Políticas */}
        <div className="mt-10 flex flex-col items-center gap-6 border-t border-gray-200 py-6 text-center md:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-brand-accent"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/jugandotoy.s/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-brand-accent"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-brand-accent"
              aria-label="YouTube"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </a>
            <a
              href="https://wa.me/56971606638"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-brand-accent"
              aria-label="WhatsApp"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-brand-accent"
              aria-label="TikTok"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.919-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 3.36.01 6.72-.02 10.08-.03 1.99-1.16 3.89-2.97 4.87-1.8.98-4.08 1.09-6.04.28-2.17-.88-3.66-2.99-3.78-5.23-.11-2.21.74-4.41 2.34-5.86 1.23-1.12 2.86-1.72 4.51-1.73v4.07c-.91-.02-1.82.22-2.54.74-.92.65-1.47 1.73-1.43 2.85.05 1.14.67 2.19 1.66 2.72 1 .53 2.26.56 3.32.12.97-.41 1.73-1.23 1.98-2.25.08-.35.12-.71.11-1.07V.02z" />
              </svg>
            </a>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-4 text-sm font-medium text-brand-text">
            <LocalizedClientLink
              href="/politicas/terminos"
              className="transition-colors hover:text-brand-accent"
            >
              Términos y condiciones
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/politicas/cookies"
              className="transition-colors hover:text-brand-accent"
            >
              Política de cookies
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/politicas/privacidad"
              className="transition-colors hover:text-brand-accent"
            >
              Política de privacidad
            </LocalizedClientLink>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-grey-20 pt-6 md:flex-row md:justify-between">
          <p className="text-center text-sm text-brand-text md:text-left">
            © {new Date().getFullYear()} Jugando Toy. Todos los derechos
            reservados.
          </p>
          <LocalizedClientLink
            href="/mapa-del-sitio"
            className="inline-flex min-h-[44px] items-center py-2 text-sm text-brand-text transition-colors hover:text-brand-primary md:min-h-0 md:py-1"
          >
            Mapa del sitio
          </LocalizedClientLink>
        </div>
      </div>
    </footer>
  )
}

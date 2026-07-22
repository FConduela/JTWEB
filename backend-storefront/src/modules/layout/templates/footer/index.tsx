import LocalizedClientLink from "@modules/common/components/localized-client-link"

const navigationLinks = [
  { label: "Juegos de Mesa", href: "/store" },
  { label: "Juguetes Didácticos", href: "/store" },
  { label: "Ofertas", href: "/store" },
]

const policyLinks = [
  { label: "Políticas de Envío", href: "/politicas/envio" },
  { label: "Términos y Condiciones", href: "/politicas/terminos" },
  { label: "Privacidad", href: "/politicas/privacidad" },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-grey-20 bg-brand-bg">
      <div className="content-container px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-8">
          {/* Columna 1 — Marca y SEO */}
          <div>
            <p className="text-brand-primary text-2xl font-bold">Jugando Toy</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-text">
              Los mejores juegos de mesa y juguetes didácticos en Chile.
              Diversión asegurada para toda la familia.
            </p>
          </div>

          {/* Columna 2 — Navegación */}
          <nav aria-label="Navegación del pie de página">
            <h2 className="text-sm font-semibold text-brand-text">Tienda</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {navigationLinks.map(({ label, href }) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-brand-text transition-colors hover:text-brand-primary"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna 3 — Atención al cliente (E-A-T) */}
          <div>
            <h2 className="text-sm font-semibold text-brand-text">Contacto</h2>
            <address className="mt-4 flex flex-col gap-3 text-sm not-italic text-brand-text">
              <a
                href="tel:+56912345678"
                className="transition-colors hover:text-brand-primary"
              >
                +56 9 1234 5678
              </a>
              <a
                href="mailto:hola@jugandotoy.cl"
                className="transition-colors hover:text-brand-primary"
              >
                hola@jugandotoy.cl
              </a>
              <span>Lun - Vie: 9:00 a 18:00</span>
            </address>
          </div>

          {/* Columna 4 — Políticas (Trust) */}
          <nav aria-label="Políticas legales">
            <h2 className="text-sm font-semibold text-brand-text">Políticas</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {policyLinks.map(({ label, href }) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-brand-text transition-colors hover:text-brand-primary"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-grey-20 pt-8">
          <p className="text-center text-sm text-brand-text md:text-left">
            © {new Date().getFullYear()} Jugando Toy. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

type CatalogFaqItem = {
  question: string
  answer: string
}

type CatalogListingSeoSectionProps = {
  title: string
  description?: string | null
  faqs?: CatalogFaqItem[]
  entityLabel?: string
}

const placeholderFaqs: CatalogFaqItem[] = [
  {
    question: "Pregunta frecuente de ejemplo",
    answer:
      "Aquí podrás mostrar respuestas editables desde Medusa (metadata o módulo CMS).",
  },
  {
    question: "Otra pregunta sobre este catálogo",
    answer:
      "Usa este bloque para reforzar SEO con contenido único por categoría o colección.",
  },
]

const CatalogListingSeoSection = ({
  title,
  description,
  faqs,
  entityLabel = "catálogo",
}: CatalogListingSeoSectionProps) => {
  const headingId = "catalog-listing-seo-heading"
  const faqItems = faqs?.length ? faqs : placeholderFaqs

  return (
    <article
      aria-labelledby={headingId}
      className="mt-12 border-t border-gray-200 pt-8 pb-12 md:mt-16 md:pt-10"
    >
      <header className="mb-6 md:mb-8">
        <h2
          id={headingId}
          className="text-xl font-semibold text-brand-text md:text-2xl"
        >
          Más sobre {title}
        </h2>
      </header>

      <div className="max-w-none space-y-4 text-sm leading-relaxed text-brand-text/80 md:text-base">
        {description ? (
          <p>{description}</p>
        ) : (
          <>
            <p>
              En esta sección podrás añadir un texto descriptivo exclusivo para{" "}
              <strong>{title}</strong>, pensado para mejorar el posicionamiento
              en buscadores y ayudar a tus clientes a elegir.
            </p>
            <p className="text-brand-text/60">
              El contenido se cargará desde Medusa (descripción extendida o
              metadata de la {entityLabel}).
            </p>
          </>
        )}
      </div>

      <section
        aria-labelledby="catalog-listing-faq-heading"
        className="mt-8 md:mt-10"
      >
        <h3
          id="catalog-listing-faq-heading"
          className="mb-4 text-base font-semibold text-brand-text md:text-lg"
        >
          Preguntas frecuentes
        </h3>
        <ul className="list-none space-y-3">
          {faqItems.map((item, index) => (
            <li key={`${item.question}-${index}`}>
              <details className="rounded-lg border border-gray-200 bg-brand-bg px-4 py-3">
                <summary className="min-h-11 cursor-pointer list-none font-medium text-brand-text [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-text/80 md:text-base">
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

export default CatalogListingSeoSection

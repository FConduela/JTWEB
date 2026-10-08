import LocalizedClientLink from "@modules/common/components/localized-client-link"

const categoryCards = [
  {
    title: "Juguetes de Madera",
    href: "/categories/juguetes-de-madera",
    placeholderClass: "bg-brand-blue",
  },
  {
    title: "Didácticos y Montessori",
    href: "/categories/didacticos",
    placeholderClass: "bg-brand-peach",
  },
  {
    title: "Juegos de Mesa",
    href: "/categories/juegos-de-mesa",
    placeholderClass: "bg-brand-primary",
  },
] as const

export default function CategoryShowcase() {
  return (
    <section
      aria-labelledby="home-category-showcase-heading"
      className="py-12 md:py-16"
    >
      <div className="content-container px-4">
        <h2
          id="home-category-showcase-heading"
          className="mb-8 text-center text-2xl font-bold text-brand-accent md:mb-10 md:text-3xl"
        >
          Encuentra el regalo perfecto
        </h2>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {categoryCards.map(({ title, href, placeholderClass }) => (
            <li key={href}>
              <LocalizedClientLink
                href={href}
                className="group flex min-h-[44px] flex-col overflow-hidden rounded-lg border border-grey-20 bg-brand-bg shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <div
                  className={`aspect-[4/3] w-full ${placeholderClass} transition-opacity group-hover:opacity-90`}
                  aria-hidden="true"
                />
                <span className="flex min-h-[44px] items-center px-4 py-3 text-lg font-semibold text-brand-text md:text-xl">
                  {title}
                </span>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

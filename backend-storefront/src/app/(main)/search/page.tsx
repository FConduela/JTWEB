import { Metadata } from "next"

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata(
  props: SearchPageProps
): Promise<Metadata> {
  const { q } = await props.searchParams
  const term = q?.trim()

  if (term) {
    return {
      title: `Resultados para “${term}” | Jugando Toy`,
      description: `Productos relacionados con “${term}” en Jugando Toy.`,
    }
  }

  return {
    title: "Resultados de búsqueda | Jugando Toy",
    description: "Busca juegos de mesa y juguetes didácticos en Jugando Toy.",
  }
}

export default async function SearchPage(props: SearchPageProps) {
  const { q } = await props.searchParams
  const term = q?.trim() ?? ""

  return (
    <main className="px-4 py-12 md:py-16">
      <div className="content-container">
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl font-bold text-brand-text md:text-3xl">
            {term
              ? `Resultados para: ${term}`
              : "Resultados de búsqueda"}
          </h1>
          {!term ? (
            <p className="mt-3 text-base leading-relaxed text-brand-text/80">
              Escribe un término para encontrar productos en nuestro catálogo.
            </p>
          ) : null}
        </header>

        <section aria-label="Buscar productos" className="mb-10 md:mb-12">
          <form
            action="/search"
            method="get"
            className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <label htmlFor="search-q" className="sr-only">
              Término de búsqueda
            </label>
            <input
              id="search-q"
              name="q"
              type="search"
              defaultValue={term}
              placeholder="Ej: tren, puzzle, madera..."
              autoComplete="off"
              className="min-h-[44px] w-full flex-1 rounded-md border border-grey-20 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
            <button
              type="submit"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-brand-primary px-6 py-2 text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Buscar
            </button>
          </form>
        </section>

        <section aria-labelledby="search-results-heading">
          <h2 id="search-results-heading" className="sr-only">
            Listado de productos
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            <p className="col-span-full rounded-lg border border-dashed border-grey-20 bg-brand-bg px-4 py-12 text-center text-base text-brand-text/70">
              Conectando motor de búsqueda...
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

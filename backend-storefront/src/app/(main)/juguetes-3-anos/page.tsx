import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Juguetes para 3 años | Didácticos y de Madera | Jugando Toy",
    description:
      "Juguetes educativos para niños de 3 años: motricidad fina, creatividad y juego simbólico con materiales seguros de madera.",
  }
}

export default function Juguetes3AnosPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <div className="content-container">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold text-brand-text md:text-4xl">
            Juguetes Educativos para 3 años
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-text/80 md:text-lg">
            A los 3 años los niños consolidan la motricidad fina, el lenguaje y
            el juego simbólico. Proponemos juguetes de madera y material
            didáctico que estimulan la coordinación, la concentración y la
            exploración segura, alejados de pantallas y pensados para jugar en
            familia.
          </p>
        </header>

        <section aria-labelledby="juguetes-3-grid-heading">
          <h2 id="juguetes-3-grid-heading" className="sr-only">
            Productos recomendados
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            <p className="col-span-full rounded-lg border border-dashed border-grey-20 bg-brand-bg px-4 py-16 text-center text-base text-brand-text/70">
              Cargando juguetes para 3 años...
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

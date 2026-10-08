import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  return {
    title: "Sobre Nosotros | Jugando Toy",
    description:
      "Conoce la historia y misión de Jugando Toy: juguetes didácticos y de madera para familias en Chile.",
    alternates: {
      canonical: `${baseUrl}/nosotros`,
    },
    openGraph: {
      title: "Sobre Nosotros | Jugando Toy",
      description:
        "Juguetes de madera y material didáctico pensado para aprender jugando, lejos de las pantallas.",
      url: `${baseUrl}/nosotros`,
      type: "website",
    },
  }
}

export default function NosotrosPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <header className="content-container mb-10 border-b border-grey-20 pb-10 md:mb-12">
        <h1 className="text-center text-3xl font-bold text-brand-text md:text-4xl">
          Nuestra Historia
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-brand-text/80 md:text-lg">
          Somos una tienda chilena apasionada por el juego con sentido y los
          materiales que duran.
        </p>
      </header>

      <section
        aria-labelledby="nosotros-mision-heading"
        className="content-container mx-auto max-w-3xl space-y-6 text-gray-800"
      >
        <h2
          id="nosotros-mision-heading"
          className="text-xl font-semibold text-brand-text md:text-2xl"
        >
          Nuestra misión
        </h2>
        <p className="text-base leading-relaxed md:text-lg">
          En Jugando Toy creemos que la infancia merece experiencias reales:
          construir, imaginar, compartir y descubrir con las manos. Nuestra
          misión es acercar a las familias de Chile juguetes didácticos y de
          madera de alta calidad, seleccionados por su valor educativo, su
          seguridad y su capacidad de acompañar el desarrollo cognitivo y
          emocional.
        </p>
        <p className="text-base leading-relaxed md:text-lg">
          Queremos ser un aliado para alejar a niñas y niños de las pantallas,
          proponiendo juegos de mesa, material Montessori y propuestas de madera
          que invitan a jugar en familia, al aire libre y en casa, con piezas
          nobles y duraderas.
        </p>
        <p className="text-base leading-relaxed text-brand-text/70 md:text-lg">
          Este contenido se ampliará con la historia del fundador, valores de
          marca y compromiso con proveedores responsables.
        </p>
      </section>
    </main>
  )
}

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full min-h-[70vh] border-b border-grey-20 bg-gradient-to-br from-brand-primary to-brand-primary/80">
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
          Aprender jugando nunca fue tan divertido
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl">
          Descubre nuestra selección de juegos de mesa y juguetes didácticos
          para toda la familia.
        </p>

        <LocalizedClientLink
          href="/store"
          className="rounded-full bg-brand-secondary px-8 py-4 text-lg font-bold text-brand-text shadow-lg transition-colors hover:bg-white"
        >
          Ver catálogo
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Hero

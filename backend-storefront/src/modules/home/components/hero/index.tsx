import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Imagen local (gradiente) por defecto; sustituye con NEXT_PUBLIC_HERO_IMAGE_URL si tienes foto en Medusa/S3. */
const HERO_IMAGE_SRC =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/images/hero-bg.svg"

const Hero = () => {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative min-h-[75vh] w-full overflow-hidden border-b border-grey-20 bg-gradient-to-br from-brand-primary to-brand-primary/80"
    >
      <div className="absolute inset-0 min-h-[75vh] w-full">
        <Image
          src={HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 min-h-[75vh] bg-black/50"
      />

      <div className="relative z-10 mx-auto flex min-h-[75vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1
          id="home-hero-heading"
          className="mb-6 max-w-4xl text-3xl font-bold text-brand-accent md:text-5xl"
        >
          Juguetes de Madera Didácticos y Montessori
        </h1>

        <p className="mb-8 max-w-2xl text-base text-white md:text-lg">
          Descubre nuestra selección de juegos de mesa y juguetes didácticos
          para toda la familia.
        </p>

        <LocalizedClientLink
          href="/store"
          className="inline-flex min-h-11 min-w-44 items-center justify-center rounded-full bg-brand-accent px-8 py-3 text-base font-bold text-brand-section shadow-lg transition-colors hover:bg-brand-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-section md:text-lg"
        >
          Ver catálogo
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Hero

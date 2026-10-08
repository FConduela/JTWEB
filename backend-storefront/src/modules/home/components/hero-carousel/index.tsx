"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const AUTOPLAY_MS = 6000

const slides = [
  {
    title: "Juguetes de Madera y Didácticos",
    description:
      "Descubre nuestra selección pedagógica para toda la familia.",
    buttonLabel: "Ver catálogo",
    href: "/store",
    image:
      process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/images/hero-bg.svg",
  },
  {
    title: "Pedagogía Montessori",
    description:
      "Fomentamos la exploración y el aprendizaje a través del juego libre.",
    buttonLabel: "Conoce más",
    href: "/nosotros",
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Ofertas Especiales",
    description:
      "Renueva la diversión con nuestros descuentos de temporada.",
    buttonLabel: "Ver ofertas",
    href: "/ofertas",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
  },
] as const

export default function HeroCarousel() {
  const slideCount = slides.length
  const extendedSlides = [
    slides[slideCount - 1],
    ...slides,
    slides[0],
  ]

  /** Índice en el track extendido (1 = primera slide real). */
  const [trackIndex, setTrackIndex] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [autoplayPaused, setAutoplayPaused] = useState(false)

  const activeSlide =
    trackIndex === 0
      ? slideCount - 1
      : trackIndex === slideCount + 1
        ? 0
        : trackIndex - 1

  const pauseAutoplay = useCallback(() => {
    setAutoplayPaused(true)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      pauseAutoplay()
      setTransitionEnabled(true)
      setTrackIndex(index + 1)
    },
    [pauseAutoplay]
  )

  const goToPrevious = useCallback(() => {
    pauseAutoplay()
    setTransitionEnabled(true)
    setTrackIndex((current) => current - 1)
  }, [pauseAutoplay])

  const goToNext = useCallback(() => {
    pauseAutoplay()
    setTransitionEnabled(true)
    setTrackIndex((current) => current + 1)
  }, [pauseAutoplay])

  const handleTrackTransitionEnd = useCallback(() => {
    if (trackIndex === extendedSlides.length - 1) {
      setTransitionEnabled(false)
      setTrackIndex(1)
      return
    }
    if (trackIndex === 0) {
      setTransitionEnabled(false)
      setTrackIndex(slideCount)
    }
  }, [trackIndex, extendedSlides.length, slideCount])

  useEffect(() => {
    if (!transitionEnabled) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionEnabled(true))
      })
      return () => cancelAnimationFrame(id)
    }
  }, [transitionEnabled, trackIndex])

  useEffect(() => {
    if (autoplayPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setTransitionEnabled(true)
      setTrackIndex((current) => current + 1)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [autoplayPaused])

  return (
    <section
      aria-label="Carrusel de promociones"
      className="relative w-full overflow-hidden border-b border-grey-20 bg-brand-primary pb-8 md:pb-10"
      aria-roledescription="carrusel"
    >
      <div className="relative w-full overflow-hidden">
        <div
          className={`flex items-stretch ${
            transitionEnabled
              ? "transition-transform duration-500 ease-in-out"
              : ""
          }`}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
          aria-live="polite"
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget) {
              return
            }
            handleTrackTransitionEnd()
          }}
        >
          {extendedSlides.map((slide, index) => {
            const slideIndex =
              index === 0
                ? slideCount - 1
                : index === extendedSlides.length - 1
                  ? 0
                  : index - 1
            const isActive = activeSlide === slideIndex
            const HeadingTag = slideIndex === 0 ? "h1" : "h2"

            return (
              <article
                key={`${slide.title}-${index}`}
                className="relative flex w-full flex-shrink-0 flex-col md:flex-row md:items-stretch"
                aria-hidden={!isActive}
              >
                <LocalizedClientLink
                  href={slide.href}
                  className="absolute inset-0 z-10"
                  aria-label={`Ir a ${slide.title}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={pauseAutoplay}
                />

                <div className="flex w-full shrink-0 items-start justify-center self-stretch px-3 pb-2 pt-5 md:w-1/2 md:px-4 md:pb-3 md:pt-6 lg:px-5 lg:pt-8">
                  <div className="relative aspect-[3/2] h-auto w-full shrink-0 overflow-hidden rounded-3xl shadow-[3px_3px_12px_rgba(74,74,74,0.4)]">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={slideIndex === 0 && index === 1}
                      loading={
                        slideIndex === 0 && index === 1 ? "eager" : "lazy"
                      }
                      sizes="(max-width: 768px) 94vw, 48vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-start justify-start bg-brand-primary px-6 pb-2 pt-5 md:w-1/2 md:px-8 md:pb-3 md:pt-6 lg:px-10 lg:pt-8">
                  <HeadingTag
                    id={slideIndex === 0 ? "home-hero-heading" : undefined}
                    className="mb-4 text-3xl font-bold text-brand-accent md:text-5xl"
                  >
                    {slide.title}
                  </HeadingTag>
                  <p className="mb-6 max-w-lg text-base leading-relaxed text-brand-text md:text-lg">
                    {slide.description}
                  </p>
                  <div className="relative z-20 flex w-full justify-center">
                    <span className="inline-flex min-h-11 items-center rounded-full bg-brand-accent px-6 py-3 text-base font-semibold text-brand-bg">
                      {slide.buttonLabel}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 z-30 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 p-2 text-brand-text shadow-sm backdrop-blur-sm transition-colors hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent md:left-4"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ‹
          </span>
        </button>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={goToNext}
          className="absolute right-2 top-1/2 z-30 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 p-2 text-brand-text shadow-sm backdrop-blur-sm transition-colors hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent md:right-4"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ›
          </span>
        </button>
      </div>

      <div
        className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 gap-3 md:bottom-3"
        role="tablist"
        aria-label="Seleccionar diapositiva"
      >
        {slides.map((slide, index) => {
          const isActive = activeSlide === index

          return (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Ir a ${slide.title}`}
              onClick={() => goToSlide(index)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <span
                className={`block rounded-full transition-colors ${
                  isActive
                    ? "h-3 w-3 bg-brand-accent"
                    : "h-2.5 w-2.5 border-2 border-brand-text/60 bg-brand-bg"
                }`}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}

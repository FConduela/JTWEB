import { Suspense } from "react"

import { HttpTypes } from "@medusajs/types"

import AuthoritySeoBlock from "@modules/home/components/authority-seo-block"
import CategoryShowcase from "@modules/home/components/category-showcase"
import HomeFeaturedFavorites from "@modules/home/components/featured-favorites"
import HeroCarousel from "@modules/home/components/hero-carousel"
import TrustBadges from "@modules/home/components/trust-badges"

type HomeTemplateProps = {
  region: HttpTypes.StoreRegion
  primaryCollectionId?: string
}

export default function HomeTemplate({
  region,
  primaryCollectionId,
}: HomeTemplateProps) {
  return (
    <main id="home-page" className="bg-brand-bg">
      <HeroCarousel />
      <TrustBadges />
      <CategoryShowcase />
      <Suspense
        fallback={
          <section
            aria-labelledby="home-favorites-heading"
            className="bg-brand-section py-12 md:py-16"
          >
            <div className="content-container px-4">
              <h2
                id="home-favorites-heading"
                className="mb-8 text-2xl font-bold text-brand-accent"
              >
                Nuestros Favoritos
              </h2>
              <p className="text-brand-text/70">Cargando productos...</p>
            </div>
          </section>
        }
      >
        <HomeFeaturedFavorites
          region={region}
          collectionId={primaryCollectionId}
        />
      </Suspense>
      <AuthoritySeoBlock />
    </main>
  )
}

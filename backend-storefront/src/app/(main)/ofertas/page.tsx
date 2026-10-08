import { Metadata } from "next"

import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

const OFFERS_COLLECTION_HANDLE =
  process.env.NEXT_PUBLIC_OFFERS_COLLECTION_HANDLE ?? "ofertas"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ofertas y Descuentos | Jugando Toy",
    description:
      "Descubre promociones en juegos de mesa y juguetes didácticos. Ofertas especiales en Jugando Toy.",
  }
}

function productHasActiveSale(product: HttpTypes.StoreProduct): boolean {
  try {
    const { cheapestPrice } = getProductPrice({ product })
    return cheapestPrice?.price_type === "sale"
  } catch {
    return false
  }
}

function OfertasEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      data-testid="ofertas-empty-state"
    >
      <span className="mb-6 text-5xl" role="img" aria-hidden="true">
        🎁
      </span>
      <h2 className="mb-4 max-w-md text-2xl font-bold text-brand-text md:text-3xl">
        Por el momento no tenemos ofertas activas
      </h2>
      <p className="mb-8 max-w-md text-base leading-relaxed text-brand-text/70">
        Nuestros duendes están trabajando en nuevos descuentos. Mientras tanto,
        descubre nuestras novedades.
      </p>
      <LocalizedClientLink
        href="/store"
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-accent px-8 py-3 text-base font-semibold text-brand-section transition-colors hover:bg-brand-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Ver catálogo
      </LocalizedClientLink>
    </div>
  )
}

export default async function OfertasPage() {
  const region = await getRegion(DEFAULT_COUNTRY_CODE)
  const collection = await getCollectionByHandle(OFFERS_COLLECTION_HANDLE)

  let saleProducts: HttpTypes.StoreProduct[] = []

  if (region && collection?.id) {
    const {
      response: { products },
    } = await listProducts({
      countryCode: DEFAULT_COUNTRY_CODE,
      regionId: region.id,
      queryParams: {
        limit: 100,
        collection_id: [collection.id],
        fields: "*variants.calculated_price",
      },
    })

    saleProducts = products.filter(productHasActiveSale)
  }

  const showEmptyState = !collection || saleProducts.length === 0

  return (
    <main className="px-4 py-12 md:py-16">
      <div className="content-container">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold text-brand-text md:text-4xl">
            Ofertas Especiales
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-text/80 md:text-lg">
            Aprovecha descuentos seleccionados en juguetes de madera, material
            didáctico y juegos de mesa. Vuelve pronto: actualizamos las
            promociones con frecuencia.
          </p>
        </header>

        <section aria-labelledby="ofertas-grid-heading">
          <h2 id="ofertas-grid-heading" className="sr-only">
            Productos en oferta
          </h2>

          {showEmptyState ? (
            <OfertasEmptyState />
          ) : (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
              {saleProducts.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region!} isFeatured />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

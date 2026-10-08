import React, { Suspense } from "react"

import { getProductPrice } from "@lib/util/get-product-price"
import { getBaseURL } from "@lib/util/env"
import Breadcrumbs, {
  BreadcrumbItem,
} from "@modules/common/components/breadcrumbs"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import RelatedProducts from "@modules/products/components/related-products"
import ProductDescription from "@modules/products/templates/product-info/product-description"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const isVariantInStock = (variant: HttpTypes.StoreProductVariant) => {
  if (!variant.manage_inventory) {
    return true
  }

  if (variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity || 0) > 0
}

const buildProductBreadcrumbs = (
  product: HttpTypes.StoreProduct
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }]

  const category = product.categories?.[0]

  if (product.categories?.length && category?.name && category?.handle) {
    items.push({
      label: category.name,
      href: `/categories/${category.handle}`,
    })
  } else {
    items.push({
      label: "Catálogo",
      href: "/store",
    })
  }

  items.push({ label: product.title })

  return items
}

const buildProductJsonLd = (
  product: HttpTypes.StoreProduct,
  images: HttpTypes.StoreProductImage[]
) => {
  const { cheapestPrice } = getProductPrice({ product })
  const inStock = product.variants?.some(isVariantInStock) ?? false
  const primaryImage =
    product.thumbnail ||
    product.images?.find((image) => !!image.url)?.url ||
    images.find((image) => !!image.url)?.url
  const description =
    product.description?.trim() ||
    `${product.title} - Juego disponible en Jugando Toy, tu tienda de juegos de mesa y juguetes didácticos en Chile.`
  const sku = product.variants?.[0]?.sku || product.id
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const productUrl = `${baseUrl}/products/${product.handle}`

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    image: primaryImage ? [primaryImage] : [],
    sku,
    brand: {
      "@type": "Brand",
      name: "Jugando Toy",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: cheapestPrice?.currency_code?.toUpperCase() || "CLP",
      price: cheapestPrice?.calculated_price_number ?? 0,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const jsonLd = buildProductJsonLd(product, images)
  const breadcrumbItems = buildProductBreadcrumbs(product)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="product-page">
        <div className="content-container py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <section
          aria-labelledby="product-heading"
          className="content-container py-6 md:py-10"
          data-testid="product-container"
        >
          <div className="relative flex flex-col gap-y-4 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
            <div className="order-1 flex min-h-0 flex-col lg:col-span-7 lg:row-start-1 lg:h-full">
              <div
                className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-gray-200/90 bg-brand-card p-4 shadow-[0_2px_10px_rgba(74,74,74,0.1)] md:p-6 lg:min-h-full"
                data-testid="product-gallery-panel"
              >
                <ImageGallery images={images} productTitle={product.title} />
              </div>
            </div>

            <aside className="order-2 flex min-h-0 flex-col lg:col-span-5 lg:row-start-1 lg:h-full">
              <div className="flex w-full flex-col rounded-2xl border border-gray-200/90 bg-brand-card p-6 shadow-[0_2px_10px_rgba(74,74,74,0.1)] lg:sticky lg:top-24 lg:mx-auto lg:h-full lg:max-h-full lg:min-h-0 lg:max-w-[500px] lg:flex-1">
                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper id={product.id} region={region} />
                </Suspense>
              </div>
              <ProductOnboardingCta />
            </aside>

            <div className="order-3 mt-8 hidden lg:col-span-7 lg:row-start-2 lg:block lg:mt-0">
              <ProductDescription product={product} />
            </div>

            <div className="order-3 mt-8 block w-full lg:hidden">
              <ProductDescription product={product} />
            </div>
          </div>
        </section>
        <div
          className="content-container my-12 md:my-16 lg:my-32"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </main>
    </>
  )
}

export default ProductTemplate

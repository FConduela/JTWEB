import React, { Suspense } from "react"

import { getProductPrice } from "@lib/util/get-product-price"
import { getBaseURL } from "@lib/util/env"
import Breadcrumbs, {
  BreadcrumbItem,
} from "@modules/common/components/breadcrumbs"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
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
  images: HttpTypes.StoreProductImage[],
  countryCode: string
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
  const productUrl = `${baseUrl}/${countryCode}/products/${product.handle}`

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

  const jsonLd = buildProductJsonLd(product, images, countryCode)
  const breadcrumbItems = buildProductBreadcrumbs(product)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="content-container py-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div
        className="content-container  flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={images} productTitle={product.title} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
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
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

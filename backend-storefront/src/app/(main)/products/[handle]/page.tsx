import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      countryCode: DEFAULT_COUNTRY_CODE,
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({ handle: product.handle }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { handle } = await props.params
  const region = await getRegion(DEFAULT_COUNTRY_CODE)

  if (!region) {
    return {
      title: "Producto no encontrado | Jugando Toy",
    }
  }

  const product = await listProducts({
    countryCode: DEFAULT_COUNTRY_CODE,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    return {
      title: "Producto no encontrado | Jugando Toy",
    }
  }

  const description =
    product.description?.trim() ||
    "Descubre los mejores juguetes educativos y de madera en Jugando Toy."

  const baseUrl = getBaseURL().replace(/\/$/, "")
  const canonicalUrl = `${baseUrl}/products/${product.handle}`

  return {
    title: `${product.title} | Jugando Toy`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.title,
      description,
      url: canonicalUrl,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(DEFAULT_COUNTRY_CODE)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: DEFAULT_COUNTRY_CODE,
    queryParams: {
      handle: params.handle,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*categories",
    },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={DEFAULT_COUNTRY_CODE}
      images={images}
    />
  )
}

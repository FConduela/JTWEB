import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ category: string[] }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  return product_categories.map((category: any) => ({
    category: [category.handle],
  }))
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params
  const category = await getCategoryByHandle(params.category)

  if (!category) {
    return {
      title: "Categoría no encontrada | Jugando Toy",
    }
  }

  const metadataRecord = category.metadata as Record<string, unknown> | undefined
  const seoDescription =
    typeof metadataRecord?.seo_description === "string"
      ? metadataRecord.seo_description.trim()
      : ""

  const description =
    seoDescription ||
    category.description?.trim() ||
    `Explora ${category.name} en Jugando Toy: juegos de mesa y juguetes didácticos con envío a todo Chile.`

  const baseUrl = getBaseURL().replace(/\/$/, "")
  const categoryPath = params.category.join("/")
  const canonicalUrl = `${baseUrl}/categories/${categoryPath}`

  return {
    title: `${category.name} | Jugando Toy`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | Jugando Toy`,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Jugando Toy`,
      description,
    },
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={DEFAULT_COUNTRY_CODE}
    />
  )
}

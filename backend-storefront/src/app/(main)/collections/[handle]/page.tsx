import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  return collections.map((collection: StoreCollection) => ({
    handle: collection.handle,
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    return {
      title: "Colección no encontrada | Jugando Toy",
    }
  }

  const metadataRecord = collection.metadata as
    | Record<string, unknown>
    | undefined
  const seoDescription =
    typeof metadataRecord?.seo_description === "string"
      ? metadataRecord.seo_description.trim()
      : ""

  const description =
    seoDescription ||
    `Explora la colección ${collection.title} en Jugando Toy: juegos de mesa y juguetes didácticos con envío a todo Chile.`

  const baseUrl = getBaseURL().replace(/\/$/, "")
  const canonicalUrl = `${baseUrl}/collections/${collection.handle}`

  return {
    title: `${collection.title} | Jugando Toy`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${collection.title} | Jugando Toy`,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} | Jugando Toy`,
      description,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={DEFAULT_COUNTRY_CODE}
    />
  )
}

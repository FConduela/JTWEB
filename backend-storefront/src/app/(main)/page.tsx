import { Metadata } from "next"

import HomeTemplate from "@modules/home/templates"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { getBaseURL } from "@lib/util/env"

const baseUrl = getBaseURL().replace(/\/$/, "")

export const metadata: Metadata = {
  title: "Juguetes de Madera Didácticos y Montessori | Jugando Toy",
  description:
    "Jugando Toy: juegos de mesa, juguetes didácticos y material Montessori. Envíos a todo Chile.",
  alternates: {
    canonical: baseUrl || "/",
  },
  openGraph: {
    title: "Juguetes de Madera Didácticos y Montessori | Jugando Toy",
    description:
      "Descubre juegos de mesa y juguetes educativos para aprender jugando en familia.",
    url: baseUrl || "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jugando Toy",
    description:
      "Juegos de mesa y juguetes didácticos con envío a todo Chile.",
  },
}

export default async function Home() {
  const region = await getRegion(DEFAULT_COUNTRY_CODE)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region) {
    return null
  }

  const primaryCollectionId = collections?.[0]?.id

  return (
    <HomeTemplate
      region={region}
      primaryCollectionId={primaryCollectionId}
    />
  )
}

import type { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

const STATIC_PATHS = [
  "/",
  "/store",
  "/nosotros",
  "/contacto",
  "/ofertas",
  "/search",
  "/preguntas-frecuentes",
  "/mapa-del-sitio",
  "/politicas/envio",
  "/politicas/devoluciones",
  "/politicas/terminos",
  "/politicas/privacidad",
  "/politicas/cookies",
] as const

function urlForPath(baseUrl: string, path: string): string {
  if (path === "/") {
    return `${baseUrl}/`
  }
  return `${baseUrl}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: urlForPath(baseUrl, path),
    lastModified,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/store" ? 0.9 : 0.7,
  }))

  // Productos (descomentar cuando se conecte listado para sitemap):
  // const { response: { products } } = await listProducts({
  //   countryCode: DEFAULT_COUNTRY_CODE,
  //   queryParams: { limit: 500, fields: "handle,updated_at" },
  // })
  // const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
  //   url: `${baseUrl}/products/${product.handle}`,
  //   lastModified: product.updated_at ? new Date(product.updated_at) : lastModified,
  //   changeFrequency: "weekly",
  //   priority: 0.8,
  // }))

  // Categorías (descomentar cuando existan handles estables en Medusa):
  // const categories = await listCategories()
  // const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
  //   buildCategoryPaths(category).map((path) => ({
  //     url: `${baseUrl}/categories/${path}`,
  //     lastModified,
  //     changeFrequency: "weekly",
  //     priority: 0.75,
  //   }))
  // )

  return [...staticEntries]
}

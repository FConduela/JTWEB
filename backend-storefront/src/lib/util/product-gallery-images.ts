import { HttpTypes } from "@medusajs/types"

/** Imágenes del producto para la galería PDP (siempre el set completo del producto). */
export function getProductGalleryImages(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductImage[] {
  const images = product.images ?? []

  return [...images].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
}

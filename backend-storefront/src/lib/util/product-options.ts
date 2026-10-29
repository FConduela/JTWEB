import { HttpTypes } from "@medusajs/types"

const DEFAULT_OPTION_TITLE = /^default(\s+option)?$/i

export const isMedusaDefaultOption = (title?: string | null) => {
  if (!title?.trim()) {
    return false
  }

  return DEFAULT_OPTION_TITLE.test(title.trim())
}

/** Opciones visibles en la PDP (oculta “Default option” si hay otras reales). */
export const getStorefrontProductOptions = (
  options: HttpTypes.StoreProductOption[] | null | undefined
): HttpTypes.StoreProductOption[] => {
  const list = options ?? []
  const nonDefault = list.filter((option) => !isMedusaDefaultOption(option.title))

  if (nonDefault.length > 0) {
    return nonDefault
  }

  return list
}

/**
 * Valores de opciones “Default” que Medusa exige en la variante pero no mostramos al cliente.
 * Si la opción tiene un solo valor, se rellena automáticamente.
 */
export const getImplicitDefaultOptionValues = (
  options: HttpTypes.StoreProductOption[] | null | undefined
): Record<string, string> => {
  const list = options ?? []
  const hasOtherOptions = list.some(
    (option) => !isMedusaDefaultOption(option.title)
  )

  if (!hasOtherOptions) {
    return {}
  }

  const implicit: Record<string, string> = {}

  for (const option of list) {
    if (!isMedusaDefaultOption(option.title)) {
      continue
    }

    const values = option.values ?? []
    if (values.length === 1 && values[0].value) {
      implicit[option.id] = values[0].value
    }
  }

  return implicit
}

export const mergeProductOptionSelection = (
  userSelection: Record<string, string | undefined>,
  implicitDefaults: Record<string, string>
): Record<string, string | undefined> => {
  return {
    ...implicitDefaults,
    ...userSelection,
  }
}

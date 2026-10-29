"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  variants?: HttpTypes.StoreProductVariant[]
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const isColorOptionTitle = (title: string) => {
  const normalized = title.toLowerCase().trim()
  return normalized === "color" || normalized === "colour"
}

/** Imagen IDs compartidas con la variante “base” (p. ej. Default variant). */
const getBaselineVariantImageIds = (
  variants: HttpTypes.StoreProductVariant[]
) => {
  const baselineVariant =
    variants.find((entry) =>
      entry.options?.some((opt) =>
        /default/i.test(opt.value ?? "")
      )
    ) ?? variants[0]

  return new Set(
    baselineVariant?.images?.map((image) => image.id).filter(Boolean) ?? []
  )
}

const pickVariantSwatchUrl = (
  variant: HttpTypes.StoreProductVariant,
  baselineImageIds: Set<string>
): string | null => {
  if (variant.thumbnail) {
    return variant.thumbnail
  }

  const imagesWithUrl =
    variant.images?.filter((image) => !!image.url) ?? []

  if (!imagesWithUrl.length) {
    return null
  }

  if (imagesWithUrl.length === 1) {
    return imagesWithUrl[0].url ?? null
  }

  // Medusa suele devolver también la foto principal del producto en variant.images[0].
  // Priorizamos una imagen que no esté en la variante base (p. ej. Rosa → perf.jpg).
  const variantSpecific = imagesWithUrl.find(
    (image) => image.id && !baselineImageIds.has(image.id)
  )
  if (variantSpecific?.url) {
    return variantSpecific.url
  }

  const highestRank = [...imagesWithUrl].sort(
    (a, b) => (b.rank ?? 0) - (a.rank ?? 0)
  )[0]

  return highestRank?.url ?? null
}

const findVariantThumbnailForValue = (
  variants: HttpTypes.StoreProductVariant[] | undefined,
  optionId: string,
  value: string
): string | null => {
  if (!variants?.length) {
    return null
  }

  const variant = variants.find((entry) =>
    entry.options?.some(
      (variantOption) =>
        variantOption.option_id === optionId && variantOption.value === value
    )
  )

  if (!variant) {
    return null
  }

  const baselineImageIds = getBaselineVariantImageIds(variants)

  return pickVariantSwatchUrl(variant, baselineImageIds)
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  variants,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const useColorSwatches = isColorOptionTitle(title)

  if (useColorSwatches) {
    return (
      <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
        <p className="text-sm text-brand-text">
          <span className="font-bold">{title}:</span>{" "}
          <span>{current ?? "Selecciona una opción"}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {filteredOptions.map((value) => {
            const variantImageUrl = findVariantThumbnailForValue(
              variants,
              option.id,
              value
            )
            const isSelected = value === current

            if (!variantImageUrl) {
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateOption(option.id, value)}
                  disabled={disabled}
                  data-testid="option-button"
                  className={clx(
                    "h-10 min-w-[3rem] flex-1 rounded-rounded border bg-brand-section px-2 text-sm text-brand-text transition-colors",
                    isSelected
                      ? "border-2 border-gray-900 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  {value}
                </button>
              )
            }

            return (
              <button
                key={value}
                type="button"
                aria-label={`${title} ${value}`}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => updateOption(option.id, value)}
                disabled={disabled}
                data-testid="color-option-button"
                className={clx(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-card transition-colors",
                  isSelected
                    ? "border-2 border-gray-900 shadow-sm"
                    : "border border-gray-200 hover:border-gray-400"
                )}
              >
                <Image
                  src={variantImageUrl}
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm text-brand-text">
        Selecciona {title}
      </span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "h-10 flex-1 rounded-rounded border bg-brand-section p-2 text-sm text-brand-text",
                {
                  "border-2 border-gray-900 shadow-sm": v === current,
                  "border-gray-200 hover:border-gray-400": v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect

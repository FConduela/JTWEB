"use client"

import {
  getOptionValueSwatchColor,
  getOptionValueSwatchUrl,
} from "@lib/util/product-options"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"

type ColorOptionSelectProps = {
  option: HttpTypes.StoreProductOption
  product: HttpTypes.StoreProduct
  selectedOptions: Record<string, string | undefined>
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  disabled: boolean
  "data-testid"?: string
}

const ColorOptionSelect = ({
  option,
  product,
  selectedOptions,
  current,
  updateOption,
  disabled,
  "data-testid": dataTestId,
}: ColorOptionSelectProps) => {
  const optionTitle = option.title ?? "Color"
  const values = option.values ?? []

  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <p className="text-sm text-brand-text">
        <span className="font-semibold">{optionTitle}:</span>{" "}
        {current ?? "Selecciona una opción"}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((optionValue) => {
          const value = optionValue.value
          const isActive = value === current
          const swatchUrl = getOptionValueSwatchUrl(
            product,
            option.id,
            value,
            selectedOptions,
            optionValue.metadata as Record<string, unknown> | null | undefined
          )
          const swatchColor = getOptionValueSwatchColor(
            optionValue.metadata as Record<string, unknown> | null | undefined
          )
          const swatchLabel = `${optionTitle} ${value}`

          return (
            <button
              key={`${option.id}-${value}`}
              type="button"
              aria-label={swatchLabel}
              aria-current={isActive ? "true" : undefined}
              disabled={disabled}
              onClick={() => updateOption(option.id, value)}
              data-testid="color-option-button"
              className={clx(
                "relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 bg-brand-card p-1 transition-colors",
                isActive
                  ? "border-brand-text"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              {swatchUrl ? (
                <Image
                  src={swatchUrl}
                  alt=""
                  aria-hidden
                  fill
                  className="object-contain"
                  sizes="72px"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex h-full w-full items-center justify-center rounded-lg text-xs font-medium text-brand-text"
                  style={
                    swatchColor ? { backgroundColor: swatchColor } : undefined
                  }
                >
                  {!swatchColor ? value : null}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ColorOptionSelect

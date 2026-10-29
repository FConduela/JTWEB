"use client"

import { clx } from "@medusajs/ui"
import { useEffect, useId, useRef } from "react"

export type CatalogSelectOption = {
  value: string
  label: string
}

type CatalogStyleSelectProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: CatalogSelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
  "data-testid"?: string
}

const optionButtonClass = (isActive: boolean) =>
  isActive
    ? "block w-full rounded-md bg-brand-bg px-3 py-2.5 text-left text-sm font-bold text-brand-accent"
    : "block w-full rounded-md px-3 py-2.5 text-left text-sm text-brand-text transition-colors hover:bg-gray-50 hover:text-brand-accent"

const CatalogStyleSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccionar…",
  disabled = false,
  required = false,
  id,
  "data-testid": dataTestId,
}: CatalogStyleSelectProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const labelId = useId()
  const fieldId = id ?? name

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const details = detailsRef.current
      if (!details?.open) {
        return
      }

      const target = event.target
      if (target instanceof Node && details.contains(target)) {
        return
      }

      details.open = false
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return
      }

      const details = detailsRef.current
      if (details?.open) {
        details.open = false
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const selectedLabel = options.find((option) => option.value === value)?.label
  const summaryText = selectedLabel ?? placeholder

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  return (
    <div
      className="relative z-30 w-full min-w-0 overflow-visible"
      data-testid={dataTestId}
    >
      <input
        type="hidden"
        name={name}
        value={value}
        required={required && !disabled}
      />
      <p id={labelId} className="mb-2 text-sm font-bold text-brand-text">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </p>
      <details
        ref={detailsRef}
        className={clx(
          "group relative z-30 w-full overflow-visible",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <summary
          id={fieldId}
          aria-labelledby={labelId}
          aria-disabled={disabled || undefined}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault()
            }
          }}
          className="flex h-11 w-full cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-[color:var(--brand-field-border)] bg-brand-card px-4 py-2 text-sm font-medium text-brand-text marker:content-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent group-open:border-brand-accent group-open:ring-2 group-open:ring-inset group-open:ring-brand-accent [&::-webkit-details-marker]:hidden"
        >
          <span className={clx("truncate", !value && "text-brand-text/60")}>
            {summaryText}
          </span>
          <span
            className="shrink-0 text-brand-text/60 transition-transform group-open:rotate-180"
            aria-hidden="true"
          >
            ▾
          </span>
        </summary>
        <ul
          className="mt-2 max-h-56 w-full overflow-y-auto rounded-md border border-[color:var(--brand-field-border)] bg-brand-card py-1 shadow-lg"
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option) => {
            const isActive = value === option.value

            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={optionButtonClass(isActive)}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      </details>
    </div>
  )
}

export default CatalogStyleSelect

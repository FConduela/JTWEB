"use client"

import { clx } from "@medusajs/ui"

type QuantitySelectProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  disabled?: boolean
  className?: string
}

const controlButtonClassName =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-section text-lg leading-none text-brand-text transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"

const QuantitySelect = ({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className,
}: QuantitySelectProps) => {
  const safeMax = Math.max(min, max)
  const safeValue = Math.min(Math.max(value, min), safeMax)

  const decrement = () => {
    onChange(Math.max(min, safeValue - 1))
  }

  const increment = () => {
    onChange(Math.min(safeMax, safeValue + 1))
  }

  return (
    <div
      className={clx("inline-flex items-center gap-3", className)}
      role="group"
      aria-label="Cantidad"
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        disabled={disabled || safeValue <= min}
        onClick={decrement}
        className={controlButtonClassName}
        data-testid="quantity-decrease-button"
      >
        <span aria-hidden="true">−</span>
      </button>
      <span
        className="min-w-[1.25rem] text-center text-base font-medium tabular-nums text-brand-text"
        aria-live="polite"
        data-testid="quantity-select-value"
      >
        {safeValue}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={disabled || safeValue >= safeMax}
        onClick={increment}
        className={controlButtonClassName}
        data-testid="quantity-increase-button"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  )
}

export default QuantitySelect

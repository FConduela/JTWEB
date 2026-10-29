"use client"

import Spinner from "@modules/common/icons/spinner"
import { clx } from "@medusajs/ui"

type CartItemQuantityProps = {
  value: number
  min?: number
  max: number
  disabled?: boolean
  onChange: (quantity: number) => void
}

const CartItemQuantity = ({
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
}: CartItemQuantityProps) => {
  const busy = disabled

  return (
    <div
      className="inline-flex h-10 shrink-0 items-stretch overflow-hidden rounded-lg border border-gray-200 bg-brand-card"
      data-testid="product-select-button"
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        disabled={busy || value <= min}
        onClick={() => onChange(value - 1)}
        className="flex min-w-9 items-center justify-center px-2 text-lg leading-none text-brand-text transition-colors hover:bg-brand-section disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <span
        className="flex min-w-[2.25rem] items-center justify-center border-x border-gray-200 text-sm font-semibold tabular-nums text-brand-text"
        aria-live="polite"
        aria-label={`Cantidad: ${value}`}
      >
        {busy ? <Spinner /> : value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        disabled={busy || value >= max}
        onClick={() => onChange(value + 1)}
        className={clx(
          "flex min-w-9 items-center justify-center px-2 text-lg leading-none text-brand-text transition-colors hover:bg-brand-section disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        +
      </button>
    </div>
  )
}

export default CartItemQuantity

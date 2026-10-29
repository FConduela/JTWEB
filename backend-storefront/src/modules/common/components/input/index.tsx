import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

const outsideFieldClassName =
  "mt-0 block h-11 w-full min-w-0 rounded-md border border-[color:var(--brand-field-border)] bg-brand-card px-4 text-sm text-brand-text hover:bg-brand-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent disabled:cursor-not-allowed disabled:opacity-60"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  /** Etiqueta arriba del campo (como Región/Comuna). Por defecto: flotante dentro del input. */
  labelPosition?: "floating" | "outside"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      touched,
      required,
      topLabel,
      labelPosition = "floating",
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    if (labelPosition === "outside") {
      return (
        <div className="flex w-full min-w-0 flex-col">
          {topLabel && (
            <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
          )}
          <p className="mb-2 text-sm font-bold text-brand-text">
            {label}
            {required ? <span className="text-rose-500"> *</span> : null}
          </p>
          <div className="relative w-full min-w-0">
            <input
              type={inputType}
              id={name}
              name={name}
              required={required}
              className={`${outsideFieldClassName}${className ? ` ${className}` : ""}`}
              {...props}
              ref={inputRef}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-4 text-ui-fg-subtle outline-none transition-all duration-150 focus:text-ui-fg-base"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            id={name}
            name={name}
            placeholder=" "
            required={required}
            className="block h-11 w-full appearance-none rounded-md border border-ui-border-base bg-ui-bg-field px-4 pb-1 pt-4 mt-0 hover:bg-ui-bg-field-hover focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="pointer-events-none absolute left-0 top-3 z-[1] mx-3 origin-0 -translate-y-2 px-1 text-xsmall-regular text-ui-fg-subtle"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-ui-fg-base absolute right-0 top-3"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input

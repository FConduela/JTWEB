import React from "react"

import { IconProps } from "types/icon"

const ShoppingCart: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...attributes}
    >
      <path
        d="M6 6h15l-1.5 9h-12L6 6z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L5 3H2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19" r="1.5" fill={color} />
      <circle cx="17" cy="19" r="1.5" fill={color} />
    </svg>
  )
}

export default ShoppingCart

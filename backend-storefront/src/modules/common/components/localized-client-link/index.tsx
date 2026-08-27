"use client"

import Link from "next/link"
import React from "react"

/**
 * La tienda opera únicamente en Chile (dominio .cl) y las rutas ya no llevan
 * el prefijo dinámico de país. Este componente se mantiene por compatibilidad
 * con el resto del código, mapeando directamente al `<Link />` de Next.js.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink

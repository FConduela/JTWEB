import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-brand-bg/40 p-4">
      <h3 className="text-base font-semibold text-brand-text">¿Necesitas ayuda?</h3>
      <ul className="my-2 flex flex-col gap-y-2 text-sm">
        <li>
          <LocalizedClientLink
            href="/contacto"
            className="font-medium text-brand-accent hover:underline"
          >
            Contacto
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/politicas/devoluciones"
            className="font-medium text-brand-accent hover:underline"
          >
            Devoluciones y cambios
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/preguntas-frecuentes"
            className="font-medium text-brand-accent hover:underline"
          >
            Preguntas frecuentes
          </LocalizedClientLink>
        </li>
      </ul>
    </div>
  )
}

export default Help

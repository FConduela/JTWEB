import { Metadata } from "next"

import PolicyDocument from "@modules/legal/templates/policy-document"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Política de Cookies | Jugando Toy",
    description:
      "Qué son las cookies, qué tipos utilizamos en jugandotoy.cl y cómo gestionar tu consentimiento.",
  }
}

export default function PoliticasCookiesPage() {
  return (
    <PolicyDocument
      title="Política de Cookies"
      intro="Esta página explica el uso de cookies y tecnologías similares en nuestro sitio web. El detalle legal completo se actualizará periódicamente."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          ¿Qué es una cookie?
        </h2>
        <p className="text-base md:text-lg">
          Una cookie es un pequeño archivo de texto que el navegador guarda en tu
          dispositivo cuando visitas un sitio. Permite recordar preferencias,
          mantener la sesión iniciada o medir el uso del sitio de forma
          agregada.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Para qué las usamos
        </h2>
        <p className="text-base md:text-lg">
          En Jugando Toy utilizamos cookies necesarias para el funcionamiento
          de la tienda (carrito, autenticación y seguridad), cookies analíticas
          para entender cómo se usa el sitio y mejorar la experiencia, y, cuando
          corresponda, cookies de marketing para personalizar comunicaciones.
        </p>
        <h3 className="text-lg font-semibold text-brand-text">
          Cookies esenciales
        </h3>
        <p className="text-base md:text-lg">
          Son imprescindibles para navegar, añadir productos al carrito y
          completar compras. No requieren consentimiento previo en la medida en
          que son estrictamente necesarias.
        </p>
        <h3 className="text-lg font-semibold text-brand-text">
          Cookies opcionales
        </h3>
        <p className="text-base md:text-lg">
          Las cookies analíticas o de marketing solo se activarán conforme a tu
          elección en el banner de cookies o la configuración de tu navegador.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Cómo gestionar tu consentimiento
        </h2>
        <p className="text-base md:text-lg">
          Puedes aceptar cookies desde el aviso inferior del sitio, eliminar
          cookies desde la configuración de tu navegador o contactarnos si tienes
          dudas sobre el tratamiento de datos asociado.
        </p>
      </section>
    </PolicyDocument>
  )
}

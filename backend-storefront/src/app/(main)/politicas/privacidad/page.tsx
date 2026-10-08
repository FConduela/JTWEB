import { Metadata } from "next"

import PolicyDocument from "@modules/legal/templates/policy-document"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Política de Privacidad | Jugando Toy",
    description:
      "Cómo Jugando Toy recopila, usa y protege tus datos personales al comprar en nuestra tienda online.",
  }
}

export default function PrivacidadPage() {
  return (
    <PolicyDocument
      title="Política de Privacidad"
      intro="Respetamos tu privacidad. Este documento explica qué datos tratamos y con qué fines. Sustituiremos este texto por la versión legal definitiva."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Datos que recopilamos
        </h2>
        <p className="text-base md:text-lg">
          Al crear una cuenta, comprar o contactarnos, podemos recibir nombre,
          correo electrónico, teléfono, dirección de envío y datos de la
          transacción necesarios para procesar tu pedido.
        </p>
        <h3 className="text-lg font-semibold text-brand-text">
          Datos de navegación
        </h3>
        <p className="text-base md:text-lg">
          Utilizamos cookies y herramientas analíticas para mejorar el sitio,
          medir audiencia y personalizar la experiencia, según tu
          configuración de consentimiento cuando aplique.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Finalidad del tratamiento
        </h2>
        <p className="text-base md:text-lg">
          Usamos tus datos para gestionar pedidos, envíos, atención al cliente,
          cumplir obligaciones legales y, con tu autorización, enviar novedades o
          promociones.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Compartición con terceros
        </h2>
        <p className="text-base md:text-lg">
          Compartimos información solo con proveedores necesarios para operar la
          tienda (pagos, logística, hosting, email transaccional), bajo
          contratos que exigen confidencialidad y seguridad.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Tus derechos
        </h2>
        <p className="text-base md:text-lg">
          Puedes solicitar acceso, rectificación, eliminación u oposición al
          tratamiento de tus datos escribiendo a hola@jugandotoy.cl. Responderemos
          en los plazos establecidos por la normativa aplicable en Chile.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Seguridad
        </h2>
        <p className="text-base md:text-lg">
          Aplicamos medidas técnicas y organizativas razonables para proteger tu
          información. Ningún sistema en internet es 100 % seguro; te recomendamos
          usar contraseñas robustas y no compartir tus credenciales.
        </p>
      </section>
    </PolicyDocument>
  )
}

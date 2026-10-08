import { Metadata } from "next"

import PolicyDocument from "@modules/legal/templates/policy-document"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Políticas de Devolución | Jugando Toy",
    description:
      "Garantía legal, derecho a retracto y pasos para solicitar cambios o devoluciones en Jugando Toy.",
  }
}

export default function PoliticasDevolucionesPage() {
  return (
    <PolicyDocument
      title="Políticas de Devolución y Garantía"
      intro="Información orientativa sobre garantías y devoluciones conforme a la normativa chilena. El texto legal definitivo será publicado por el equipo de Jugando Toy."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Garantía legal (6 meses)
        </h2>
        <p className="text-base md:text-lg">
          Los productos nuevos cuentan con la garantía legal establecida en la
          Ley del Consumidor. Si el artículo presenta fallas de fabricación
          dentro del plazo legal, puedes solicitar reparación, cambio o
          devolución según corresponda.
        </p>
        <p className="text-base md:text-lg">
          Conserva tu comprobante de compra y el embalaje original cuando sea
          posible para agilizar la evaluación.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Derecho a retracto
        </h2>
        <p className="text-base md:text-lg">
          En compras a distancia, el consumidor puede ejercer el derecho a
          retracto dentro de los plazos y condiciones que establece la ley,
          siempre que el producto no haya sido usado de forma incompatible con
          su naturaleza y se devuelva en condiciones razonables.
        </p>
        <p className="text-base text-brand-text/70 md:text-lg">
          Algunos productos pueden tener condiciones específicas; te
          informaremos en el checkout o en el correo de confirmación cuando
          aplique.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Cómo solicitar un cambio
        </h2>
        <p className="text-base md:text-lg">
          Escríbenos a hola@jugandotoy.cl o por WhatsApp indicando número de
          pedido, producto y motivo de la solicitud. Nuestro equipo te indicará
          los pasos para envío, revisión y resolución.
        </p>
        <p className="text-base md:text-lg">
          Los plazos de respuesta y logística inversa se comunicarán caso a
          caso, procurando una solución justa y transparente.
        </p>
      </section>
    </PolicyDocument>
  )
}

import { Metadata } from "next"

import PolicyDocument from "@modules/legal/templates/policy-document"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Políticas de Envío | Jugando Toy",
    description:
      "Tiempos de despacho, costos de envío, cobertura en Chile y condiciones de entrega en Jugando Toy.",
  }
}

export default function PoliticasEnvioPage() {
  return (
    <PolicyDocument
      title="Políticas de Envío"
      intro="Esta página describe cómo gestionamos los envíos de tu pedido. El contenido definitivo será actualizado por el equipo de Jugando Toy."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Tiempos de despacho
        </h2>
        <p className="text-base md:text-lg">
          Procesamos los pedidos en días hábiles. Una vez confirmado el pago,
          prepararemos tu compra y te notificaremos cuando el paquete sea
          entregado al transportista.
        </p>
        <p className="text-base md:text-lg">
          Los plazos estimados pueden variar según la región de destino y la
          disponibilidad de stock en el momento de la compra.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Costos de envío
        </h2>
        <p className="text-base md:text-lg">
          El costo de envío se calcula al finalizar el checkout según la
          dirección ingresada y el peso o volumen del pedido.
        </p>
        <h3 className="text-lg font-semibold text-brand-text">
          Envío gratuito
        </h3>
        <p className="text-base md:text-lg">
          Ocasionalmente ofrecemos envío gratuito en compras sobre un monto
          mínimo. Las condiciones vigentes se mostrarán en el carrito antes de
          pagar.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Cobertura y seguimiento
        </h2>
        <p className="text-base md:text-lg">
          Despachamos a todo Chile continental. Cuando tu pedido esté en
          camino, recibirás información de seguimiento por correo electrónico.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Devoluciones por envío
        </h2>
        <p className="text-base md:text-lg">
          Si el producto llega dañado por el transporte o no corresponde a lo
          comprado, contáctanos dentro del plazo indicado en nuestros términos
          para gestionar una solución.
        </p>
      </section>
    </PolicyDocument>
  )
}

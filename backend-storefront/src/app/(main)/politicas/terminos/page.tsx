import { Metadata } from "next"

import PolicyDocument from "@modules/legal/templates/policy-document"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Términos y Condiciones | Jugando Toy",
    description:
      "Condiciones de uso de la tienda Jugando Toy: compras, pagos, cuenta de usuario y responsabilidades.",
  }
}

export default function TerminosPage() {
  return (
    <PolicyDocument
      title="Términos y Condiciones"
      intro="Al utilizar jugandotoy.cl aceptas estas condiciones generales. Este texto es provisional hasta su revisión legal final."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Uso del sitio
        </h2>
        <p className="text-base md:text-lg">
          El sitio está destinado a la compra de juegos de mesa y juguetes
          didácticos por personas mayores de edad o con autorización de un
          tutor. Debes proporcionar información veraz al registrarte o completar
          un pedido.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Compras y precios
        </h2>
        <p className="text-base md:text-lg">
          Los precios publicados están expresados en pesos chilenos e incluyen
          IVA cuando corresponda. Nos reservamos el derecho de corregir errores
          tipográficos o de precio antes de confirmar el pedido.
        </p>
        <h3 className="text-lg font-semibold text-brand-text">
          Confirmación del pedido
        </h3>
        <p className="text-base md:text-lg">
          Un pedido queda confirmado cuando recibes el comprobante de compra por
          correo electrónico y el pago ha sido aprobado.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Pagos
        </h2>
        <p className="text-base md:text-lg">
          Aceptamos los medios de pago habilitados en el checkout. El cobro se
          realiza al confirmar la transacción según las reglas de cada
          proveedor de pago.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Devoluciones y garantía legal
        </h2>
        <p className="text-base md:text-lg">
          Los consumidores en Chile cuentan con los derechos establecidos en la
          Ley del Consumidor. Para cambios o devoluciones, revisa también
          nuestras políticas de envío y contáctanos con tu número de pedido.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-text md:text-2xl">
          Modificaciones
        </h2>
        <p className="text-base md:text-lg">
          Podemos actualizar estos términos. La versión vigente estará siempre
          publicada en esta página con la fecha de última modificación cuando
          corresponda.
        </p>
      </section>
    </PolicyDocument>
  )
}

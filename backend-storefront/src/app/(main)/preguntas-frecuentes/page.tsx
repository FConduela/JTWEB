import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Preguntas Frecuentes | Jugando Toy",
    description:
      "Respuestas sobre envíos, pagos y devoluciones en Jugando Toy. Compra juguetes didácticos con confianza.",
  }
}

const faqItems = [
  {
    question: "¿Hacen envíos a todo Chile?",
    answer:
      "Sí, despachamos a todo el territorio nacional. El costo y el plazo se calculan al finalizar la compra según tu comuna y el peso del pedido.",
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Aceptamos los métodos habilitados en el checkout (tarjetas y otros proveedores configurados). El cobro se confirma cuando la transacción es aprobada.",
  },
  {
    question: "¿Cómo funcionan las devoluciones?",
    answer:
      "Puedes revisar nuestras políticas de devolución y garantía legal. Escríbenos con tu número de pedido y te guiaremos en el proceso.",
  },
] as const

export default function PreguntasFrecuentesPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <article className="mx-auto max-w-3xl text-gray-800">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-brand-text md:text-3xl">
            Preguntas Frecuentes
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-text/80">
            Resolvemos las dudas más comunes sobre compras en Jugando Toy.
          </p>
        </header>

        <div className="space-y-6">
          {faqItems.map(({ question, answer }) => (
            <section
              key={question}
              className="rounded-lg border border-grey-20 bg-brand-bg px-4 py-5 md:px-6"
            >
              <h2 className="text-lg font-semibold text-brand-text md:text-xl">
                {question}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-text/80">
                {answer}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}

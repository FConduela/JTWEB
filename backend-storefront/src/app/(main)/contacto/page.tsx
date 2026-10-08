import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  return {
    title: "Contacto | Jugando Toy",
    description:
      "Escríbenos o contáctanos por WhatsApp. Atención a familias y compradores de juguetes didácticos en Chile.",
    alternates: {
      canonical: `${baseUrl}/contacto`,
    },
    openGraph: {
      title: "Contacto | Jugando Toy",
      description:
        "Email, WhatsApp y horario de atención de Jugando Toy.",
      url: `${baseUrl}/contacto`,
      type: "website",
    },
  }
}

const contactLinkClassName =
  "inline-flex min-h-[44px] items-center py-2 text-base text-brand-primary underline-offset-4 transition-colors hover:text-brand-text hover:underline"

const fieldClassName =
  "min-h-[44px] w-full rounded-md border border-grey-20 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"

export default function ContactoPage() {
  return (
    <main className="px-4 py-12 md:py-16">
      <div className="content-container">
        <header className="mb-10 md:mb-12">
          <h1 className="text-3xl font-bold text-brand-text md:text-4xl">
            Contáctanos
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-text/80 md:text-lg">
            Resolvemos dudas sobre productos, envíos y pedidos. Te respondemos
            lo antes posible en horario hábil.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <section aria-labelledby="contacto-info-heading">
            <h2
              id="contacto-info-heading"
              className="mb-6 text-xl font-semibold text-brand-text md:text-2xl"
            >
              Información directa
            </h2>
            <ul className="space-y-2 text-brand-text">
              <li>
                <span className="block text-sm font-medium text-brand-text/70">
                  Email
                </span>
                <a
                  href="mailto:hola@jugandotoy.cl"
                  className={contactLinkClassName}
                >
                  hola@jugandotoy.cl
                </a>
              </li>
              <li>
                <span className="block text-sm font-medium text-brand-text/70">
                  Teléfono / WhatsApp
                </span>
                <a href="tel:+56912345678" className={contactLinkClassName}>
                  +56 9 1234 5678
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/56971606638"
                  className={contactLinkClassName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribir por WhatsApp
                </a>
              </li>
              <li>
                <span className="block text-sm font-medium text-brand-text/70">
                  Horario
                </span>
                <p className="flex min-h-[44px] items-center py-2 text-base">
                  Lun - Vie: 9:00 a 18:00
                </p>
              </li>
            </ul>
          </section>

          <section aria-labelledby="contacto-form-heading">
            <h2
              id="contacto-form-heading"
              className="mb-6 text-xl font-semibold text-brand-text md:text-2xl"
            >
              Envíanos un mensaje
            </h2>
            <form
              className="space-y-5"
              action="#"
              method="post"
              aria-label="Formulario de contacto"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-brand-text"
                >
                  Nombre
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={fieldClassName}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-brand-text"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={fieldClassName}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-medium text-brand-text"
                >
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className={`${fieldClassName} min-h-[132px] resize-y py-3`}
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-brand-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:w-auto"
              >
                Enviar
              </button>
              <p className="text-sm text-brand-text/60">
                Formulario de demostración. La integración con envío de correo
                se conectará en una siguiente fase.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

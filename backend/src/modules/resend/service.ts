import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type ResendOptions = {
  api_key: string
  from: string
  html_templates?: Record<
    string,
    {
      subject?: string
      content: string
    }
  >
}

type InjectedDependencies = {
  logger: Logger
}

function getEmailContent(
  template: string,
  data: Record<string, unknown>
): { subject: string; html: string } {
  const storeName = "Jugando Toy"

  switch (template) {
    case "welcome_email":
      return {
        subject: `¡Bienvenido a ${storeName}, ${data.first_name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4F46E5;">¡Hola ${data.first_name}! 👋</h2>
            <p>Estamos muy felices de tenerte en <strong>${storeName}</strong>.</p>
            <p>A partir de ahora, podrás acceder a ofertas exclusivas, guardar tus productos favoritos y comprar de forma mucho más rápida.</p>
            <a href="http://localhost:8000/cl/account" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Ir a mi cuenta</a>
          </div>
        `,
      }
    case "order_receipt":
      return {
        subject: `Confirmación de pedido #${data.order_id} - ${storeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4F46E5;">¡Gracias por tu compra, ${data.customer_name}! 🎉</h2>
            <p>Hemos recibido tu pedido <strong>#${data.order_id}</strong> y ya estamos trabajando en él.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px;"><strong>Total pagado:</strong> ${data.total} ${typeof data.currency === "string" ? data.currency.toUpperCase() : ""}</p>
            </div>
            <p>Te avisaremos cuando tu pedido esté en camino.</p>
          </div>
        `,
      }
    case "abandoned_cart":
      return {
        subject: `¿Olvidaste algo en ${storeName}? 🛒`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4F46E5;">¡Tus juguetes te están esperando!</h2>
            <p>Notamos que dejaste algunos artículos increíbles en tu carrito y no queremos que te los pierdas.</p>
            <p>Vuelve antes de que se agoten:</p>
            <a href="http://localhost:8000/cl/cart" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Recuperar mi carrito</a>
          </div>
        `,
      }
    case "account_merge": {
      const magicLink =
        (typeof data.magic_link === "string" && data.magic_link) || "#"
      return {
        subject: `Unifica tus compras en ${storeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4F46E5;">¡Hola! Detectamos compras previas 🛍️</h2>
            <p>Hemos notado que realizaste compras como invitado usando este correo.</p>
            <p>Para vincular ese historial con tu nueva cuenta y tener todo en un solo lugar, haz clic en el siguiente enlace (es válido por 15 minutos):</p>
            <a href="${magicLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Vincular mis compras</a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">Si no solicitaste esta acción, puedes ignorar este correo de forma segura.</p>
          </div>
        `,
      }
    }
    default:
      return {
        subject: `Notificación de ${storeName}`,
        html: `<p>Evento: ${template}</p><pre>${JSON.stringify(data, null, 2)}</pre>`,
      }
  }
}

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  private resendClient: Resend
  private options: ResendOptions
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()
    this.resendClient = new Resend(options.api_key)
    this.options = options
    this.logger = logger
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required in the provider's options."
      )
    }

    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required in the provider's options."
      )
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!this.resendClient) {
      return {}
    }

    const template = notification.template ?? ""
    const notificationData = (notification.data ?? {}) as Record<
      string,
      unknown
    >
    const { subject, html } = getEmailContent(template, notificationData)

    const { data, error } = await this.resendClient.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        this.options.from ||
        "onboarding@resend.dev",
      to: notification.to,
      subject,
      html,
    })

    if (error || !data) {
      if (error) {
        this.logger.error("Error al enviar correo con Resend", error)
      } else {
        this.logger.error("Error desconocido al enviar correo con Resend")
      }

      return {}
    }

    return { id: data.id }
  }
}

export default ResendNotificationProviderService

import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { CreateEmailOptions, Resend } from "resend"
import { orderPlacedEmail } from "./emails/order-placed"

enum Templates {
  ORDER_PLACED = "order_placed",
}

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

  private getTemplateSubject(
    template: string,
    data?: Record<string, unknown>
  ) {
    if (data?.subject && typeof data.subject === "string") {
      return data.subject
    }

    if (this.options.html_templates?.[template]?.subject) {
      return this.options.html_templates[template].subject
    }

    if (template === Templates.ORDER_PLACED) {
      return "Confirmación de tu pedido"
    }

    return "Nueva notificación"
  }

  private getTemplateContent(
    template: string,
    data: Record<string, unknown>
  ) {
    if (data.html && typeof data.html === "string") {
      return data.html
    }

    if (this.options.html_templates?.[template]?.content) {
      return this.options.html_templates[template].content
    }

    if (template === Templates.ORDER_PLACED) {
      return orderPlacedEmail({
        order_id: data.order_id as string | number | undefined,
        first_name: data.first_name as string | undefined,
      })
    }

    return null
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const template = notification.template as string
    const notificationData = (notification.data ?? {}) as Record<
      string,
      unknown
    >
    const content = this.getTemplateContent(template, notificationData)

    if (!content) {
      this.logger.error(
        `No se encontró plantilla de correo para "${template}".`
      )
      return {}
    }

    const commonOptions = {
      from: this.options.from,
      to: [notification.to],
      subject: this.getTemplateSubject(template, notificationData),
    }

    const emailOptions: CreateEmailOptions =
      typeof content === "string"
        ? { ...commonOptions, html: content }
        : { ...commonOptions, react: content }

    const { data, error } = await this.resendClient.emails.send(emailOptions)

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

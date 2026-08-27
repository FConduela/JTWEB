import {
  AbstractPaymentProvider,
  MedusaError,
  MedusaErrorTypes,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  WebpayPlus,
} from "transbank-sdk"
type TransbankOptions = Record<string, unknown>

type InjectedDependencies = {
  logger?: {
    info: (message: string) => void
    warn: (message: string) => void
    error: (message: string) => void
  }
}

export class TransbankProviderService extends AbstractPaymentProvider<TransbankOptions> {
  static identifier = "transbank"

  protected logger_?: InjectedDependencies["logger"]
  protected transaction_: InstanceType<typeof WebpayPlus.Transaction>

  constructor(container: InjectedDependencies, options: TransbankOptions) {
    super(container, options)

    this.logger_ = container.logger

    // SDK v6: configureForTesting() fue removido; buildForIntegration es el equivalente.
    this.transaction_ = WebpayPlus.Transaction.buildForIntegration(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY
    )
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    try {
      // Generamos un sufijo único basado en el tiempo exacto para evitar colisiones en Transbank
      const uniqueSuffix = Date.now().toString()
      const buyOrder = `O-${uniqueSuffix}`.slice(0, 26)
      const sessionId = `S-${uniqueSuffix}`.slice(0, 61)
      // Transbank requiere enteros estrictos
      const amount = Math.round(Number(input.amount))

      // Nota: Medusa v2 no siempre expone el cart_id dentro de `context`, por
      // lo que ya no intentamos extraerlo aquí. La cookie `_medusa_cart_id`
      // se restaura en el frontend vía "HTML Bounce" con localStorage (ver
      // TransbankPaymentButton y src/app/api/transbank/return/route.ts en el
      // storefront), así que la URL de retorno se mantiene estática.
      const returnUrl = "http://localhost:8000/api/transbank/return"

      const response = await this.transaction_.create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
      )

      return {
        id: sessionId,
        data: {
          token: response.token,
          url: response.url,
        },
        status: PaymentSessionStatus.PENDING,
      }
    } catch (error) {
      console.error("[Transbank] ERROR FATAL EN initiatePayment:")
      console.dir(error, { depth: null, showHidden: true })

      throw new MedusaError(
        MedusaErrorTypes.PAYMENT_AUTHORIZATION_ERROR,
        `No se pudo iniciar la transacción de Webpay Plus: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      )
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const paymentSessionData = input.data ?? {}

    const token = paymentSessionData.token_ws as string

    if (!token) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        "No se recibió el token_ws de Transbank. No es posible autorizar el pago."
      )
    }

    try {
      const response = await this.transaction_.commit(token)

      const isApproved =
        response.response_code === 0 && response.status === "AUTHORIZED"

      if (!isApproved) {
        this.logger_?.warn(
          `[Transbank] Pago rechazado. response_code=${response.response_code} status=${response.status}`
        )

        return {
          status: PaymentSessionStatus.ERROR,
          data: { ...paymentSessionData, transbank_response: response },
        }
      }

      return {
        status: PaymentSessionStatus.AUTHORIZED,
        data: { ...paymentSessionData, transbank_response: response },
      }
    } catch (error) {
      console.error("[Transbank] ERROR FATAL EN authorizePayment:")
      console.dir(error, { depth: null, showHidden: true })

      throw new MedusaError(
        MedusaErrorTypes.PAYMENT_AUTHORIZATION_ERROR,
        `No se pudo autorizar la transacción de Webpay Plus: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      )
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    throw new MedusaError(
      MedusaErrorTypes.NOT_ALLOWED,
      "refundPayment para Transbank Webpay Plus aún no está implementado."
    )
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data ?? {} }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    return {
      status: PaymentSessionStatus.PENDING,
      data: input.data ?? {},
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async getWebhookActionAndData(data: {
    data: Record<string, unknown>
    rawData: string | Buffer
    headers: Record<string, unknown>
  }): Promise<WebhookActionResult> {
    return { action: "not_supported" }
  }
}

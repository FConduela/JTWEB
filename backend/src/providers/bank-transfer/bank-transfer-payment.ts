import {
  AbstractPaymentProvider,
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
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

type BankTransferOptions = Record<string, unknown>

type InjectedDependencies = {
  logger?: {
    info: (message: string) => void
    warn: (message: string) => void
    error: (message: string) => void
  }
}

/**
 * Proveedor de pago dummy para Transferencia Bancaria manual.
 *
 * No se comunica con ninguna pasarela externa: la orden se autoriza de
 * inmediato y el comprador recibe los datos bancarios por fuera del flujo de
 * checkout (ej. en el correo de confirmación) para transferir manualmente.
 * El estado real del pago se gestiona luego desde el Admin de Medusa
 * (capturar/cancelar) una vez que se confirma la recepción del dinero.
 */
export class BankTransferProviderService extends AbstractPaymentProvider<BankTransferOptions> {
  static identifier = "bank_transfer"

  protected logger_?: InjectedDependencies["logger"]

  constructor(container: InjectedDependencies, options: BankTransferOptions) {
    super(container, options)

    this.logger_ = container.logger
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    return {
      id: `bt_${Date.now()}`,
      data: {},
      status: PaymentSessionStatus.PENDING,
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: input.data ?? {},
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: input.data ?? {} }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data ?? {} }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
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

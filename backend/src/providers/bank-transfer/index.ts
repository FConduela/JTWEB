import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { BankTransferProviderService } from "./bank-transfer-payment"

export default ModuleProvider(Modules.PAYMENT, {
  services: [BankTransferProviderService],
})

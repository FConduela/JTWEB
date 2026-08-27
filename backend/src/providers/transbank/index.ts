import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { TransbankProviderService } from "./transbank-payment"

// Medusa v2 espera el nombre del módulo al que pertenece el proveedor
// (Modules.PAYMENT = "payment"), no un identificador arbitrario como
// "transbank". El identificador propio del proveedor ya está definido
// como `static identifier = "transbank"` en TransbankProviderService.
export default ModuleProvider(Modules.PAYMENT, {
  services: [TransbankProviderService],
})

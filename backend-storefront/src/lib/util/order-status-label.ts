const FULFILLMENT_LABELS: Record<string, string> = {
  not_fulfilled: "Sin preparar",
  partially_fulfilled: "Parcialmente preparado",
  fulfilled: "Preparado",
  partially_shipped: "Parcialmente enviado",
  shipped: "Enviado",
  partially_delivered: "Parcialmente entregado",
  delivered: "Entregado",
  canceled: "Cancelado",
  requires_action: "Requiere acción",
}

const PAYMENT_LABELS: Record<string, string> = {
  not_paid: "Sin pagar",
  awaiting: "Pendiente",
  authorized: "Autorizado",
  partially_authorized: "Parcialmente autorizado",
  captured: "Pagado",
  partially_captured: "Parcialmente pagado",
  partially_refunded: "Parcialmente reembolsado",
  refunded: "Reembolsado",
  canceled: "Cancelado",
  requires_action: "Requiere acción",
}

export function formatOrderStatusLabel(
  status: string | null | undefined,
  kind: "fulfillment" | "payment"
): string {
  if (!status) {
    return "—"
  }

  const key = status.toLowerCase()
  const map = kind === "payment" ? PAYMENT_LABELS : FULFILLMENT_LABELS

  if (map[key]) {
    return map[key]
  }

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

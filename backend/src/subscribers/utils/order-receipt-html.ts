type OrderLineItem = {
  title?: string | null
  product_title?: string | null
  quantity?: number | null
  unit_price?: unknown
  subtotal?: unknown
  total?: unknown
}

type OrderSummary = {
  current_order_total?: unknown
  accounting_total?: unknown
  paid_total?: unknown
  original_order_total?: unknown
}

type OrderShippingAddress = {
  first_name?: string | null
}

export type OrderReceiptInput = {
  displayId: string | number
  customerName: string
  items: OrderLineItem[]
  total?: unknown
  shippingTotal?: unknown
  itemTotal?: unknown
  summary?: OrderSummary | null
  currencyCode?: string
}

function toNumber(value: unknown): number {
  if (value == null) {
    return 0
  }

  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    return parseFloat(value) || 0
  }

  if (typeof value === "object") {
    if ("numeric_" in value && value.numeric_ != null) {
      return Number(value.numeric_)
    }

    if ("numeric" in value && value.numeric != null) {
      return Number(value.numeric)
    }

    if ("value" in value && value.value != null) {
      return Number(value.value)
    }

    if (
      "toNumber" in value &&
      typeof (value as { toNumber: () => number }).toNumber === "function"
    ) {
      return (value as { toNumber: () => number }).toNumber()
    }
  }

  return Number(value) || 0
}

export function resolveOrderTotal({
  total,
  shippingTotal,
  itemTotal,
  summary,
  items = [],
}: Pick<
  OrderReceiptInput,
  "total" | "shippingTotal" | "itemTotal" | "summary" | "items"
>): number {
  for (const candidate of [
    total,
    summary?.current_order_total,
    summary?.accounting_total,
    summary?.paid_total,
    summary?.original_order_total,
  ]) {
    const parsed = toNumber(candidate)
    if (parsed > 0) {
      return parsed
    }
  }

  const itemsSum = items.reduce((sum, item) => {
    const quantity = item.quantity ?? 1
    const lineTotal =
      toNumber(item.total) ||
      toNumber(item.subtotal) ||
      toNumber(item.unit_price) * quantity

    return sum + lineTotal
  }, 0)

  const shipping = toNumber(shippingTotal)
  const itemTotalParsed = toNumber(itemTotal)

  if (itemTotalParsed > 0 || shipping > 0) {
    return itemTotalParsed + shipping
  }

  return itemsSum
}

export function formatCLP(
  amount: unknown,
  currencyCode = "clp"
): string {
  const numeric = toNumber(amount)

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function buildItemRows(
  items: OrderLineItem[],
  currencyCode = "clp"
): string {
  if (!items.length) {
    return `
      <tr>
        <td colspan="3" style="padding: 16px; text-align: center; color: #64748b; font-size: 14px;">
          Sin productos registrados
        </td>
      </tr>
    `
  }

  return items
    .map((item) => {
      const title = escapeHtml(
        item.title || item.product_title || "Producto"
      )
      const quantity = item.quantity ?? 1
      const lineTotal =
        toNumber(item.total) ||
        toNumber(item.subtotal) ||
        toNumber(item.unit_price) * quantity

      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
            ${title}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #475569; text-align: center; width: 80px;">
            ${quantity}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b; text-align: right; width: 120px; white-space: nowrap;">
            ${formatCLP(lineTotal, currencyCode)}
          </td>
        </tr>
      `
    })
    .join("")
}

export function buildOrderReceiptHtml({
  displayId,
  customerName,
  items,
  total,
  shippingTotal,
  itemTotal,
  summary,
  currencyCode = "clp",
}: OrderReceiptInput): string {
  const safeName = escapeHtml(customerName)
  const itemRows = buildItemRows(items, currencyCode)
  const resolvedTotal = resolveOrderTotal({
    total,
    shippingTotal,
    itemTotal,
    summary,
    items,
  })
  const formattedTotal = formatCLP(resolvedTotal, currencyCode)

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmación de pedido #${displayId} - Jugando Toy</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 32px 24px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                  Jugando Toy
                </h1>
                <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                  Recibo de compra
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 24px;">
                <p style="margin: 0 0 8px; font-size: 18px; color: #1e293b; font-weight: 600;">
                  ¡Hola ${safeName}! Gracias por tu compra.
                </p>
                <p style="margin: 0 0 24px; font-size: 14px; color: #64748b; line-height: 1.6;">
                  Tu pedido fue confirmado exitosamente. Aquí tienes el resumen de tu compra.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #f1f5f9; border-radius: 8px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Número de orden</span>
                      <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #4f46e5;">
                        #${displayId}
                      </p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th align="left" style="padding: 12px 16px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">
                        Producto
                      </th>
                      <th align="center" style="padding: 12px 16px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; width: 80px;">
                        Cant.
                      </th>
                      <th align="right" style="padding: 12px 16px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; width: 120px;">
                        Precio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemRows}
                  </tbody>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="right" style="padding: 16px 0; border-top: 2px solid #e2e8f0;">
                      <span style="font-size: 14px; color: #64748b; margin-right: 16px;">Total pagado</span>
                      <span style="font-size: 22px; font-weight: 700; color: #1e293b;">${formattedTotal}</span>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                  Te avisaremos cuando tu pedido esté en camino. Si tienes alguna consulta, no dudes en contactarnos.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 13px; color: #94a3b8;">
                  Gracias por confiar en Jugando Toy
                </p>
                <p style="margin: 0; font-size: 12px; color: #cbd5e1;">
                  © ${new Date().getFullYear()} Jugando Toy. Todos los derechos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function getCustomerFirstName(
  shippingAddress?: OrderShippingAddress | null
): string {
  const firstName = shippingAddress?.first_name?.trim()
  return firstName || "Cliente"
}

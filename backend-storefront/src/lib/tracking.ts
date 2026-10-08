export const trackEvent = (eventName: string, data: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return

  if (typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", eventName, data)
  }

  if (typeof (window as any).fbq === "function") {
    const fbEvent =
      eventName === "purchase"
        ? "Purchase"
        : eventName === "add_to_cart"
          ? "AddToCart"
          : eventName === "view_item"
            ? "ViewContent"
            : "CustomEvent"
    ;(window as any).fbq("track", fbEvent, data)
  }
}

export const trackViewItem = (product: {
  id: string
  title: string
  price?: number
}) => {
  trackEvent("view_item", {
    currency: "CLP",
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price || 0,
      },
    ],
  })
}

export const trackAddToCart = (
  product: { id: string; title: string; price?: number },
  quantity: number
) => {
  trackEvent("add_to_cart", {
    currency: "CLP",
    value: (product.price || 0) * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price || 0,
        quantity,
      },
    ],
  })
}

export const trackPurchase = (
  orderId: string,
  total: number,
  items: Array<{
    id?: string
    title?: string
    quantity?: number
    unit_price?: number
    variant?: { product_id?: string }
  }>
) => {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "CLP",
    value: total,
    items: items.map((item) => ({
      item_id: item.variant?.product_id || item.id,
      item_name: item.title,
      price: item.unit_price,
      quantity: item.quantity,
    })),
  })
}

import { retrieveFreshCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

export const dynamic = "force-dynamic"

export default async function CartButton() {
  const cart = await retrieveFreshCart().catch(() => null)

  return <CartDropdown cart={cart} />
}

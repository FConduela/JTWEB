import { Text } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-brand-text/50"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className="font-bold text-gray-900"
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}

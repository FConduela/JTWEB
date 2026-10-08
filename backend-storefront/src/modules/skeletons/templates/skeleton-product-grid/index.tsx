import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  numberOfProducts = 8,
  variant = "card",
}: {
  numberOfProducts?: number
  variant?: "plain" | "card"
}) => {
  return (
    <ul
      className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => (
        <li key={index} className={variant === "card" ? "h-full" : undefined}>
          <SkeletonProductPreview variant={variant} />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid

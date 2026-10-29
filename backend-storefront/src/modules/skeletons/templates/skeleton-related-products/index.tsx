import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => {
  return (
    <section className="border-t border-gray-300 bg-brand-card pb-8 pt-5 md:pb-10 md:pt-6">
    <div className="content-container product-page-constraint">
      <div className="mb-4 md:mb-5">
        <div className="mx-auto h-4 w-36 animate-pulse rounded bg-gray-200" />
      </div>
      <ul className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
        {repeat(6).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
    </section>
  )
}

export default SkeletonRelatedProducts

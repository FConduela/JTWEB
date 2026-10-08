import { Container } from "@medusajs/ui"

const SkeletonProductPreview = ({ variant = "plain" }: { variant?: "plain" | "card" }) => {
  const isCard = variant === "card"

  return (
    <div
      className={`animate-pulse ${isCard ? "h-full overflow-hidden rounded-2xl border border-gray-200/90 bg-brand-card shadow-[0_2px_10px_rgba(74,74,74,0.1)]" : ""}`}
    >
      <Container
        className={`aspect-[4/5] w-full ${isCard ? "rounded-none bg-brand-card" : "rounded-lg bg-ui-bg-subtle"}`}
      />
      <div
        className={`flex flex-col gap-2 ${isCard ? "bg-brand-card p-4 pt-3" : "mt-2"}`}
      >
        <div className="h-5 w-[80%] rounded bg-gray-100" />
        <div className="h-5 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview

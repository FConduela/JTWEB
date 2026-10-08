import type { ReactNode } from "react"

type PolicyDocumentProps = {
  title: string
  intro?: string
  children: ReactNode
}

export default function PolicyDocument({
  title,
  intro,
  children,
}: PolicyDocumentProps) {
  return (
    <main className="px-4 py-12 md:py-16">
      <article className="mx-auto max-w-3xl text-gray-800">
        <header className="mb-8 space-y-4">
          <h1 className="text-2xl font-bold text-brand-text md:text-3xl">
            {title}
          </h1>
          {intro ? (
            <p className="text-base leading-relaxed md:text-lg">{intro}</p>
          ) : null}
        </header>
        <div className="space-y-8 leading-relaxed">{children}</div>
      </article>
    </main>
  )
}

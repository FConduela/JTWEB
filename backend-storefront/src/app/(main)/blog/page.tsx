import { Metadata } from "next"

import { getPosts } from "@lib/data/blog"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Blog | Jugando Toy",
  description:
    "Descubre artículos sobre crianza, metodologías educativas, desarrollo infantil y los mejores juguetes de madera.",
  openGraph: {
    title: "Blog de Jugando Toy",
    description:
      "Comunidad y artículos sobre desarrollo infantil y juguetes educativos.",
    type: "website",
  },
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="content-container py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl-semi">Blog de Jugando Toy</h1>
          <p className="text-base-regular text-ui-fg-subtle">
            Descubre artículos, novedades y contenido de nuestra tienda.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-base-regular text-ui-fg-subtle">
            Aún no hay artículos publicados.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 small:grid-cols-2 medium:grid-cols-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col overflow-hidden rounded-rounded border border-ui-border-base transition-shadow hover:shadow-elevation-card-hover"
              >
                {post.image_url && (
                  <div className="relative mb-4 h-48 w-full">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="h-full w-full rounded-t-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 p-6">
                  <LocalizedClientLink
                    href={`/blog/${post.slug}`}
                    className="text-xl-semi hover:text-ui-fg-interactive"
                  >
                    {post.title}
                  </LocalizedClientLink>
                  <time
                    dateTime={post.created_at}
                    className="text-small-regular text-ui-fg-subtle"
                  >
                    {formatDate(post.created_at)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

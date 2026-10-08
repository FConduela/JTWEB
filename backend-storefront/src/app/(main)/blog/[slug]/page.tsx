import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import CommentForm from "./components/comment-form"
import { getPostBySlug } from "@lib/data/blog"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"

type Props = {
  params: Promise<{ slug: string }>
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

const formatCommentDateTime = (date: string) =>
  new Date(date).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  })

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Artículo no encontrado | Jugando Toy",
    }
  }

  const plainTextContent = post.content.replace(/<[^>]+>/g, "")
  const excerpt =
    plainTextContent.length > 150
      ? plainTextContent.substring(0, 150) + "..."
      : plainTextContent

  return {
    title: `${post.title} | Jugando Toy`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: "article",
      publishedTime: post.created_at,
      authors: ["Jugando Toy"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
    },
  }
}

export default async function BlogPostPage(props: Props) {
  const { slug } = await props.params
  const [post, customer] = await Promise.all([
    getPostBySlug(slug),
    retrieveCustomer(),
  ])

  if (!post) {
    notFound()
  }

  const approvedComments =
    post.comments?.filter((comment) => comment.is_approved) ?? []

  return (
    <article className="content-container py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <LocalizedClientLink
          href="/blog"
          className="text-small-regular text-ui-fg-interactive hover:underline"
        >
          ← Volver al blog
        </LocalizedClientLink>

        <header className="flex flex-col gap-3">
          <h1 className="text-4xl-semi">{post.title}</h1>
          <time
            dateTime={post.created_at}
            className="text-base-regular text-ui-fg-subtle"
          >
            {formatDate(post.created_at)}
          </time>
        </header>

        {post.image_url && (
          <div className="relative my-8 h-64 w-full md:h-96">
            <img
              src={post.image_url}
              alt={post.title}
              className="h-full w-full rounded-xl object-cover shadow-sm"
            />
          </div>
        )}

        <div className="text-base-regular whitespace-pre-wrap text-ui-fg-base">
          {post.content}
        </div>

        <section className="flex flex-col gap-6 border-t border-ui-border-base pt-8">
          <h2 className="text-2xl-semi">Comentarios</h2>

          {customer ? (
            <CommentForm slug={slug} />
          ) : (
            <Text className="text-ui-fg-subtle">
              Para participar, por favor{" "}
              <LocalizedClientLink
                href="/account"
                className="text-ui-fg-interactive hover:underline"
              >
                inicia sesión
              </LocalizedClientLink>
              .
            </Text>
          )}

          {approvedComments.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {approvedComments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-4"
                >
                  <div className="mb-2 flex flex-col gap-1">
                    <p className="text-small-semi text-ui-fg-base">
                      {comment.author_name ?? "Usuario registrado"}
                    </p>
                    {comment.created_at && (
                      <time
                        dateTime={comment.created_at}
                        className="text-small-regular text-ui-fg-subtle"
                      >
                        {formatCommentDateTime(comment.created_at)}
                      </time>
                    )}
                  </div>
                  <p className="text-base-regular whitespace-pre-wrap text-ui-fg-base">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-regular text-ui-fg-subtle">
              Aún no hay comentarios aprobados en este artículo.
            </p>
          )}
        </section>
      </div>
    </article>
  )
}

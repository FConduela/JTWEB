import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils"

import BlogModuleService from "../../../modules/blog/service"

type CreatePostBody = {
  title?: string
  content?: string
  is_published?: boolean
  image_url?: string | null
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "post",
    fields: [
      "id",
      "title",
      "slug",
      "content",
      "image_url",
      "is_published",
      "created_at",
    ],
    pagination: {
      order: {
        created_at: "DESC",
      },
    },
  })

  return res.status(200).json({ posts: data })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { title, content, is_published, image_url } = (req.body ??
    {}) as CreatePostBody

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El campo title es requerido."
    )
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El campo content es requerido."
    )
  }

  const slug = slugify(title.trim())

  if (!slug) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "No se pudo generar un slug válido a partir del título."
    )
  }

  const blogService: BlogModuleService = req.scope.resolve("blog")

  const post = await blogService.createPosts({
    title: title.trim(),
    slug,
    content: content.trim(),
    is_published: Boolean(is_published),
    image_url: image_url ?? null,
  })

  return res.status(200).json({ post })
}

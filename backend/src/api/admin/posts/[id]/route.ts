import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils"

import BlogModuleService from "../../../../modules/blog/service"

type UpdatePostBody = {
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

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { title, content, is_published, image_url } = (req.body ?? {}) as UpdatePostBody

  const blogService: BlogModuleService = req.scope.resolve("blog")

  const updateData: {
    id: string
    title?: string
    slug?: string
    content?: string
    is_published?: boolean
    image_url?: string | null
  } = { id }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        "El campo title es requerido."
      )
    }

    const slug = slugify(title.trim())

    if (!slug) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        "No se pudo generar un slug válido a partir del título."
      )
    }

    updateData.title = title.trim()
    updateData.slug = slug
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      throw new MedusaError(
        MedusaErrorTypes.INVALID_DATA,
        "El campo content es requerido."
      )
    }

    updateData.content = content.trim()
  }

  if (is_published !== undefined) {
    updateData.is_published = Boolean(is_published)
  }

  if (image_url !== undefined) {
    updateData.image_url = image_url ?? null
  }

  const updatedPost = await blogService.updatePosts(updateData)

  return res.status(200).json({ post: updatedPost })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const blogService: BlogModuleService = req.scope.resolve("blog")

  await blogService.deletePosts(id)

  return res.status(200).json({
    id,
    object: "post",
    deleted: true,
  })
}

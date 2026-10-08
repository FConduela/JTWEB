import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils"

import BlogModuleService from "../../../../../modules/blog/service"

type CreateCommentBody = {
  content?: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
  const { content } = (req.body ?? {}) as CreateCommentBody
  const customerId = (
    req as MedusaRequest & {
      auth_context?: { actor_id?: string | null }
    }
  ).auth_context?.actor_id

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Debes iniciar sesión para comentar.",
    })
  }

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El campo content es requerido."
    )
  }

  const query = req.scope.resolve("query")
  const blogService: BlogModuleService = req.scope.resolve("blog")

  const { data: posts } = await query.graph({
    entity: "post",
    fields: ["id"],
    filters: {
      slug,
      is_published: true,
    },
  })

  const post = posts?.[0] as { id: string } | undefined

  if (!post) {
    throw new MedusaError(
      MedusaErrorTypes.NOT_FOUND,
      `No se encontró el artículo con slug "${slug}".`
    )
  }

  await blogService.createComments({
    post_id: post.id,
    content: content.trim(),
    customer_id: customerId,
  })

  return res.status(200).json({
    success: true,
    message: "Comentario enviado para moderación",
  })
}

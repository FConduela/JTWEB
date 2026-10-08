import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import BlogModuleService from "../../../../modules/blog/service"

type UpdateCommentBody = {
  is_approved?: boolean
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { is_approved } = (req.body ?? {}) as UpdateCommentBody

  const blogService: BlogModuleService = req.scope.resolve("blog")

  const comment = await blogService.updateComments({
    id,
    is_approved: Boolean(is_approved),
  })

  return res.status(200).json({ comment })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const blogService: BlogModuleService = req.scope.resolve("blog")

  await blogService.deleteComments(id)

  return res.status(200).json({
    id,
    object: "comment",
    deleted: true,
  })
}

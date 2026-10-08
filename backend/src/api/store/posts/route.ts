import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "post",
    fields: ["id", "title", "slug", "content", "image_url", "created_at"],
    filters: {
      is_published: true,
    },
  })

  return res.status(200).json({ posts: data })
}

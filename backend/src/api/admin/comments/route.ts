import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "comment",
    fields: [
      "id",
      "content",
      "is_approved",
      "customer_id",
      "created_at",
      "post.*",
    ],
    pagination: {
      order: {
        created_at: "DESC",
      },
    },
  })

  return res.status(200).json({ comments: data })
}

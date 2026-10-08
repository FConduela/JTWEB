import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "post",
    fields: ["id", "title", "slug", "content", "image_url", "created_at", "comments.*"],
    filters: {
      slug,
      is_published: true,
    },
  })

  if (!data?.length) {
    throw new MedusaError(
      MedusaErrorTypes.NOT_FOUND,
      `No se encontró el artículo con slug "${slug}".`
    )
  }

  const post = data[0] as {
    comments?: Array<{
      customer_id?: string | null
      [key: string]: unknown
    }>
    [key: string]: unknown
  }

  if (post.comments?.length) {
    const customerIds = [
      ...new Set(
        post.comments
          .map((comment) => comment.customer_id)
          .filter((id): id is string => Boolean(id))
      ),
    ]

    const customerMap = new Map<
      string,
      { first_name?: string | null; last_name?: string | null }
    >()

    if (customerIds.length) {
      const customerModule = req.scope.resolve("customer") as {
        listCustomers: (filters: {
          id: string[]
        }) => Promise<
          Array<{
            id: string
            first_name?: string | null
            last_name?: string | null
          }>
        >
      }

      const customers = await customerModule.listCustomers({ id: customerIds })

      for (const customer of customers) {
        customerMap.set(customer.id, customer)
      }
    }

    post.comments = post.comments.map((comment) => {
      const customer = comment.customer_id
        ? customerMap.get(comment.customer_id)
        : null

      const authorName =
        customer?.first_name || customer?.last_name
          ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim()
          : "Usuario registrado"

      return {
        ...comment,
        author_name: authorName,
      }
    })
  }

  return res.status(200).json({ post })
}

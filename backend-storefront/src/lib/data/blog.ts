"use server"

import { revalidateTag } from "next/cache"

import { getAuthHeaders } from "./cookies"

export type BlogComment = {
  id: string
  content: string
  is_approved: boolean
  customer_id: string | null
  created_at?: string
  author_name?: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  image_url?: string | null
  created_at: string
  comments?: BlogComment[]
}

export async function getPosts(): Promise<BlogPost[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/posts`,
    {
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      next: { tags: ["posts"] },
    }
  )

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as { posts: BlogPost[] }
  return data.posts ?? []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/posts/${slug}`,
    {
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      next: { tags: ["posts"] },
    }
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { post: BlogPost }
  return data.post ?? null
}

export async function addComment(slug: string, content: string) {
  const authHeaders = await getAuthHeaders()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/posts/${slug}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        ...authHeaders,
      },
      body: JSON.stringify({ content }),
    }
  )

  if (response.status === 401) {
    throw new Error("Debes iniciar sesión para comentar.")
  }

  if (!response.ok) {
    throw new Error("No se pudo enviar el comentario.")
  }

  revalidateTag("posts")
}

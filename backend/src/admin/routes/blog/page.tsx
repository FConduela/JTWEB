import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText, PencilSquare, Trash } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  Heading,
  IconButton,
  Input,
  Label,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import { FormEvent, useCallback, useEffect, useState } from "react"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  image_url: string | null
  is_published: boolean
  created_at: string
}

type PostsResponse = {
  posts: Post[]
}

type Comment = {
  id: string
  content: string
  is_approved: boolean
  customer_id: string | null
  created_at: string
  post?: {
    id: string
    title: string
    slug: string
  } | null
}

type CommentsResponse = {
  comments: Comment[]
}

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/admin/posts", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("No se pudieron cargar los artículos.")
      }

      const data = (await response.json()) as PostsResponse
      setPosts(data.posts ?? [])
    } catch {
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true)

    try {
      const response = await fetch("/admin/comments", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("No se pudieron cargar los comentarios.")
      }

      const data = (await response.json()) as CommentsResponse
      setComments(data.comments ?? [])
    } catch {
      setComments([])
    } finally {
      setIsLoadingComments(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    fetchComments()
  }, [fetchPosts, fetchComments])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setImageUrl("")
    setIsPublished(false)
    setEditingPostId(null)
  }

  const openCreateDrawer = () => {
    resetForm()
    setDrawerOpen(true)
  }

  const openEditDrawer = (post: Post) => {
    setEditingPostId(post.id)
    setTitle(post.title)
    setContent(post.content)
    setImageUrl(post.image_url ?? "")
    setIsPublished(post.is_published)
    setDrawerOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)

    if (!open) {
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este artículo?")) {
      return
    }

    const response = await fetch(`/admin/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (response.ok) {
      await fetchPosts()
    }
  }

  const handleApproveComment = async (id: string) => {
    const response = await fetch(`/admin/comments/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_approved: true }),
    })

    if (response.ok) {
      await fetchComments()
    }
  }

  const handleDeleteComment = async (id: string) => {
    const response = await fetch(`/admin/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (response.ok) {
      await fetchComments()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingPostId
        ? `/admin/posts/${editingPostId}`
        : "/admin/posts"

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          is_published: isPublished,
          image_url: imageUrl || null,
        }),
      })

      if (!response.ok) {
        throw new Error("No se pudo guardar el artículo.")
      }

      await fetchPosts()
      resetForm()
      setDrawerOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <Heading level="h1">Gestión de Blog</Heading>
            <Text className="text-ui-fg-subtle">
              Administra los artículos y comentarios del blog de Jugando Toy
              desde este panel.
            </Text>
          </div>

          <Button variant="primary" onClick={openCreateDrawer}>
            Crear nuevo artículo
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h2">Artículos</Heading>

          {isLoading ? (
            <Text className="text-ui-fg-subtle">Cargando artículos...</Text>
          ) : posts.length === 0 ? (
            <Text className="text-ui-fg-subtle">
              No hay artículos creados todavía.
            </Text>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-ui-border-base">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ui-border-base bg-ui-bg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Creado</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-ui-border-base last:border-b-0"
                    >
                      <td className="px-4 py-3">{post.title}</td>
                      <td className="px-4 py-3 text-ui-fg-subtle">
                        {post.slug}
                      </td>
                      <td className="px-4 py-3">
                        {post.is_published ? "Publicado" : "Borrador"}
                      </td>
                      <td className="px-4 py-3 text-ui-fg-subtle">
                        {new Date(post.created_at).toLocaleDateString("es-CL")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <IconButton
                            size="small"
                            variant="transparent"
                            type="button"
                            onClick={() => openEditDrawer(post)}
                          >
                            <PencilSquare />
                          </IconButton>
                          <IconButton
                            size="small"
                            variant="transparent"
                            type="button"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Heading level="h2">Moderación de Comentarios</Heading>

          {isLoadingComments ? (
            <Text className="text-ui-fg-subtle">Cargando comentarios...</Text>
          ) : comments.length === 0 ? (
            <Text className="text-ui-fg-subtle">
              No hay comentarios para moderar.
            </Text>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-ui-border-base">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ui-border-base bg-ui-bg-subtle">
                  <tr>
                    <th className="px-4 py-3 font-medium">Comentario</th>
                    <th className="px-4 py-3 font-medium">Artículo</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="border-b border-ui-border-base last:border-b-0"
                    >
                      <td className="max-w-xs px-4 py-3">
                        <span className="line-clamp-3">{comment.content}</span>
                      </td>
                      <td className="px-4 py-3 text-ui-fg-subtle">
                        {comment.post?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            comment.is_approved
                              ? "rounded-full bg-ui-tag-green-bg px-2 py-1 text-ui-tag-green-text"
                              : "rounded-full bg-ui-tag-orange-bg px-2 py-1 text-ui-tag-orange-text"
                          }
                        >
                          {comment.is_approved ? "Aprobado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {!comment.is_approved && (
                            <Button
                              size="small"
                              variant="secondary"
                              type="button"
                              onClick={() => handleApproveComment(comment.id)}
                            >
                              Aprobar
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="danger"
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              {editingPostId ? "Editar artículo" : "Crear nuevo artículo"}
            </Drawer.Title>
          </Drawer.Header>
          <form onSubmit={handleSubmit}>
            <Drawer.Body className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="post-title">Título</Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Título del artículo"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="post-content">Contenido</Label>
                <Textarea
                  id="post-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Escribe el contenido del artículo..."
                  rows={8}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="post-image">Imagen del Artículo</Label>
                <Input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    const file = event.target.files?.[0]
                    if (!file) return

                    const formData = new FormData()
                    formData.append("files", file)

                    const response = await fetch("/admin/uploads", {
                      method: "POST",
                      credentials: "include",
                      body: formData,
                    })

                    const data = (await response.json()) as {
                      files?: Array<{ url: string }>
                    }

                    if (data.files?.[0]?.url) {
                      setImageUrl(data.files[0].url)
                    }
                  }}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="mt-2 h-20 w-auto rounded-md object-cover"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="post-published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="post-published">Publicado</Label>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </Drawer.Close>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingPostId ? "Actualizar artículo" : "Guardar artículo"}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog",
  icon: DocumentText,
})

export default BlogPage

"use client"

import { addComment } from "@lib/data/blog"
import { useState } from "react"

type CommentFormProps = {
  slug: string
}

const CommentForm = ({ slug }: CommentFormProps) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    if (!content.trim()) {
      setError("Escribe un comentario antes de enviar.")
      return
    }

    setIsSubmitting(true)

    try {
      await addComment(slug, content.trim())
      setContent("")
      setMessage("Comentario enviado. Será visible cuando sea aprobado.")
    } catch {
      setError("No se pudo enviar el comentario. Intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="comment-content" className="text-base-semi">
          Deja un comentario
        </label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe tu comentario..."
          rows={4}
          className="rounded-rounded border border-ui-border-base px-4 py-3 text-base-regular outline-none focus:border-ui-border-interactive"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className="text-small-regular text-ui-fg-error">{error}</p>
      )}

      {message && (
        <p className="text-small-regular text-ui-fg-subtle">{message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-rounded bg-ui-button-neutral px-6 py-2.5 text-small-semi text-ui-fg-on-color transition-colors hover:bg-ui-button-neutral-hover disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar comentario"}
      </button>
    </form>
  )
}

export default CommentForm

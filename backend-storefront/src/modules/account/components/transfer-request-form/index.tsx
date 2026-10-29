"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { IconButton } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"
import Input from "@modules/common/components/input"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-brand-card p-4 md:p-6">
      <div className="grid w-full items-start gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-base font-semibold text-brand-text">
            Vincular un pedido
          </h3>
          <p className="text-sm text-brand-text/80">
            ¿No encuentras una compra? Asóciala a tu cuenta con el identificador
            del pedido.
          </p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-2 sm:items-stretch"
        >
          <Input label="ID del pedido" name="order_id" required />
          <SubmitButton
            variant="secondary"
            className="w-full sm:w-fit sm:self-end !rounded-full !border !border-brand-accent !bg-transparent !text-brand-accent hover:!bg-brand-accent hover:!text-white"
          >
            Solicitar vinculación
          </SubmitButton>
        </form>
      </div>
      {!state.success && state.error && (
        <p className="mt-3 text-right text-sm text-brand-accent">
          {state.error}
        </p>
      )}
      {showSuccess && (
        <div className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-brand-bg/50 p-4">
          <div className="flex items-center gap-x-2">
            <CheckCircleMiniSolid className="h-4 w-4 text-emerald-600" />
            <div className="flex flex-col gap-y-0.5 text-left">
              <p className="text-sm font-medium text-brand-text">
                Solicitud enviada para el pedido {state.order?.id}
              </p>
              <p className="text-sm text-brand-text/70">
                Enviamos un correo a {state.order?.email}
              </p>
            </div>
          </div>
          <IconButton
            variant="transparent"
            className="h-fit shrink-0"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="h-4 w-4 text-brand-text/50" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

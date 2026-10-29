import { Disclosure } from "@headlessui/react"
import { Button, clx } from "@medusajs/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { formatStorefrontError } from "@lib/util/storefront-error"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const editButtonClass =
  "min-h-9 !rounded-full !border !border-brand-accent !bg-transparent !text-brand-accent !shadow-none hover:!bg-brand-accent hover:!text-white"

const saveButtonClass =
  "w-full small:max-w-[160px] !rounded-full !bg-brand-accent !text-white !shadow-sm hover:!bg-[#c91c22]"

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage,
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const resolvedError =
    errorMessage && typeof errorMessage === "string"
      ? formatStorefrontError(errorMessage)
      : "Ocurrió un error. Intenta de nuevo."

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div
      className="rounded-xl border border-gray-200 bg-brand-card p-4 md:p-5"
      data-testid={dataTestid}
    >
      <div className="flex flex-col gap-3 small:flex-row small:items-start small:justify-between">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-text/60">
            {label}
          </span>
          <div className="mt-1 text-sm text-brand-text md:text-base">
            {typeof currentInfo === "string" ? (
              <span className="font-medium" data-testid="current-info">
                {currentInfo || "—"}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          className={editButtonClass}
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Cancelar" : "Editar"}
        </Button>
      </div>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <p className="my-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {label} actualizado correctamente.
          </p>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <p className="my-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {resolvedError}
          </p>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "overflow-visible transition-[max-height,opacity] duration-300 ease-in-out",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-2 border-t border-gray-100 py-4">
            <div>{children}</div>
            <div className="mt-2 flex items-center justify-end">
              <Button
                isLoading={pending}
                className={saveButtonClass}
                type="submit"
                data-testid="save-button"
              >
                Guardar
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo

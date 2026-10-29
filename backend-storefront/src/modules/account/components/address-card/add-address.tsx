"use client"

import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"

import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import useToggleState from "@lib/hooks/use-toggle-state"
import ChileRegionComunaFields from "@modules/common/components/chile-region-comuna-fields"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({
  addresses,
}: {
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={open}
        data-testid="add-address-button"
        className="inline-flex h-11 w-full items-center justify-center gap-2 !rounded-full !border !border-brand-accent !bg-brand-accent !px-6 !text-sm !font-semibold !text-white transition-colors hover:!bg-[#c91c22] hover:!border-[#c91c22] sm:w-auto"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nueva dirección
      </Button>

      <Modal
        isOpen={state}
        close={close}
        size="large"
        data-testid="add-address-modal"
      >
        <Modal.Title>
          <Heading className="mb-2 text-brand-text">Agregar dirección</Heading>
        </Modal.Title>
        <form
          action={formAction}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <input
            type="hidden"
            name="country_code"
            value={DEFAULT_COUNTRY_CODE}
          />
          <Modal.Body>
            <div className="flex w-full min-w-0 flex-col gap-y-2">
              <div className="grid min-w-0 grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2">
                <Input
                  label="Nombre"
                  name="first_name"
                  labelPosition="outside"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Apellido"
                  name="last_name"
                  labelPosition="outside"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Empresa"
                name="company"
                labelPosition="outside"
                data-testid="company-input"
              />
              <ChileRegionComunaFields
                required
                provinceTestId="state-input"
                cityTestId="city-input"
              />
              <Input
                label="Dirección"
                name="address_1"
                labelPosition="outside"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Depto., oficina, etc."
                name="address_2"
                labelPosition="outside"
                data-testid="address-2-input"
              />
              <Input
                label="Código postal"
                name="postal_code"
                labelPosition="outside"
                required
                autoComplete="postal-code"
                data-testid="postal-code-input"
              />
              <Input
                label="Teléfono"
                name="phone"
                labelPosition="outside"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="reset"
              variant="secondary"
              onClick={close}
              className="h-10"
              data-testid="cancel-button"
            >
              Cancelar
            </Button>
            <SubmitButton
              data-testid="save-button"
              className="!rounded-full !bg-brand-accent !text-white hover:!bg-[#c91c22]"
            >
              Guardar
            </SubmitButton>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress

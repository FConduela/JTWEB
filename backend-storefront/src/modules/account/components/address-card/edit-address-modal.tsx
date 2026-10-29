"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import useToggleState from "@lib/hooks/use-toggle-state"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import ChileRegionComunaFields from "@modules/common/components/chile-region-comuna-fields"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

type EditAddressProps = {
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
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

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "flex h-full min-h-[220px] w-full flex-col justify-between rounded-2xl border border-gray-200 bg-brand-card p-5 transition-colors",
          {
            "border-brand-accent ring-1 ring-brand-accent/20": isActive,
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          <Heading
            className="text-left text-base-semi"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          {address.company && (
            <Text
              className="txt-compact-small text-ui-fg-base"
              data-testid="address-company"
            >
              {address.company}
            </Text>
          )}
          <Text className="flex flex-col text-left text-base-regular mt-2">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit />
            Editar
          </button>
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash />}
            Eliminar
          </button>
        </div>
      </div>

      <Modal
        isOpen={state}
        close={close}
        size="large"
        data-testid="edit-address-modal"
      >
        <Modal.Title>
          <Heading className="mb-2 text-brand-text">Editar dirección</Heading>
        </Modal.Title>
        <form
          action={formAction}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <input type="hidden" name="addressId" value={address.id} />
          <input
            type="hidden"
            name="country_code"
            value={DEFAULT_COUNTRY_CODE}
          />
          <Modal.Body>
            <div className="grid w-full min-w-0 grid-cols-1 gap-y-2">
              <div className="grid min-w-0 grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2">
                <Input
                  label="Nombre"
                  name="first_name"
                  labelPosition="outside"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Apellido"
                  name="last_name"
                  labelPosition="outside"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Empresa"
                name="company"
                labelPosition="outside"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <ChileRegionComunaFields
                key={address.id}
                required
                defaultProvince={address.province}
                defaultCity={address.city}
                provinceTestId="state-input"
                cityTestId="city-input"
              />
              <Input
                label="Dirección"
                name="address_1"
                labelPosition="outside"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Depto., oficina, etc."
                name="address_2"
                labelPosition="outside"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <Input
                label="Código postal"
                name="postal_code"
                labelPosition="outside"
                required
                autoComplete="postal-code"
                defaultValue={address.postal_code || undefined}
                data-testid="postal-code-input"
              />
              <Input
                label="Teléfono"
                name="phone"
                labelPosition="outside"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
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

export default EditAddress

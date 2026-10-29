"use client"

import React, { useEffect, useMemo, useActionState } from "react"

import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import ChileRegionComunaFields from "@modules/common/components/chile-region-comuna-fields"
import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const initialState: Record<string, any> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  }

  if (billingAddress) {
    initialState.addressId = billingAddress.id
  }

  const [state, formAction] = useActionState(
    billingAddress ? updateCustomerAddress : addCustomerAddress,
    initialState
  )

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "Sin dirección de facturación"
    }

    return (
      <div className="flex flex-col font-medium" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        {billingAddress.company ? <span>{billingAddress.company}</span> : null}
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>Chile</span>
      </div>
    )
  }, [billingAddress])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <input type="hidden" name="addressId" value={billingAddress?.id} />
      <input
        type="hidden"
        name="country_code"
        value={DEFAULT_COUNTRY_CODE}
      />
      <AccountInfo
        label="Dirección de facturación"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-2">
            <Input
              label="Nombre"
              name="first_name"
              labelPosition="outside"
              defaultValue={billingAddress?.first_name || undefined}
              required
              data-testid="billing-first-name-input"
            />
            <Input
              label="Apellido"
              name="last_name"
              labelPosition="outside"
              defaultValue={billingAddress?.last_name || undefined}
              required
              data-testid="billing-last-name-input"
            />
          </div>
          <Input
            label="Empresa"
            name="company"
            labelPosition="outside"
            defaultValue={billingAddress?.company || undefined}
            data-testid="billing-company-input"
          />
          <ChileRegionComunaFields
            key={billingAddress?.id ?? "new-billing"}
            required
            defaultProvince={billingAddress?.province}
            defaultCity={billingAddress?.city}
            provinceTestId="billing-province-input"
            cityTestId="billing-city-input"
          />
          <Input
            label="Dirección"
            name="address_1"
            labelPosition="outside"
            defaultValue={billingAddress?.address_1 || undefined}
            required
            data-testid="billing-address-1-input"
          />
          <Input
            label="Depto., oficina, etc."
            name="address_2"
            labelPosition="outside"
            defaultValue={billingAddress?.address_2 || undefined}
            data-testid="billing-address-2-input"
          />
          <Input
            label="Código postal"
            name="postal_code"
            labelPosition="outside"
            defaultValue={billingAddress?.postal_code || undefined}
            required
            data-testid="billing-postcal-code-input"
          />
          <Input
            label="Teléfono"
            name="phone"
            type="tel"
            labelPosition="outside"
            autoComplete="tel"
            required
            defaultValue={billingAddress?.phone ?? customer?.phone ?? ""}
            data-testid="billing-phone-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress

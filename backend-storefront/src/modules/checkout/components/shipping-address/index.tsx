import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { resolveRegionAndComuna } from "@lib/constants/chilean-regions"
import ChileRegionComunaFields from "@modules/common/components/chile-region-comuna-fields"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"

const normalizeProvinceCity = (
  province?: string | null,
  city?: string | null
) => {
  const resolved = resolveRegionAndComuna(province, city)

  return {
    province: resolved.region || province || "",
    city: resolved.comuna || city || "",
  }
}

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const initialLocation = normalizeProvinceCity(
    cart?.shipping_address?.province,
    cart?.shipping_address?.city
  )

  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": initialLocation.city,
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || DEFAULT_COUNTRY_CODE,
    "shipping_address.province": initialLocation.province,
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => {
        const location = normalizeProvinceCity(address.province, address.city)

        return {
          ...prevState,
          "shipping_address.first_name": address?.first_name || "",
          "shipping_address.last_name": address?.last_name || "",
          "shipping_address.address_1": address?.address_1 || "",
          "shipping_address.company": address?.company || "",
          "shipping_address.postal_code": address?.postal_code || "",
          "shipping_address.city": location.city,
          "shipping_address.country_code":
            address?.country_code || DEFAULT_COUNTRY_CODE,
          "shipping_address.province": location.province,
          "shipping_address.phone": address?.phone || "",
        }
      })

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <input
        type="hidden"
        name="shipping_address.country_code"
        value={DEFAULT_COUNTRY_CODE}
      />
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hola ${customer.first_name}, ¿quieres usar una de tus direcciones guardadas?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Apellido"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="Dirección"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Empresa (opcional)"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label="Código postal"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <div className="col-span-2">
          <ChileRegionComunaFields
            provinceName="shipping_address.province"
            cityName="shipping_address.city"
            provinceValue={formData["shipping_address.province"]}
            cityValue={formData["shipping_address.city"]}
            onValuesChange={(province, city) => {
              setFormData((prevState) => ({
                ...prevState,
                "shipping_address.province": province,
                "shipping_address.city": city,
              }))
            }}
            required
            provinceTestId="shipping-province-input"
            cityTestId="shipping-city-input"
          />
        </div>
      </div>
      <div className="my-8">
        <Checkbox
          label="La facturación usa la misma dirección de envío"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          title="Ingresa un correo válido."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Teléfono"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress

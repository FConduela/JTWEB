import { HttpTypes } from "@medusajs/types"
import { DEFAULT_COUNTRY_CODE } from "@lib/constants"
import { resolveRegionAndComuna } from "@lib/constants/chilean-regions"
import ChileRegionComunaFields from "@modules/common/components/chile-region-comuna-fields"
import Input from "@modules/common/components/input"
import React, { useState } from "react"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const initialLocation = resolveRegionAndComuna(
    cart?.billing_address?.province,
    cart?.billing_address?.city
  )

  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city":
      initialLocation.comuna || cart?.billing_address?.city || "",
    "billing_address.country_code":
      cart?.billing_address?.country_code || DEFAULT_COUNTRY_CODE,
    "billing_address.province":
      initialLocation.region || cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

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
        name="billing_address.country_code"
        value={DEFAULT_COUNTRY_CODE}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Apellido"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Dirección"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label="Empresa (opcional)"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <Input
          label="Código postal"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <div className="col-span-2">
          <ChileRegionComunaFields
            provinceName="billing_address.province"
            cityName="billing_address.city"
            provinceValue={formData["billing_address.province"]}
            cityValue={formData["billing_address.city"]}
            onValuesChange={(province, city) => {
              setFormData((prevState) => ({
                ...prevState,
                "billing_address.province": province,
                "billing_address.city": city,
              }))
            }}
            required
            provinceTestId="billing-province-input"
            cityTestId="billing-city-input"
          />
        </div>
        <Input
          label="Teléfono"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          data-testid="billing-phone-input"
        />
      </div>
    </>
  )
}

export default BillingAddress

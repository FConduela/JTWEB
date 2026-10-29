"use client"

import {
  chileanRegions,
  getCommunesForRegion,
  resolveRegionAndComuna,
} from "@lib/constants/chilean-regions"
import CatalogStyleSelect from "@modules/common/components/catalog-style-select"
import { useEffect, useMemo, useState } from "react"

export type ChileRegionComunaFieldsProps = {
  provinceName?: string
  cityName?: string
  defaultProvince?: string | null
  defaultCity?: string | null
  provinceValue?: string
  cityValue?: string
  onValuesChange?: (province: string, city: string) => void
  required?: boolean
  provinceTestId?: string
  cityTestId?: string
  className?: string
}

const ChileRegionComunaFields = ({
  provinceName = "province",
  cityName = "city",
  defaultProvince,
  defaultCity,
  provinceValue,
  cityValue,
  onValuesChange,
  required = false,
  provinceTestId = "region-select",
  cityTestId = "comuna-select",
  className = "",
}: ChileRegionComunaFieldsProps) => {
  const isControlled =
    provinceValue !== undefined && cityValue !== undefined

  const initial = useMemo(
    () => resolveRegionAndComuna(defaultProvince, defaultCity),
    [defaultProvince, defaultCity]
  )

  const [selectedRegion, setSelectedRegion] = useState(initial.region)
  const [selectedComuna, setSelectedComuna] = useState(initial.comuna)

  useEffect(() => {
    if (!isControlled) {
      const next = resolveRegionAndComuna(defaultProvince, defaultCity)
      setSelectedRegion(next.region)
      setSelectedComuna(next.comuna)
    }
  }, [defaultProvince, defaultCity, isControlled])

  const resolvedControlled = useMemo(() => {
    if (!isControlled) {
      return null
    }

    return resolveRegionAndComuna(provinceValue, cityValue)
  }, [isControlled, provinceValue, cityValue])

  const region = isControlled
    ? resolvedControlled?.region ?? provinceValue ?? ""
    : selectedRegion
  const comuna = isControlled
    ? resolvedControlled?.comuna ?? cityValue ?? ""
    : selectedComuna

  const regionOptions = useMemo(
    () =>
      chileanRegions.map((entry) => ({
        value: entry.region,
        label: entry.region,
      })),
    []
  )

  const comunaOptions = useMemo(() => {
    return getCommunesForRegion(region).map((commune) => ({
      value: commune,
      label: commune,
    }))
  }, [region])

  const handleRegionChange = (nextRegion: string) => {
    if (isControlled) {
      onValuesChange?.(nextRegion, "")
      return
    }

    setSelectedRegion(nextRegion)
    setSelectedComuna("")
  }

  const handleComunaChange = (nextComuna: string) => {
    if (isControlled) {
      onValuesChange?.(region, nextComuna)
      return
    }

    setSelectedComuna(nextComuna)
  }

  return (
    <div
      className={`grid min-w-0 grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-2 ${className}`}
    >
      <CatalogStyleSelect
        label="Región"
        id={provinceName}
        name={provinceName}
        value={region}
        onChange={handleRegionChange}
        options={regionOptions}
        placeholder="Seleccionar región"
        required={required}
        data-testid={provinceTestId}
      />

      <CatalogStyleSelect
        label="Comuna"
        id={cityName}
        name={cityName}
        value={comuna}
        onChange={handleComunaChange}
        options={comunaOptions}
        placeholder={
          region ? "Seleccionar comuna" : "Selecciona una región primero"
        }
        required={required && Boolean(region)}
        disabled={!region}
        data-testid={cityTestId}
      />
    </div>
  )
}

export default ChileRegionComunaFields

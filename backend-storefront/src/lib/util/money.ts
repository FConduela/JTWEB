import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "es-CL",
}: ConvertToLocaleParams) => {
  const isClp = currency_code?.toLowerCase() === "clp"
  const minDigits = minimumFractionDigits ?? (isClp ? 0 : undefined)
  const maxDigits = maximumFractionDigits ?? (isClp ? 0 : undefined)

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        ...(minDigits !== undefined && { minimumFractionDigits: minDigits }),
        ...(maxDigits !== undefined && { maximumFractionDigits: maxDigits }),
      }).format(amount)
    : amount.toString()
}

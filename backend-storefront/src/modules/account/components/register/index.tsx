"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { formatStorefrontError } from "@lib/util/storefront-error"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const primaryButtonClass =
  "w-full mt-6 !rounded-full !bg-brand-accent !text-white !shadow-sm transition-all duration-200 hover:!bg-[#c91c22] hover:!shadow-md"

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const formError = message ? formatStorefrontError(message) : null

  return (
    <div className="w-full" data-testid="register-page">
      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 md:p-8">
        <h1 className="mb-2 text-xl font-bold text-brand-accent md:text-2xl">
          Crear cuenta
        </h1>
        <p className="mb-6 text-sm text-brand-text/80 md:text-base">
          Regístrate para guardar tus datos, seguir pedidos y comprar con más
          comodidad.
        </p>
        <form className="flex w-full flex-col" action={formAction}>
          <div className="flex w-full flex-col gap-y-2">
            <Input
              label="Nombre"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Apellido"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
            <Input
              label="Correo electrónico"
              name="email"
              required
              type="email"
              autoComplete="email"
              data-testid="email-input"
            />
            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              autoComplete="tel"
              data-testid="phone-input"
            />
            <Input
              label="Contraseña"
              name="password"
              required
              type="password"
              autoComplete="new-password"
              data-testid="password-input"
            />
          </div>
          <ErrorMessage error={formError} data-testid="register-error" />
          <p className="mt-6 text-center text-xs leading-relaxed text-brand-text/80 md:text-sm">
            Al crear tu cuenta aceptas nuestra{" "}
            <LocalizedClientLink
              href="/politicas/privacidad"
              className="font-medium text-brand-accent hover:underline"
            >
              política de privacidad
            </LocalizedClientLink>{" "}
            y los{" "}
            <LocalizedClientLink
              href="/politicas/terminos"
              className="font-medium text-brand-accent hover:underline"
            >
              términos de uso
            </LocalizedClientLink>
            .
          </p>
          <SubmitButton className={primaryButtonClass} data-testid="register-button">
            Registrarme
          </SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-brand-text/80">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="font-semibold text-brand-accent hover:underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register

"use client"

import { login } from "@lib/data/customer"
import { formatStorefrontError } from "@lib/util/storefront-error"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useSearchParams } from "next/navigation"
import { useActionState, useMemo } from "react"

const QUERY_MESSAGES: Record<string, string> = {
  auth_failed:
    "No pudimos iniciar sesión con Google. Intenta de nuevo o usa tu correo y contraseña.",
  missing_token: "Falta el enlace de verificación. Solicita uno nuevo.",
}

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const primaryButtonClass =
  "w-full mt-6 !rounded-full !bg-brand-accent !text-white !shadow-sm transition-all duration-200 hover:!bg-[#c91c22] hover:!shadow-md"

const Login = ({ setCurrentView }: Props) => {
  const searchParams = useSearchParams()
  const queryMessage = searchParams.get("message")
  const queryError = searchParams.get("error")
  const [message, formAction] = useActionState(login, null)

  const bannerMessage = useMemo(() => {
    if (queryMessage) {
      return decodeURIComponent(queryMessage)
    }
    return null
  }, [queryMessage])

  const bannerError = useMemo(() => {
    if (!queryError) {
      return null
    }
    const decoded = decodeURIComponent(queryError)
    return QUERY_MESSAGES[decoded] ?? decoded
  }, [queryError])

  const formError = message ? formatStorefrontError(message) : null

  return (
    <div className="w-full" data-testid="login-page">
      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 md:p-8">
        {bannerMessage && (
          <div
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-800"
            role="status"
            data-testid="login-query-message"
          >
            {bannerMessage}
          </div>
        )}
        {bannerError && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
            role="alert"
            data-testid="login-query-error"
          >
            {bannerError}
          </div>
        )}
        <h1 className="mb-2 text-xl font-bold text-brand-accent md:text-2xl">
          Iniciar sesión
        </h1>
        <p className="mb-6 text-sm text-brand-text/80 md:text-base">
          Accede a tu cuenta para ver pedidos, direcciones y una compra más
          rápida.
        </p>
        <a
          href="/api/auth/google"
          className="mb-6 flex w-full items-center justify-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-section/50"
          data-testid="google-login-button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.183l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Continuar con Google
        </a>
        <div className="mb-6 flex w-full items-center gap-x-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-brand-text/60">o</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <form className="w-full" action={formAction}>
          <div className="flex w-full flex-col gap-y-2">
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              title="Ingresa un correo válido."
              autoComplete="email"
              required
              data-testid="email-input"
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              data-testid="password-input"
            />
          </div>
          <ErrorMessage error={formError} data-testid="login-error-message" />
          <SubmitButton
            data-testid="sign-in-button"
            className={primaryButtonClass}
          >
            Entrar
          </SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-brand-text/80">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="font-semibold text-brand-accent hover:underline"
            data-testid="register-button"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login

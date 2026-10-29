import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-brand-section/40 px-3 py-2.5">
      <h2 className="text-sm font-semibold text-brand-text">
        ¿Ya tienes una cuenta?
      </h2>
      <LocalizedClientLink
        href="/account"
        data-testid="sign-in-button"
        className="inline-flex shrink-0 min-h-8 items-center justify-center rounded-full border border-brand-accent px-4 py-1 text-xs font-semibold text-brand-accent transition-colors hover:bg-brand-accent hover:text-white"
      >
        Iniciar sesión
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt

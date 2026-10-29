import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta para ver pedidos y gestionar tu perfil.",
}

export default function Login() {
  return <LoginTemplate />
}

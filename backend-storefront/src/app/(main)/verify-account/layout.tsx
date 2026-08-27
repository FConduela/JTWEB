import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verificar identidad",
  description:
    "Verifica tu identidad para unificar tu historial de compras en Jugando Toy.",
}

export default function VerifyAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

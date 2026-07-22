import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Roboto } from "next/font/google"
import "styles/globals.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={roboto.variable}>
      <body className="font-sans bg-brand-bg text-brand-text antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

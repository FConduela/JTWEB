import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, MedusaErrorTypes, Modules } from "@medusajs/framework/utils"
import jwt from "jsonwebtoken"

type MergeRequestBody = {
  email?: string
}

const SANDBOX_RECIPIENT = "felipe.c.ramirez@gmail.com"
const STOREFRONT_URL = "http://localhost:8000"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildMergeEmailHtml(email: string, magicLink: string): string {
  const safeEmail = escapeHtml(email)

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Unifica tus compras - Jugando Toy</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 28px 24px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Jugando Toy</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 24px;">
                <h2 style="margin: 0 0 16px; font-size: 20px; color: #1e293b;">Unifica tus compras</h2>
                <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #475569;">
                  Detectamos compras previas como invitado con el correo
                  <strong style="color: #4f46e5;">${safeEmail}</strong>.
                  Para vincular ese historial con tu cuenta de Google, haz clic en el botón de abajo.
                </p>
                <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #64748b;">
                  Este enlace es válido por 15 minutos y solo puede usarse una vez.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 24px;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #4f46e5;">
                      <a href="${magicLink}" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                        Unificar mis cuentas
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                  Si no solicitaste esta acción, puedes ignorar este correo.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = (req.body ?? {}) as MergeRequestBody

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new MedusaError(
      MedusaErrorTypes.INVALID_DATA,
      "El campo email es requerido."
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const jwtSecret = process.env.JWT_SECRET || "supersecret"

  const token = jwt.sign(
    { email: normalizedEmail, purpose: "account_merge" },
    jwtSecret,
    { expiresIn: "15m" }
  )

  const magicLink = `${STOREFRONT_URL}/api/auth/merge?token=${encodeURIComponent(token)}`
  const html = buildMergeEmailHtml(normalizedEmail, magicLink)

  const notificationModuleService = req.scope.resolve(Modules.NOTIFICATION)

  await notificationModuleService.createNotifications({
    to: SANDBOX_RECIPIENT,
    channel: "email",
    template: "account_merge",
    data: {
      subject: "Unifica tus compras en Jugando Toy",
      html,
      email: normalizedEmail,
      magic_link: magicLink,
    },
  })

  return res.status(200).json({
    success: true,
    message: "Correo de fusión enviado",
  })
}

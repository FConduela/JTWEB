import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function nukeAll({ container }: ExecArgs) {
  const authModule = container.resolve(Modules.AUTH)

  const identities = await authModule.listAuthIdentities()

  if (identities.length === 0) {
    console.log("No hay identidades para eliminar.")
    return
  }

  const ids = identities.map((i) => i.id)
  await authModule.deleteAuthIdentities(ids)

  console.log(
    `Bomba nuclear completada: ${ids.length} identidades eliminadas de raíz.`
  )
}

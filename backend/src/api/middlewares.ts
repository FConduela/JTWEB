import {
  authenticate,
  defineMiddlewares,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/auth/link",
      method: "POST",
      middlewares: [
        authenticate("customer", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
  ],
})

import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      authMethodsPerActor: {
        user: ["emailpass"],
        customer: ["emailpass", "google"],
      },
    }
  },
  plugins: [
    {
      resolve: "@nicogorga/medusa-payment-mercadopago",
      options: {
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
      },
    },
  ],
  modules: {
    [Modules.PAYMENT]: {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve:
              "@nicogorga/medusa-payment-mercadopago/providers/mercado-pago",
            id: "mercadopago",
            options: {
              accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
              webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
            },
          },
          {
            resolve: "./src/providers/transbank",
            id: "transbank",
            options: {},
          },
          {
            resolve: "./src/providers/bank-transfer",
            id: "bank_transfer",
            options: {},
          },
        ],
      },
    },
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {},
          },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_AUTH_CALLBACK_URL,
            },
          },
        ],
      },
    },
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
  },
})

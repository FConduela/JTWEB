import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  setAuthAppMetadataStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { MedusaError, Modules } from "@medusajs/framework/utils"

import { resolveCustomerEmailFromProviderIdentities } from "../utils/resolve-auth-identity-email"

type WorkflowInput = {
  auth_identity_id: string
  email?: string
}

const getIdentityEmailStep = createStep(
  "get-identity-email",
  async (
    {
      auth_identity_id,
      email: emailOverride,
    }: { auth_identity_id: string; email?: string },
    { container }
  ) => {
    if (emailOverride?.includes("@")) {
      return new StepResponse(emailOverride.trim().toLowerCase())
    }

    const authModuleService = container.resolve(Modules.AUTH)

    const authIdentity = await authModuleService.retrieveAuthIdentity(
      auth_identity_id,
      {
        relations: ["provider_identities"],
      }
    )

    const email = resolveCustomerEmailFromProviderIdentities(
      authIdentity.provider_identities ?? []
    )

    if (!email) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Couldn't determine the identity's email."
      )
    }

    return new StepResponse(email)
  }
)

const validateCustomerExistsStep = createStep(
  "validate-customer-exists",
  ({
    customers,
    email,
  }: {
    customers: any[]
    email: string
  }) => {
    if (!customers.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No customer found with email ${email}`
      )
    }

    return new StepResponse(customers[0])
  }
)

export const linkCustomerIdentityWorkflow = createWorkflow(
  "link-customer-identity",
  (input: WorkflowInput) => {
    const email = getIdentityEmailStep({
      auth_identity_id: input.auth_identity_id,
      email: input.email,
    })

    const { data: customers } = useQueryGraphStep({
      entity: "customer",
      fields: ["id"],
      filters: {
        email,
      },
    }).config({ name: "get-customer" })

    const customer = validateCustomerExistsStep({
      customers,
      email,
    })

    const stepInput = transform(
      { input, customer },
      ({ input, customer }) => ({
        authIdentityId: input.auth_identity_id,
        actorType: "customer",
        value: customer.id,
      })
    )

    setAuthAppMetadataStep(stepInput)

    return new WorkflowResponse({
      customer_id: customer.id,
    })
  }
)

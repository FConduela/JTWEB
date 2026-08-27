import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components"

type OrderPlacedEmailProps = {
  order_id?: string | number
  first_name?: string
}

export const orderPlacedEmail = ({
  order_id,
  first_name = "Cliente",
}: OrderPlacedEmailProps) => (
  <Html>
    <Head />
        <Preview>{`Tu pedido #${order_id ?? ""} fue confirmado`}</Preview>
    <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}>
      <Container
        style={{
          backgroundColor: "#ffffff",
          margin: "24px auto",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "560px",
        }}
      >
        <Heading style={{ color: "#111111" }}>
          ¡Gracias por tu compra, {first_name}!
        </Heading>
        <Text style={{ color: "#333333", fontSize: "16px" }}>
          Confirmamos que recibimos tu pedido
          {order_id ? ` #${order_id}` : ""}. Te avisaremos cuando esté en camino.
        </Text>
      </Container>
    </Body>
  </Html>
)

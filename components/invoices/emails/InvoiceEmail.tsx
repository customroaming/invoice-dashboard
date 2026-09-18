import { Client, Invoice, InvoiceItem } from "@/types";
import { Body, Container, Heading, Html, Text } from "@react-email/components";

type InvoiceEmailProps = {
  invoice: Invoice;
  client: Client;
  invoiceItems: InvoiceItem[];
};
export default function InvoiceEmail({
  invoice,
  client,
  invoiceItems,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Invoice #{invoice.dateId}</Heading>

          <Text>Hi {client.name},</Text>

          <Text>
            I hope you are well. This invoice contains any fees for anything
            website related for the last month. Your invoice is attached.
          </Text>

          <Text>
            Total: £
            {invoiceItems
              .reduce((sum, item) => sum + item.amount, 0)
              .toFixed(2)}
          </Text>
          <Text>
            Please use #{invoice.dateId} as the reference for your bank
            transfer.
          </Text>
          <Text>
            Kind regards,
            <br /> Will Harper
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

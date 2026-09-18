import InvoicePDF from "@/components/invoices/pdfs/InvoicePDF";
import { Client, Invoice, InvoiceItem } from "@/types";
import { renderToBuffer } from "@react-pdf/renderer";

export type GenerateInvoicePDFProps = {
  theInvoice: Invoice;
  theClient: Client;
  allInvoiceItems: InvoiceItem[];
};

export async function generateInvoicePDF({
  theInvoice,
  theClient,
  allInvoiceItems,
}: GenerateInvoicePDFProps) {
  return renderToBuffer(
    <InvoicePDF
      invoice={theInvoice}
      client={theClient}
      invoiceItems={allInvoiceItems}
    />,
  );
}

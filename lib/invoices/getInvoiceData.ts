import { getInvoice, getInvoiceItems } from "../queries/invoices";
import { GenerateInvoicePDFProps } from "../pdf/generateInvoicePdf";
import { getClient } from "../queries/clients";

export function getInvoiceData(id: number): GenerateInvoicePDFProps {
  const theInvoice = getInvoice(Number(id));
  if (!theInvoice) {
    throw new Error("Invoice Not Found");
  }

  const theClient = getClient(Number(theInvoice?.clientId));
  if (!theClient) {
    throw new Error("Client not found");
  }
  const allInvoiceItems = getInvoiceItems(Number(id));
  return {
    theInvoice,
    theClient,
    allInvoiceItems,
  };
}

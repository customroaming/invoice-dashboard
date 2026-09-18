import InvoiceForm from "./InvoiceForm";
import { createInvoice } from "../actions";
import { getAllClients } from "@/lib/queries/clients";
import { createClient } from "@/app/clients/actions";

export default async function InvoicePage() {
  const allClients = await getAllClients();

  return (
    <InvoiceForm
      clients={allClients}
      createMethodAction={createInvoice}
      createClientAction={createClient}
    />
  );
}

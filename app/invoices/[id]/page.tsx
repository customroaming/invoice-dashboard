import IndividualInvoice from "@/components/invoices/IndividualInvoice";
import { getAllInvoices, getInvoiceItems } from "@/lib/queries/invoices";
import { deleteInvoice, updateInvoiceStatus } from "../actions";

type IndividualInvoicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function IndividualInvoicePage({
  params,
}: IndividualInvoicePageProps) {
  const { id } = await params;
  const allInvoices = getAllInvoices();
  const allInvoiceItems = getInvoiceItems(Number(id));

  return (
    <IndividualInvoice
      updateInvoiceAction={updateInvoiceStatus}
      deleteInvoiceAction={deleteInvoice}
      invoices={allInvoices}
      invoiceItems={allInvoiceItems}
      invoiceId={id}
    />
  );
}

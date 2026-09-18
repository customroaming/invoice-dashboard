import { Invoice } from "@/types";
import { getAllInvoices } from "@/lib/queries/invoices";
import InvoicePageComponent from "@/components/invoices/InvoicePageComponent";
import { hasPaid } from "@/lib/queries/matching";
export default async function Invoices() {
  await hasPaid();
  const invoices = getAllInvoices();
  function isFilteredInvoiceReal(status: Invoice["status"]) {
    const filterInvoices = invoices.filter(
      (invoice) => invoice.invoices.status === status,
    );
    if (filterInvoices.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  return <InvoicePageComponent allInvoices={invoices} />;
}

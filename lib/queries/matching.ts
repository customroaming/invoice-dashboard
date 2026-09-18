import { getAllInvoices, markInvoicePaid } from "./invoices";
import { getDbTransactions } from "@/app/expenses/actions";

export async function hasPaid() {
  const allTransactions = await getDbTransactions();
  const allInvoices = getAllInvoices();
  const unpaidInvoices = allInvoices.filter(
    (invoice) => invoice.invoices.status !== "paid",
  );

  const allIncomingTransactions = allTransactions.filter(
    (transaction) => transaction.amount > 0,
  );

  for (const invoice of unpaidInvoices) {
    for (const transaction of allIncomingTransactions) {
      console.log(transaction.notes + "transaction notes");
      console.log(invoice.invoices.dateId);
      if (invoice.invoices.dateId == transaction.notes) {
        markInvoicePaid(invoice.invoices.id, "paid");
        console.log("paid");
      }
    }
  }
}

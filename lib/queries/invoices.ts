import { clients, invoiceItems, invoices, users } from "@/db/schema";
import { db } from "@/lib/db";
import { Invoice, InvoiceItem } from "@/types";
import { asc, desc, eq, sum } from "drizzle-orm";
export function getAllInvoices() {
  const allInvoices = db
    .select({
      invoices: invoices,
      users: users,
      clients: clients,
      total: sum(invoiceItems.amount),
    })
    .from(invoices)
    .leftJoin(users, eq(invoices.userId, users.id))
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
    .groupBy(invoices.id, clients.id, users.id)
    .orderBy(desc(invoices.dueDate))
    .all();
  return allInvoices.map((invoice) => ({
    ...invoice,
    total:
      invoice.total !== null
        ? Math.round(parseFloat(invoice.total) * 100) / 100
        : null,
  }));
}

export function getInvoiceTotal(invoiceId: number): number {
  const invoiceTotal = db
    .select({ total: sum(invoiceItems.amount) })
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId))
    .get();
  return Number(invoiceTotal?.total ?? 0);
}

export function getInvoiceItems(invoiceId: number): InvoiceItem[] {
  const items = db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId))
    .all();
  return items;
}

export function getInvoice(invoiceId: number) {
  const invoice = db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .get();
  return invoice;
}
export function markInvoicePaid(invoiceId: number, status: Invoice["status"]) {
  db.update(invoices).set({ status }).where(eq(invoices.id, invoiceId)).run();
}

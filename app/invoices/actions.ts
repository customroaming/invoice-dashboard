"use server";
import { clients, invoiceItems, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Invoice, LineItem, NewInvoice } from "@/types";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { generateInvoicePDF } from "@/lib/pdf/generateInvoicePdf";
import { getInvoiceData } from "@/lib/invoices/getInvoiceData";
import { resend } from "@/lib/resend";
import InvoiceEmail from "@/components/invoices/emails/InvoiceEmail";

export async function createInvoice(invoice: NewInvoice, items: LineItem[]) {
  const [inserted] = db.insert(invoices).values(invoice).returning().all();
  db.insert(invoiceItems)
    .values(
      items.map((item) => ({
        ...item,
        invoiceId: inserted.id,
        amount: item.quantity * item.unitPrice,
      })),
    )
    .run();
  revalidatePath("/invoices");
  redirect("/invoices");
}

export async function deleteInvoice(invoiceId: number) {
  db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId)).run();
  db.delete(invoices).where(eq(invoices.id, invoiceId)).run();
  revalidatePath("/invoices");
}
export async function updateInvoiceStatus(
  invoiceId: number,
  status: Invoice["status"],
) {
  db.update(invoices).set({ status }).where(eq(invoices.id, invoiceId)).run();
  revalidatePath("/invoices");
  revalidatePath("/invoices/[id]");
}

export async function getLatestInvoice(clientId: number): Promise<LineItem[]> {
  const lastInvoice = db
    .select()
    .from(invoices)
    .where(eq(invoices.clientId, clientId))
    .orderBy(desc(invoices.createdAt))
    .limit(1)
    .get();

  if (!lastInvoice) return [];

  const items = db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, lastInvoice.id))
    .all();

  return items.map((item) => ({
    type: item.type,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: item.amount,
  }));
}

export async function sendInvoice(invoiceId: number) {
  const data = getInvoiceData(invoiceId);
  const pdf = await generateInvoicePDF(data);
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "",
  ];
  const getMonth = data.theInvoice.createdAt?.getMonth();
  const getMonthName = month[getMonth ?? 12];
  const getYear = data.theInvoice.createdAt?.getFullYear();
  await resend.emails.send({
    from: "will.harper@solira.uk",
    to: data.theClient.email,
    subject: `Website Invoice for ${data.theClient.businessName} • #${data.theInvoice.dateId} • ${getMonthName}-${getYear}`,
    react: InvoiceEmail({
      invoice: data.theInvoice,
      client: data.theClient,
      invoiceItems: data.allInvoiceItems,
    }),
    attachments: [
      {
        filename: `${data.theClient.businessName}-#${data.theInvoice.dateId}.pdf`,
        content: pdf,
      },
    ],
  });
}

"use server";
import { clients, invoiceItems, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { Client, NewClient, NewInvoice } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function createClient(client: NewClient): Promise<number> {
  const result = db
    .insert(clients)
    .values(client)
    .returning({ id: clients.id })
    .get();

  return result.id;
}

export async function updateClient(client: Client) {
  db.update(clients)
    .set({
      name: client.name,
      email: client.email,
      address: client.address,
      businessName: client.businessName,
    })
    .where(eq(clients.id, client.id))
    .run();
  revalidatePath("/clients", "layout");
  revalidatePath("/invoices", "layout");
}

export async function deleteClient(clientId: number) {
  const clientInvoices = db
    .select()
    .from(invoices)
    .where(eq(invoices.clientId, clientId))
    .get();
  if (clientInvoices) {
    throw new Error("Can't delete client with invoices");
  }
  db.delete(clients).where(eq(clients.id, clientId)).run();
  revalidatePath("/clients");
  redirect("/clients");
}

import { clients, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { Client, NewClient, NewInvoice } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createInvoice(invoice: NewInvoice) {
  db.insert(invoices).values(invoice).run();
  revalidatePath("/invoices");
  redirect("/invoices");
}
export async function createClient(client: NewClient): Promise<number> {
  const result = db
    .insert(clients)
    .values(client)
    .returning({ id: clients.id })
    .get();
  revalidatePath("/clients");
  return result.id;
}

export async function getAllClients() {
  return db.select().from(clients).all();
}

export function getClient(clientId: number) {
  const client = db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId))
    .get();
  return client;
}

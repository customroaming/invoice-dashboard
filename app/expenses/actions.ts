"use server";

import { transactions } from "@/db/schema";
import { db } from "@/lib/db";
import { Transaction } from "@/types";
import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDbTransactions(
  id: number = 1,
): Promise<Transaction[]> {
  const allTransactions = db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, id))
    .orderBy(desc(transactions.date))
    .all();

  return allTransactions;
}

export async function updateNotes(notes: string, id: number) {
  db.update(transactions).set({ notes }).where(eq(transactions.id, id)).run();
  revalidatePath("/expenses");
}

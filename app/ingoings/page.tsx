"use server";

import ExpensesList from "@/components/expenses/ExpensesList";
import { getDbTransactions } from "../expenses/actions";
import { syncTransactions } from "@/lib/monzo";

export default async function IngoingsPage() {
  await syncTransactions();
  const transactions = await getDbTransactions();
  return (
    <>
      <ExpensesList isExpense={false} allTransactions={transactions} />
    </>
  );
}

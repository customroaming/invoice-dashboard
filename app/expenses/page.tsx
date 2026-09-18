"use server";

import ExpensesList from "@/components/expenses/ExpensesList";
import { getDbTransactions } from "./actions";
import { syncTransactions } from "@/lib/monzo";

export default async function ExpensesPage() {
  await syncTransactions();
  const transactions = await getDbTransactions();
  return (
    <>
      <ExpensesList isExpense={true} allTransactions={transactions} />
    </>
  );
}

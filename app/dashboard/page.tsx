"use server";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getBalance, getTransactions, syncTransactions } from "@/lib/monzo";
import CurrentBalance from "@/components/dashboard/CurrentBalance";
import { getDbTransactions } from "../expenses/actions";

export default async function App() {
  const amount = formatCurrency(23.2);
  const date = formatDate(new Date());
  await syncTransactions();
  const getAllTransactions = await getDbTransactions();
  const currentBalance = await getBalance();
  return (
    <>
      <CurrentBalance balance={currentBalance} />
      <RecentTransactions transactions={getAllTransactions} />
    </>
  );
}

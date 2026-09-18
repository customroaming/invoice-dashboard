"use client";
import { Transaction } from "@/types";
import { useState } from "react";
import SecondaryButtonOutline from "../ui/SecondaryButtonOutline";
import { updateNotes } from "@/app/expenses/actions";
import TextInput from "../ui/TextInput";

type ExpensesListProps = {
  allTransactions: Transaction[];
  isExpense: boolean;
};
export default function ExpensesList({
  allTransactions,
  isExpense,
}: ExpensesListProps) {
  const expenses = allTransactions.filter((transaction) =>
    isExpense ? transaction.amount < 0 : transaction.amount > 0,
  );
  const categories = [...new Set(expenses.map((e) => e.notes))];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lastTaxYear, setLastTaxYear] = useState(false);

  const filteredExpenses = expenses.filter(
    (e) => selectedCategory === "All" || e.notes === selectedCategory,
  );

  const expensesToShow = lastTaxYear
    ? filteredExpenses.filter(
        (expense) => expense.date > new Date("2026-04-05"),
      )
    : filteredExpenses;

  const expenseTotalSum =
    (expensesToShow.reduce((sum, item) => sum + item.amount, 0) / 100) *
    (isExpense ? -1 : 1);

  return (
    <div className="flex flex-col  gap-4 md:grid md:grid-cols-2">
      <div className="font-manrope text-2xl col-span-2">
        Total {isExpense ? "expenses" : "ingoings"} for {selectedCategory} is £
        {expenseTotalSum}
      </div>
      <div
        className={`${!isExpense ? "hidden" : "flex"} flex-row gap-2 flex-wrap md:col-span-2`}
      >
        <SecondaryButtonOutline
          ctaText="All"
          active={selectedCategory === "All"}
          onClick={() => setSelectedCategory("All")}
        />
        {categories.map((c) => (
          <SecondaryButtonOutline
            key={c}
            ctaText={c!}
            active={c === selectedCategory}
            onClick={() => setSelectedCategory(c ?? "All")}
          />
        ))}
        <SecondaryButtonOutline
          ctaText="Expenses for last tax year"
          onClick={() => setLastTaxYear((prev) => !prev)}
          active={lastTaxYear === true}
        />
      </div>
      {expensesToShow.map((transaction) => {
        const amount = transaction.amount / 100;
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: "Europe/London",
        }).format(transaction.date || new Date());
        return (
          <div
            key={transaction.id}
            className="flex flex-col gap-2 p-4 rounded-2xl border border-outline bg-surfaceContainer flex-wrap w-full font-manrope tracking-tight"
          >
            <div className="flex flex-row gap-4 justify-between">
              <div
                className={`flex flex-row gap-0 items-center text-2xl ${transaction.amount > 0 ? "text-onPaid" : "text-darkText"}`}
              >
                {transaction.amount > 0 ? "+" : "-"}
                <span className={`text-2xl font-semibold `}>
                  £{Math.abs(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <div className="flex flex-row gap-2"></div>
                <p>{transaction.merchantEmoji ?? "💼"}</p>
                <p className="text-lg text-textSecondary">
                  {transaction.merchantName ?? "No Merchant"}
                </p>
              </div>
            </div>
            <p className="font-manrope">{transaction.description}</p>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-md">Note:</label>
              <input
                className="bg-surfaceContainer rounded-lg transition-all border border-outline focus:border-outlineFocus outline-none py-3 px-6 text-lg"
                defaultValue={
                  transaction.notes === "" ? "No Note" : transaction.notes
                }
                onBlur={(e) => updateNotes(e.target.value, transaction.id)}
              />
            </div>
            <div className="flex opacity-75 flex-row font-manrope  gap-2">
              <span>{formattedDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

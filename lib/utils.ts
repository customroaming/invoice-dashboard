export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB");
}

export function getCurrentDate() {
  return;
}

export const invoiceStatuses = ["draft", "paid", "overdue", "sent"];

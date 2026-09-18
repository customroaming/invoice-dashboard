import { getTransactions } from "@/lib/monzo";

export async function GET() {
  const transactions = await getTransactions();
  return Response.json(transactions);
}

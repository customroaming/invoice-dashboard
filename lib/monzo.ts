import { MonzoTransaction } from "@/types";
import { db } from "./db";
import { tokens, transactions } from "@/db/schema";
import { updateTokens } from "./mutations/monzo";

const accountId = process.env.MONZO_ACCOUNT_ID;

function getTokens() {
  const data = db.select().from(tokens).all();
  return data[0];
}

async function refreshMonzoAccessToken(refresh: string) {
  const res = await fetch("https://api.monzo.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.MONZO_CLIENT_ID!,
      client_secret: process.env.MONZO_CLIENT_SECRET!,
      refresh_token: refresh,
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`failed to refresh monzo token: ${error}`);
  }
  const data = await res.json();
  console.log(data);
  updateTokens({
    access: data.access_token,
    refresh: data.refresh_token,
  });
  return data;
}

async function monzoFetch(url: string) {
  const data = getTokens();
  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });
  if (res.status !== 401) {
    return res;
  }
  const tokens = await refreshMonzoAccessToken(data.refreshToken);
  res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  return res;
}

export async function getTransactions(): Promise<MonzoTransaction[]> {
  const res = await monzoFetch(
    `https://api.monzo.com/transactions?account_id=${accountId}&expand[]=merchant`,
  );
  if (!res.ok) {
    const error = await res.json();
    console.log("Monzo error:", error);
    throw new Error(`Monzo API error: ${res.status}`);
  }
  const data = await res.json();

  return data.transactions;
}

export async function getBalance() {
  const res = await monzoFetch(
    `https://api.monzo.com/balance?account_id=${accountId}`,
  );
  if (!res.ok) throw new Error(`Monzo API error: ${res.status}`);
  const data = await res.json();

  return data;
}

export async function syncTransactions() {
  const allTransactions = await getTransactions();
  await db
    .insert(transactions)
    .values(
      allTransactions.map((transaction) => ({
        date: new Date(transaction.created),
        userId: 1,
        amount: transaction.amount,
        description: transaction.description,
        transactionId: transaction.id,
        category: transaction.category,
        notes: transaction.notes === "" ? "Business" : transaction.notes,
        merchantName: transaction.merchant?.name
          ? transaction.merchant?.name
          : "Client",
        merchantEmoji:
          transaction.merchant?.emoji && transaction.merchant?.name
            ? transaction.merchant.emoji
            : "💕",
      })),
    )
    .onConflictDoNothing();
}

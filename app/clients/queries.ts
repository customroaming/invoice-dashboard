import { clients } from "@/db/schema";
import { db } from "@/lib/db";
import { Client } from "@/types";

export function getAllClients(): Client[] {
  const result = db.select().from(clients).all();
  return result;
}

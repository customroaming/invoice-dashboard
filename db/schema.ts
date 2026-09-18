import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const tokens = sqliteTable("tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  address: text("address").notNull(),
  businessName: text("business_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dateId: text("date_id").unique(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  clientId: integer("client_id").references(() => clients.id),
  status: text("status", {
    enum: ["draft", "sent", "paid", "overdue"],
  })
    .notNull()
    .default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  dueDate: integer("due_date", { mode: "timestamp" }),
});

export const invoiceItems = sqliteTable("invoice_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  type: text("type", {
    enum: ["hosting", "work", "domain", "one_off"],
  }).notNull(),
  description: text("").notNull(),
  quantity: real("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull(),
  amount: real("amount").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  transactionId: text("transaction_id").notNull().unique(),
  category: text("category").notNull(),
  notes: text("notes").notNull(),
  merchantName: text("merchant_name"),
  merchantEmoji: text("merchant_emoji"),
});

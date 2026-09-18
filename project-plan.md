# Finance Dashboard — Full Project Plan

---

## What is Drizzle ORM?

Your app needs to store data — invoices, clients, expenses. That data lives in a
database. You could write raw SQL to talk to it:

```typescript
db.run("INSERT INTO invoices (client_name, amount) VALUES (?, ?)", [
  name,
  amount,
]);
```

That works, but you get no TypeScript safety, no autocomplete, and it's easy to
make mistakes. An ORM (Object Relational Mapper) lets you write TypeScript instead:

```typescript
await db.insert(invoices).values({ clientName: name, amount: amount });
```

Drizzle is that ORM. It's chosen over the more popular Prisma because:

- Schema is plain TypeScript — no separate schema language to learn
- Queries look like SQL, which you already know
- Much lighter runtime
- Types are inferred directly from the schema — no code generation step

## What is better-sqlite3?

SQLite is a database that lives in a single file on your machine — perfect for a
single-user self-hosted app. `better-sqlite3` is the Node.js driver that lets your
app talk to that file. Drizzle uses it under the hood.

Unlike most databases, better-sqlite3 is synchronous (no await on queries). This
is fine for SQLite and actually simpler to work with.

---

## Initial Setup

### 1. Scaffold the project

```bash
npx create-next-app@latest finance-dashboard
```

When prompted:

- TypeScript → Yes
- Tailwind → Yes
- App Router → Yes
- src/ directory → No
- import alias → Yes (keep default @/)

```bash
cd finance-dashboard
```

### 2. Install database dependencies

```bash
npm install drizzle-orm better-sqlite3
npm install --save-dev drizzle-kit @types/better-sqlite3
```

- `drizzle-orm` — the ORM itself
- `better-sqlite3` — the SQLite driver
- `drizzle-kit` — CLI tool for generating and running migrations
- `@types/better-sqlite3` — TypeScript types for the driver

### 3. Install other dependencies you'll need later

```bash
npm install resend @react-email/components @react-pdf/renderer
```

Don't worry about configuring these yet — just having them installed means no
interruption when you reach those phases.

### 4. Create the database config file

Create `drizzle.config.ts` in the project root:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./db/finance.db",
  },
});
```

This tells drizzle-kit where your schema lives, where to put migrations,
and where the SQLite file should be created.

### 5. Create the database client

Create `lib/db.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";

const sqlite = new Database("./db/finance.db");
const db = drizzle(sqlite, { schema });

export { db };
```

This is the single instance of the database connection your whole app imports.

### 6. Set up environment variables

Create `.env.local` in the project root:

```
DATABASE_URL=./db/finance.db
MONZO_ACCESS_TOKEN=
RESEND_API_KEY=
```

Create `.env.example` (this gets committed to GitHub, .env.local does not):

```
DATABASE_URL=./db/finance.db
MONZO_ACCESS_TOKEN=
RESEND_API_KEY=
```

Verify `.gitignore` contains `.env.local` — Next.js adds this by default
but worth checking before your first commit.

---

## Folder Structure

Set this up before writing any feature code. Create every folder now even
if most files don't exist yet.

```
finance-dashboard/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — sidebar, fonts, providers
│   ├── page.tsx                  # Redirects to /dashboard
│   ├── globals.css               # Tailwind import + global styles
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard overview
│   │
│   ├── invoices/
│   │   ├── page.tsx              # Invoice list
│   │   ├── new/
│   │   │   └── page.tsx          # New invoice form
│   │   └── [id]/
│   │       └── page.tsx          # Single invoice detail/edit
│   │
│   ├── clients/
│   │   ├── page.tsx              # Client list
│   │   ├── new/
│   │   │   └── page.tsx          # New client form
│   │   └── [id]/
│   │       └── page.tsx          # Client detail + invoice history
│   │
│   ├── expenses/
│   │   └── page.tsx              # Expenses from Monzo
│   │
│   └── api/
│       └── monzo/
│           └── transactions/
│               └── route.ts      # Monzo API proxy
│
├── components/
│   ├── ui/                       # Generic reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   │
│   ├── invoices/                 # Invoice-specific components
│   │   ├── InvoiceTable.tsx
│   │   ├── InvoiceRow.tsx
│   │   └── InvoiceForm.tsx
│   │
│   ├── clients/                  # Client-specific components
│   │   ├── ClientList.tsx
│   │   └── ClientForm.tsx
│   │
│   └── dashboard/                # Dashboard-specific components
│       ├── StatCard.tsx
│       └── RecentTransactions.tsx
│
├── db/
│   ├── schema.ts                 # Drizzle schema — all table definitions
│   ├── finance.db                # SQLite database file (gitignored)
│   └── migrations/               # Generated SQL migrations (committed)
│
├── lib/
│   ├── db.ts                     # Drizzle client instance
│   ├── monzo.ts                  # Monzo API wrapper functions
│   └── utils.ts                  # formatCurrency, formatDate etc.
│
├── types/
│   └── index.ts                  # Shared TypeScript types (inferred from schema)
│
├── scripts/
│   └── seed.ts                   # Populates DB with test data
│
├── .env.local                    # Secrets — never committed
├── .env.example                  # Variable names only — committed
├── drizzle.config.ts             # Drizzle CLI config
└── tsconfig.json                 # TypeScript config
```

Create the folder structure now:

```bash
mkdir -p app/{dashboard,invoices/{new,"[id]"},clients/{new,"[id]"},expenses,api/monzo/transactions}
mkdir -p components/{ui,layout,invoices,clients,dashboard}
mkdir -p db/migrations
mkdir -p lib scripts types
```

---

## Phase Plan with Concrete Tasks

---

### PHASE 0 — Project Setup

**Goal:** Running Next.js project with correct structure and database connected.

- [x] Scaffold with create-next-app (done above)
- [x] Install all dependencies (done above)
- [x] Create folder structure (done above)
- [x] Create `drizzle.config.ts`
- [x] Create `lib/db.ts`
- [x] Create `.env.local` and `.env.example`
- [x] Strip boilerplate from `app/page.tsx` and `app/globals.css`
- [x] Verify the app still runs with `npm run dev`
- [x] First commit to GitHub

**You're done with Phase 0 when:** `npm run dev` works, the folder structure
exists, and the project is on GitHub with no secrets committed.

---

### PHASE 1 — Layout and Navigation Shell

**Goal:** Sidebar, top bar, and empty page stubs for all four views.
Design in Figma first — even rough wireframes.

- [x] Design layout in Figma (sidebar, topbar, content area, mobile nav)
- [x] Create `components/layout/Sidebar.tsx` as a client component
      (needs usePathname for active link state)
- [x] Create `components/layout/TopBar.tsx`
- [x] Update `app/layout.tsx` to include Sidebar and TopBar
- [x] Create stub `page.tsx` for dashboard, invoices, clients, expenses
      (just return a heading for now)
- [x] Add `next/link` navigation in sidebar to all four routes
- [x] Make sidebar collapse to bottom nav on mobile using Tailwind
- [x] Test navigation between all pages

**Concepts this teaches:**

- layout.tsx composition
- Server layout containing a client component (Sidebar needs usePathname)
- next/link vs anchor tags
- Tailwind responsive prefixes in practice

**You're done with Phase 1 when:** You can navigate between all four pages,
the sidebar highlights the active route, and it looks reasonable on mobile.

---

### PHASE 2 — Database Schema

**Goal:** Full Drizzle schema, first migration, seed script with fake data.

Create `db/schema.ts`:

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  clientId: integer("client_id").notNull(),
  amount: real("amount").notNull(),
  status: text("status", {
    enum: ["draft", "sent", "paid", "overdue"],
  })
    .notNull()
    .default("draft"),
  issueDate: integer("issue_date", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
  notes: text("notes"),
});

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  monzoTransactionId: text("monzo_transaction_id").unique(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
});
```

Tasks:

- [x] Write schema as above in `db/schema.ts`
- [x] Run `npx drizzle-kit generate` to create migration SQL
- [x] Run `npx drizzle-kit migrate` to apply it (creates `db/finance.db`)
- [x] Add inferred types to `types/index.ts`:
  ```typescript
  import { invoices, clients, expenses } from "@/db/schema";
  export type Invoice = typeof invoices.$inferSelect;
  export type Client = typeof clients.$inferSelect;
  export type Expense = typeof expenses.$inferSelect;
  export type NewInvoice = typeof invoices.$inferInsert;
  export type NewClient = typeof clients.$inferInsert;
  ```
- [x] Write `scripts/seed.ts` with fake data (1 user, 3 clients, 6 invoices)
- [x] Run seed script: `npx tsx scripts/seed.ts`
- [x] Verify data exists: `npx drizzle-kit studio` opens a browser UI

Add `db/finance.db` to `.gitignore` — never commit the database file:

```
db/finance.db
```

**You're done with Phase 2 when:** `drizzle-kit studio` shows your tables
with seed data in them.

---

### PHASE 3 — Invoices (Full CRUD)

**Goal:** Real invoices from the database, create/edit/delete working.

- [x] Create `lib/utils.ts` with formatCurrency and formatDate helpers
- [x] Build `app/invoices/page.tsx` as a server component that queries DB
- [x] Build `components/invoices/InvoiceTable.tsx` as a client component
- [ ] Build `components/invoices/InvoiceRow.tsx`
- [x] Build `components/ui/Badge.tsx` for status display (paid/unpaid etc.)
- [x] Create `app/invoices/actions.ts` with Server Actions:
  - createInvoice
  - updateInvoice
  - deleteInvoice
  - updateInvoiceStatus
- [x] Build `app/invoices/new/page.tsx` with InvoiceForm
- [x] Build `app/invoices/[id]/page.tsx` for detail/edit view
- [x] Add revalidatePath("/invoices") to all mutations
- [x] Test full create → view → edit → delete flow

**You're done with Phase 3 when:** You can create a real invoice, see it in
the list, change its status, and delete it — all persisting to SQLite.

---

### PHASE 4 — Clients

**Goal:** Client list, detail page, create/edit, invoice history per client.

- [x] Build `app/clients/page.tsx` — server component, query all clients
- [x] Build `components/clients/ClientList.tsx`
- [x] Create `app/clients/actions.ts` with createClient, updateClient
- [x] Build `app/clients/new/page.tsx` with ClientForm
- [x] Build `app/clients/[id]/page.tsx` — client detail + their invoices
      (Drizzle join: select invoices where clientId = params.id)
- [x] Link invoices to clients in the invoice form (select dropdown)

**You're done with Phase 4 when:** Every invoice is linked to a client and
you can view a client's full invoice history on their detail page.

---

### PHASE 5 — Monzo Integration

**Goal:** Live transaction data in the app via Monzo API.

- [x] Add Monzo access token to `.env.local`
- [x] Create `lib/monzo.ts` with typed fetch wrapper:
  ```typescript
  export async function getTransactions(): Promise<MonzoTransaction[]> {
    const res = await fetch("https://api.monzo.com/transactions?...", {
      headers: { Authorization: `Bearer ${process.env.MONZO_ACCESS_TOKEN}` },
    });
    return res.json();
  }
  ```
- [x] Create `app/api/monzo/transactions/route.ts` as a proxy endpoint
- [x] Build `components/dashboard/RecentTransactions.tsx`
- [x] Display recent transactions on the dashboard

Token note: Monzo personal tokens expire after 8 hours. When yours expires,
generate a new one from the Monzo developer playground and update `.env.local`,
then restart the dev server. This is expected behaviour for the personal API.

---

### PHASE 6 — Expenses

**Goal:** Monzo transactions categorised as expenses for tax purposes.

- [x] Build `app/expenses/page.tsx`
- [x] Sync Monzo transactions into the expenses table in SQLite
- [x] Allow manual category override per expense
- [x] Running totals by category
- [x] Tax year filter (April to April for UK self-assessment)

---

### PHASE 7 — PDF and Email

**Goal:** Downloadable invoice PDFs, send invoice via email.

- [x] Build `InvoicePDF` component using @react-pdf/renderer
- [x] Create a Route Handler that generates and returns a PDF buffer
- [x] Add "Download PDF" button to invoice detail page
- [ ] Build `InvoiceEmail` component using @react-email/components
- [ ] Create Server Action that sends email via Resend with PDF attached
- [ ] Add "Send Invoice" button to invoice detail page

---

### PHASE 8 — Dashboard and Polish

**Goal:** Populated dashboard, loading states, error states, mobile polish.

- [ ] Build StatCard components (income this month, outstanding total, etc.)
- [ ] Parallel data fetching with Promise.all in dashboard server component
- [ ] Add loading.tsx files alongside each page.tsx
- [ ] Add error.tsx files alongside each page.tsx
- [ ] Empty states for tables with no data
- [ ] Final mobile responsive pass
- [ ] generateMetadata for page titles

---

### PHASE 9 — Self-Hosting

**Goal:** Running as a persistent service on your Ubuntu home server.

- [ ] `npm run build` on the server
- [ ] Create systemd service file
- [ ] Set up Nginx reverse proxy
- [ ] Configure .env.local on the server (manually, never via git)
- [ ] Test access over local network
- [ ] Test access over VPN

---

## Quick Reference Commands

```bash
npm run dev                  # Start dev server
npx drizzle-kit generate     # Generate migration from schema changes
npx drizzle-kit migrate      # Apply pending migrations
npx drizzle-kit studio       # Open browser UI to inspect database
npx tsx scripts/seed.ts      # Run seed script
npm run build                # Production build
```

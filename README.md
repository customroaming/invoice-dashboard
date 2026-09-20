# Invoice Dashboard

A Next.js 16 freelance/invoice dashboard using Drizzle ORM with SQLite, `better-sqlite3`, and Docker.

## Requirements

This project is intended to run on Linux.

You will need:

- Docker
- Docker Compose
- Node.js 26 / npm (used for database setup and local development)

The Docker image is built from `node:26-slim`.

## Before you start

This repository expects two pieces of private configuration that are not included in the repo:

1. **Environment file** – ask the project owner to send you the required `.env.local` file.
2. **SQLite database** – ask the project owner to send you `db/finance.db` if you want to use the existing database/data.

Do not commit `.env.local` or a database containing private credentials to the repository.

## 1. Clone the repository

```bash
git clone https://github.com/customroaming/invoice-dashboard.git
cd invoice-dashboard
```

## 2. Install Node.js 26

Install Node.js 26 and verify the versions:

```bash
node --version
npm --version
```

The project is built and run in Docker using Node 26 (`node:26-slim`).

## 3. Add the environment file

Ask the project owner for the `.env.local` file and place it in the project root:

```text
invoice-dashboard/
├── .env.local
├── app/
├── components/
├── db/
└── ...
```

The Docker Compose configuration mounts this file into the container at runtime.

## 4. Install project dependencies

From the project root:

```bash
npm install
```

This installs the application dependencies, including Drizzle Kit and `better-sqlite3`.

## 5. Set up the SQLite database

The Drizzle schema lives in:

```text
db/schema.ts
```

and migrations live in:

```text
db/migrations/
```

### Recommended: use the supplied database

For the easiest setup, ask the project owner for the existing:

```text
db/finance.db
```

Copy it into:

```text
db/finance.db
```

This database may already contain application data such as clients, invoices, transactions, and other records.

### Fresh database

If you do not have the existing database, create a fresh one from the checked-in Drizzle migrations:

```bash
npm run db:migrate
```

This creates/applies the database schema defined by the migration files.

Then populate it with sample data:

```bash
npm run db:seed
```

The seed script creates sample application data such as clients. It does not provide your real external service credentials.

## 6. Generate migrations when the schema changes

You normally **do not** need to run this as part of a normal installation.

Run it when `db/schema.ts` has been changed and you want Drizzle to create a new migration:

```bash
npm run db:generate
```

Then apply the migration locally with:

```bash
npm run db:migrate
```

## 7. Recommended: run the app with Docker

The Dockerfile installs dependencies and builds the Next.js application inside the image.

Build the image:

```bash
docker compose build
```

Start the application:

```bash
docker compose up -d
```

Check that the container is running:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f app
```

The app is exposed on port 3000.

Open:

```text
http://localhost:3000
```

or from another device on the same network:

```text
http://<SERVER-LAN-IP>:3000
```

## 8. Docker and SQLite

The Compose file mounts the local `db` directory into the container:

```yaml
volumes:
  - ./db:/app/db
```

This means the container uses:

```text
./db/finance.db
```

as its SQLite database.

Because the database is mounted from the host, recreating the container does not remove the database file.

## 9. Drizzle Studio

Drizzle Studio can be used to inspect and edit the SQLite database.

### Start Studio locally

From the project root:

```bash
npx drizzle-kit studio
```

Then open:

```text
https://local.drizzle.studio
```

### Run Studio against the Docker database

If the app is running in Docker, you can start Studio inside the container:

```bash
docker compose exec app npx drizzle-kit studio --host=0.0.0.0 --port=4983
```

If port `4983` is exposed in `docker-compose.yml`, access it from another device on the LAN through the Drizzle Studio web UI using the server's LAN address.

Only expose port `4983` temporarily when needed. Do not expose Drizzle Studio publicly on the internet.

## 10. Useful npm scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build the production app
npm run start        # Start the production app
npm run lint         # Run ESLint
npm run db:generate  # Generate a migration from schema changes
npm run db:migrate   # Apply pending migrations
npm run db:seed      # Insert sample data
```

## 11. Updating the application

After pulling new code:

```bash
git pull
docker compose build
docker compose up -d
```

If the database schema has changed, make sure the relevant migrations have been created and applied before using the updated application.

For schema development:

```bash
npm run db:generate
npm run db:migrate
```

## 12. Troubleshooting

### `no such table: clients` / `no such table: tokens`

The SQLite database does not contain the expected tables.

Check the database:

```bash
node -e "const Database=require('better-sqlite3'); const db=new Database('./db/finance.db'); console.log(db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all())"
```

If the database is new/empty, run:

```bash
npm run db:migrate
npm run db:seed
```

### `Could not locate the bindings file` for `better-sqlite3`

Reinstall dependencies and rebuild the native module:

```bash
npm install
npm rebuild better-sqlite3
```

If npm is preventing dependency install scripts from running, check the project's `.npmrc` configuration.

### Docker uses the wrong database

Remember that this Compose mount:

```yaml
- ./db:/app/db
```

makes the host database available to the container. Check the host file first:

```bash
ls -lah db/finance.db
```

Then check the database from inside the container:

```bash
docker compose exec app node -e "const Database=require('better-sqlite3'); const db=new Database('./db/finance.db'); console.log(db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all())"
```

## Notes

- Real Monzo access/refresh tokens should not be stored in source control or in the seed script.
- The seed script is for sample application data.
- Ask the project owner for the current `.env.local` and, when needed, the current `db/finance.db`.

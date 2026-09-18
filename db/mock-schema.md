# db tables

## clients

- id (primary-key)
- user-id
- Name
- Email
- Address
- BusinessName
- createdAt

## invoices

- id (primary-key)
- client-id
- amount
- status
- date

## expenses

- id (primary-key)
- user-id
- amount
- category
- monzo-transaction-id
- description
- date

## users

- id (primary-key)
- Name

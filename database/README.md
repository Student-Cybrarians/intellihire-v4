# IntelliHire Database

This directory contains the database bootstrap and local PostgreSQL setup for IntelliHire v4.

## Architecture

- PostgreSQL is the system of record.
- Prisma remains the application ORM and source of truth for the application schema (`/prisma/schema.prisma`).
- `init.sql` provides a PostgreSQL bootstrap for local/container development.
- Production should use a managed PostgreSQL provider and store `DATABASE_URL` only in Vercel Environment Variables.

## Local PostgreSQL

From this directory:

```bash
docker compose up -d
```

The local database is exposed on `localhost:5432` with:

```text
Database: intellihire
User: intellihire
Password: intellihire_dev
```

Use this only for local development. Never use these credentials in production.

## Prisma

From the repository root:

```bash
npm ci
npx prisma generate
npx prisma db push
```

For production, prefer Prisma migrations (`prisma migrate deploy`) once migrations are committed to the repository.

## Vercel

Set this environment variable in Vercel Production:

```text
DATABASE_URL=<managed PostgreSQL connection string>
```

Do not commit `.env`, database passwords, OAuth secrets, or API keys.

## NVIDIA API keys

NVIDIA/Nemotron API keys are application/AI-provider credentials. They are **not database credentials** and must not be placed in this directory or used as `DATABASE_URL`.

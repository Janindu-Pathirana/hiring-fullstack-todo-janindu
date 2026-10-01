# Hiring Fullstack Todo

Nx monorepo with a React client and a NestJS server, installed with pnpm.

## Projects

| Project | Path | Dev URL |
| --- | --- | --- |
| client | `apps/client` | http://localhost:3000 |
| server | `apps/server` | http://localhost:3030/api |

The client proxies `/api` to the server. `GET /api/health` returns `{ "status": "ok" }`.

## Setup

```sh
pnpm install
cp .env.example .env
```

Postgres must already be running on port 5432. The server reads `.env` and connects to the `hiring_fullstack_todo` database.

## Database

Local connection values live in `.env` (see `.env.example`). Create the database once if it does not exist:

```sh
psql -h localhost -p 5432 -d postgres -c "CREATE DATABASE hiring_fullstack_todo"
```

## Run

```sh
pnpm dev
```

That serves both apps. You can also run them separately:

```sh
pnpm nx serve client
pnpm nx serve server
```

## Other commands

```sh
pnpm build
pnpm test
pnpm lint
```

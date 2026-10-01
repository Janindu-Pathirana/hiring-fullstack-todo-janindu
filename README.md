# Hiring Fullstack Todo

Author: Janindu Pathirana

This is an Nx monorepo, installed with pnpm. It has three projects: client, server, and shared-types.

## Projects

### client

`apps/client` is a React project. It contains the frontend logic. You can read more about it in [apps/client/README.md](apps/client/README.md).

### server

`apps/server` is a NestJS project. It is the main backend of the application. It provides the REST API that powers the client, at http://localhost:3030/api. You can read more about it in [apps/server/README.md](apps/server/README.md).

### shared-types

`libs/shared-types` shares the common interfaces between the client and the server. Both projects use those interfaces, so they can communicate with less effort. You can read more about them in [libs/shared-types/README.md](libs/shared-types/README.md).

## Run with Docker

This is the first way to run the application. It needs Docker with Compose. It does not need a local Node install, pnpm, or a Postgres server.

From the repo root:

```sh
pnpm docker:up
```

`pnpm docker:up` is the repo script. It runs `docker compose up --build`. Services start in this order.

- `db` is Postgres 16. The database is `hiring_fullstack_todo` and the user is `todo`. Data is kept in the `pgdata` volume. The next step waits until Postgres is healthy.
- `setup` uses the one-shot [docker/setup.Dockerfile](docker/setup.Dockerfile). It runs `pnpm db:migrate:auth`, `pnpm db:migrate`, and `pnpm db:seed`, then exits. Inside Compose, it reaches Postgres at host `db`.
- `server` is the multi-stage Node image in [apps/server/Dockerfile](apps/server/Dockerfile). It starts with `node main.js` only after that seed finishes, and listens on port 3030.
- `client` is the multi-stage nginx image in [apps/client/Dockerfile](apps/client/Dockerfile). It is built with `VITE_API_URL=http://localhost:3030` and starts after the API health check passes. It serves the app on port 3000.

The client is at http://localhost:3000. The API is at http://localhost:3030/api. The seed already inserted that user's sample todos. Running the stack again does not duplicate those titles.

### Demo login

Username:

```text
demoUser
```

Password:

```text
demoUser123
```

Stop the stack with:

```sh
pnpm docker:down
```

That stops the containers. The `pgdata` volume keeps the database.

## Run locally

This is the second way to run the application.

### What you need

- Node.js 22
- pnpm
- Postgres listening on port 5432

### Setup

1. Install dependencies from the repo root:

```sh
pnpm install
```

2. Copy the example environment file, then update `.env` with your own values:

```sh
cp .env.example .env
```

Open `.env` and set `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, and `DATABASE_URL` to your local Postgres. Set `AUTHKIT_JWT_SECRET` to a long random secret. Set `CLIENT_ORIGIN=http://localhost:3000`.

3. Create the client environment file:

```sh
cp apps/client/.env.example apps/client/.env
```

Set `VITE_API_URL=http://localhost:3030`.

4. Create the Postgres database named in `DATABASE_NAME`. The example name is `hiring_fullstack_todo`:

```sh
psql -h localhost -p 5432 -d postgres -c "CREATE DATABASE hiring_fullstack_todo"
```

5. Create the auth tables, then the todo tables:

```sh
pnpm db:migrate:auth
pnpm db:migrate
```

`pnpm db:migrate:auth` runs AuthKit's `authkit migrate` command. It creates the `auth` and `auth_sessions` tables from `DATABASE_URL`. The server runs that same migration again when it starts.

6. Seed a demo user and sample todos:

```sh
pnpm db:seed
```

`pnpm db:seed` reads the root `.env`. It needs `DATABASE_URL` and `AUTHKIT_JWT_SECRET`. It registers the demo user below. If that username already exists, it logs in as that user instead.

Username:

```text
demoUser
```

Password:

```text
demoUser123
```

It then inserts 30 todos for that user: 15 with status `done` and 15 with status `in_progress`. A todo is skipped when that user already has the same title, so running the command again does not duplicate rows. Only the title and status are set. The description stays empty.

7. Run the client and the server together:

```sh
pnpm dev
```

The client is at http://localhost:3000. The API is at http://localhost:3030/api.

Run one app at a time with:

```sh
pnpm client:dev
pnpm client:server
```

## Other commands

```sh
pnpm build
pnpm test
pnpm lint
```

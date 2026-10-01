# server

The server is the NestJS REST API.

From the repo root:

```sh
pnpm client:server
```

The API is served at http://localhost:3030/api. The global prefix is `api`. The process listens on `PORT`, or 3030 when `PORT` is unset.

The root `.env` supplies Postgres (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_URL`), `AUTHKIT_JWT_SECRET`, and `CLIENT_ORIGIN`. CORS allows that origin, or `http://localhost:3000` when it is unset.

The application uses one PostgreSQL database for both records. TypeORM stores todo rows. AuthKit stores user and session rows through the same `DATABASE_URL`.

## Scripts

Every script is in the root `package.json` and is run with `pnpm` from the repo root.

- `pnpm dev` starts the client and the server together.
- `pnpm client:dev` starts only the client at http://localhost:3000.
- `pnpm client:server` starts only the server at http://localhost:3030/api.
- `pnpm build` builds the client and the server.
- `pnpm test` runs the client and server test suites.
- `pnpm lint` lints the workspace.
- `pnpm db:migrate` applies the TypeORM todo migrations.
- `pnpm db:migrate:auth` applies the AuthKit migrations. See Auth migrations.
- `pnpm db:revert` reverts the last TypeORM migration.
- `pnpm db:seed` loads the root `.env`, ensures the demo user exists, and inserts any sample todos that are missing. See Seed.
- `pnpm docker:up` builds and starts Postgres, the setup container, the API, and the client.
- `pnpm docker:down` stops those containers. The `pgdata` volume keeps the database.

## Docker

[apps/server/Dockerfile](apps/server/Dockerfile) is a multi-stage image. The first stage builds the NestJS app. The second stage runs `node main.js` on port 3030. That image does not apply the todo migrations.

In Compose, [docker/setup.Dockerfile](docker/setup.Dockerfile) runs `pnpm db:migrate:auth`, `pnpm db:migrate`, and `pnpm db:seed` after Postgres is healthy. The API container starts only after that setup container exits. AuthKit still migrates when the API process starts.

## Auth migrations

`pnpm db:migrate:auth` runs the AuthKit CLI command `authkit migrate` from [`@janindu-pathirana/authkit`](https://www.npmjs.com/package/@janindu-pathirana/authkit). That package is a custom library by Janindu Pathirana. Its CLI reads `DATABASE_URL` from the environment or from the root `.env`.

The command creates and updates the auth records: the `auth` table and the `auth_sessions` table. It does not touch the todo tables. Run it after installing or upgrading AuthKit, and before `pnpm db:seed`, so the demo user has a place to be stored. Running it again is safe: AuthKit skips migrations that are already applied.

The server also runs these migrations when it starts. `pnpm db:seed` runs them before it registers the demo user. `pnpm db:migrate:auth` is the way to apply them without starting the API.

## Seed

`pnpm db:seed` runs `apps/server/src/scripts/seed.ts`. Importing the data source loads the root `.env`. The script needs `DATABASE_URL` and `AUTHKIT_JWT_SECRET`.

It opens AuthKit, runs the auth migrations, and registers the demo user below. If that username is already taken, it logs in as that user instead.

Username:

```text
demoUser
```

Password:

```text
demoUser123
```

It then inserts 30 todos for that user: 15 with status `done` and 15 with status `in_progress`. A todo is skipped when that user already has the same title, so running the script again does not duplicate rows. Titles and statuses are the only fields set. Description stays null, and Postgres fills the id and timestamps.

The script prints how many todos were inserted. A failure prints the error and exits with a non-zero code.

## Architecture

The server is a NestJS application built as a modular monolith: one process, not a set of separate services. Auth, todos, and the dashboard are modules inside that process. Each module has its own controller and service, and they share one PostgreSQL database.

The author chose NestJS rather than Express so the API stays cleaner and more organized.

- Modules group related code instead of one growing route file.
- Controllers own the HTTP routes. Services own the business logic. Guards own access checks.
- Dependency injection wires those pieces together.
- Decorators declare routes, request validation, and the Bearer-token guard in one place.
- TypeScript is the default, so request bodies and shared contracts stay typed.
- The global validation pipe rejects unknown fields without custom middleware on every route.

Express can serve the same HTTP API, but the structure of modules, validation, and authorization would be assembled by hand. NestJS provides that structure so the codebase stays consistent as routes are added.

## Stack

Modules: app, auth, todo, and dashboard.

- NestJS for the HTTP API
- TypeORM against Postgres, with `synchronize` off
- AuthKit for users, password hashing, sessions, and access-token verification
- MessageBuilder for consistent API responses
- A global `ValidationPipe`: whitelist, forbid unknown fields, and transform
- `@hiring-fullstack-todo-janindu/shared-types` for the shared request contracts

## Author packages

Both packages are custom libraries built by Janindu Pathirana.

[`@janindu-pathirana/authkit`](https://www.npmjs.com/package/@janindu-pathirana/authkit) owns authentication. `AuthKitService` creates one client from `DATABASE_URL` and `AUTHKIT_JWT_SECRET`, connects, and runs AuthKit migrations on startup. The auth module calls `register`, `loginWithSession`, `refresh`, and `logout`. The guard calls `verifyAccessToken` on the Bearer token. The impact is that the server does not implement password hashing, user storage, sessions, or JWT signing itself. AuthKit stores users and sessions, hashes passwords, issues the access and refresh tokens, and rejects bad credentials, expired tokens, and rate-limited calls. The server only maps those errors to HTTP status codes.

[`@janindu-pathirana/message-builder`](https://www.npmjs.com/package/@janindu-pathirana/message-builder) is also custom-built by the author. Services and controllers construct it with a resource name (`user`, `todo`, or `dashboard`) and use it for success, not-found, unauthorized, conflict, validation, and unexpected-error text. The impact is that API responses use the same wording instead of ad hoc strings.

## Shared types

Request and response shapes live in `@hiring-fullstack-todo-janindu/shared-types`. Server DTOs implement those interfaces. The client imports the same interfaces, so both sides use one contract for register, login, refresh, logout, todo create, list, get, and update, plus `TodoStatus` and the dashboard counts.

## Tests

Each endpoint has unit tests. Controller specs cover the route handlers. Service specs cover the behavior behind them, including success, validation failures, unauthorized access, not found, and unexpected errors. `pnpm test` runs those suites.

## Data model

Both sets of records live in the same Postgres database.

AuthKit owns the auth records: `auth` (uuid `id`, unique `username`, `password`, `created_at`, `deleted_at`) and `auth_sessions` (`user_id` references `auth`, refresh-token hash, expiry, revocation). Deleting a user cascades to sessions and todos.

`todo_status.id` is a text primary key. The rows are `in_progress` and `done`.

TypeORM owns the todo records in `todo`. Columns: uuid `id` (`gen_random_uuid()`), `title` text required, `description` text nullable, `status` text required default `in_progress` and a foreign key to `todo_status`, `user_id` uuid required and a foreign key to `auth(id)` with `ON DELETE CASCADE`, `created_at` and `updated_at` timestamptz default `now()`, `deleted_at` timestamptz nullable. Index: `todo_user_id_idx`.

`pnpm db:migrate` creates and updates the todo tables. `pnpm db:revert` undoes the last todo migration. `pnpm db:migrate:auth` creates and updates the auth tables. The server runs the same AuthKit migrations again when it starts.

## Authentication

Public:

- `POST /api/auth/register` body `username` (trimmed, 1–64) and `password` (8–72). Returns the user without the password. A taken username is 409.
- `POST /api/auth/login` body `username` (trimmed, 1–64) and `password` (max 72). Returns the access token, refresh token, expiries, session id, and user. Bad credentials are 401.
- `POST /api/auth/refresh` body `refreshToken`. Returns a new session. An expired, revoked, or unknown session is 401.
- `POST /api/auth/logout` body `refreshToken`. Revokes that session.

Invalid username or password length is 400. Rate limiting is 429. Other AuthKit failures are 500.

Todo and dashboard routes require `Authorization: Bearer <accessToken>`. The token `sub` is the owner. A missing, invalid, or expired token is 401.

## Todos

Every todo route uses that owner. A missing id, another user's id, or a row with `deleted_at` set is 404. `id` must be a UUID.

- `POST /api/todo` body `title` (trimmed, required, max 200) and optional `description` (trimmed, max 2000; blank becomes null). Status defaults to `in_progress`. Returns the created todo.
- `GET /api/todo` query `page` (default 1) and `limit` (default 6, max 50). Returns non-deleted todos, newest first, plus `page`, `limit`, `total`, `totalPages`, and `completed`.
- `GET /api/todo/:id` returns one todo.
- `PATCH /api/todo/:id` writes only the sent fields: `title`, `description`, `status` (`TodoStatus`: `in_progress` or `done`). An empty body is 400. `id` and `userId` cannot be set. A blank description becomes null. `updatedAt` is set to now.
- `DELETE /api/todo/:id` sets `deletedAt` and returns the todo. The row stays in the database.

## Dashboard

`GET /api/dashboard` returns `{ available, deleted, completed, inProgress }` for the authenticated user. Available means `deletedAt` is null. Deleted means `deletedAt` is set. Completed is `done` and not deleted. In progress is `in_progress` and not deleted. Available equals in progress plus completed.

## Other routes

`GET /api` returns `{ "message": "Hello API" }`. `GET /api/health` returns `{ "status": "ok" }`. Both are public.

Unknown body fields are rejected with 400. Unexpected failures are 500.

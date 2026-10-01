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

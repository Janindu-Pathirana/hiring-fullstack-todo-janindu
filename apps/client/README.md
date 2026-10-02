# client

The client is the application frontend: a React application built with Vite.

From the repo root:

```sh
pnpm client:dev
```

The application is served at http://localhost:3000. `apps/client/.env` sets `VITE_API_URL=http://localhost:3030`.

## Docker

[apps/client/Dockerfile](apps/client/Dockerfile) is two stages. Node runs `nx build client`. Then `nginx:alpine` serves `dist/apps/client` on port 3000. [apps/client/nginx.conf](apps/client/nginx.conf) falls back to `index.html` for client routes. `VITE_API_URL` is a build argument and defaults to `http://localhost:3030`.

Compose publishes port 3000 after the API health check passes. The full stack command is `pnpm docker:up` from the repo root.

## Stack

- HeroUI as the component library
- Tailwind CSS for styling
- React Router for client-side routing
- Axios as the HTTP client
- TanStack Query for server-state management
- Heroicons for icons
- react-hook-form, Zod, and @hookform/resolvers for form validation on the login, registration, and task forms
- `@hiring-fullstack-todo-janindu/shared-types` for the request and response contracts shared with the server

## Routes

- `/` dashboard, requires a session
- `/tasks` task list, requires a session
- `/login` and `/register` are public
- any other path is a 404 page

A missing session redirects to `/login`.

## Authentication

Each authenticated request sends a Bearer access token. Login persists the access token, refresh token, and user in localStorage under `auth`. Remember me persists the username separately so the login form can prefill it. An unauthorized response refreshes the access token and retries the request. A failed refresh clears the session. Registration does not start a session; it navigates to login. Logout sends the refresh token to the API, then clears localStorage.

## Todos

A todo has a title, an optional description, and a status of in progress or done. Authenticated users can create, read, update, and delete todos. Create is available on the dashboard and on My Tasks. Opening a task allows editing the title and description, switching the status, or deleting it. The list shows 12 todos per page. Create, update, and delete refresh the task list and the dashboard counts. Deleted todos leave the list and remain in the deleted count.

## Dashboard

The dashboard shows four counts for the signed-in user: available, completed, in progress, and deleted. The sidebar links Dashboard and My Tasks, and shows logout plus the signed-in user.

# shared-types

This library is the contract both apps import as `@hiring-fullstack-todo-janindu/shared-types`. Server DTOs implement these interfaces. The client imports the same interfaces.

- `IRegisterRequestBody`, `ILoginRequestBody`, `IRefreshRequestBody`, `ILogoutRequestBody`
- `ICreateTodoRequestBody`, `IListTodoQuery`, `IGetTodoParams`, `IUpdateTodoRequestBody`
- `TodoStatus`: `in_progress` and `done`
- `IDashboardCounts`: `available`, `deleted`, `completed`, `inProgress`

From the repo root:

```sh
pnpm exec nx build shared-types
```

The build is written to `dist/libs/shared-types`.

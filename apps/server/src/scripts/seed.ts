import {
  createAuthKit,
  isAuthKitError,
} from '@janindu-pathirana/authkit';
import AppDataSource from '../config/data-source';

const DEMO_USERNAME = 'demoUser';
const DEMO_PASSWORD = 'demoUser123';

const TITLES = [
  'Review project brief',
  'Set up local Postgres',
  'Add login and register forms',
  'Hash passwords with AuthKit',
  'Create the todo table',
  'Add the user id foreign key',
  'Build the shared request types',
  'Style the login page',
  'Add the empty-state message',
  'Wire the create-todo form',
  'Validate title length',
  'Return paged list results',
  'Show completed counts',
  'Handle unauthorized responses',
  'Confirm logout clears the session',
  'Sketch the todo list UI',
  'Wire dashboard counts',
  'Write API error handling',
  'Check pagination on the list',
  'Prepare the demo walkthrough',
  'Add edit-todo support',
  'Filter the list by status',
  'Soft-delete a todo',
  'Refresh an expired session',
  'Show validation errors on the form',
  'Add a loading state',
  'Test the register conflict case',
  'Document the local setup',
  'Check mobile layout',
  'Review the seed data',
];

type TodoStatus = 'done' | 'in_progress';

function randomStatus(): TodoStatus {
  return Math.random() < 0.5 ? 'done' : 'in_progress';
}

async function ensureDemoUser() {
  const connectionString = process.env.DATABASE_URL;
  const jwtSecret = process.env.AUTHKIT_JWT_SECRET;

  if (!connectionString || !jwtSecret) {
    throw new Error('DATABASE_URL and AUTHKIT_JWT_SECRET are required.');
  }

  const auth = createAuthKit({ connectionString, jwtSecret });
  await auth.connect();

  try {
    await auth.migrate();

    try {
      return await auth.register(DEMO_USERNAME, DEMO_PASSWORD);
    } catch (error) {
      if (isAuthKitError(error) && error.code === 'USERNAME_TAKEN') {
        return await auth.login(DEMO_USERNAME, DEMO_PASSWORD);
      }
      throw error;
    }
  } finally {
    await auth.close();
  }
}

async function seedTodos(userId: string) {
  const todos = TITLES.map((title) => ({
    title,
    status: randomStatus(),
  }));

  await AppDataSource.initialize();

  try {
    const existing: { title: string }[] = await AppDataSource.query(
      'SELECT title FROM todo WHERE user_id = $1 AND title = ANY($2)',
      [userId, TITLES],
    );
    const existingTitles = new Set(existing.map((row) => row.title));
    let inserted = 0;

    for (const todo of todos) {
      if (existingTitles.has(todo.title)) {
        await AppDataSource.query(
          `UPDATE todo
           SET status = $1, updated_at = now()
           WHERE user_id = $2 AND title = $3 AND deleted_at IS NULL`,
          [todo.status, userId, todo.title],
        );
        continue;
      }

      await AppDataSource.query(
        `INSERT INTO todo (title, status, user_id)
         VALUES ($1, $2, $3)`,
        [todo.title, todo.status, userId],
      );
      inserted += 1;
    }

    const done = todos.filter((todo) => todo.status === 'done').length;
    return { inserted, done, inProgress: todos.length - done };
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

async function main() {
  const user = await ensureDemoUser();
  const { inserted, done, inProgress } = await seedTodos(user.id);
  console.log(
    `Seeded ${DEMO_USERNAME}. Inserted ${inserted} todos. ${done} done, ${inProgress} in progress.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

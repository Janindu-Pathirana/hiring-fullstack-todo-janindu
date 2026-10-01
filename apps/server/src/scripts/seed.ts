import {
  createAuthKit,
  isAuthKitError,
} from '@janindu-pathirana/authkit';
import AppDataSource from '../config/data-source';

const DEMO_USERNAME = 'demoUser';
const DEMO_PASSWORD = 'demoUser123';

const TODOS: { title: string; status: 'done' | 'in_progress' }[] = [
  { title: 'Review project brief', status: 'done' },
  { title: 'Set up local Postgres', status: 'done' },
  { title: 'Add login and register forms', status: 'done' },
  { title: 'Hash passwords with AuthKit', status: 'done' },
  { title: 'Create the todo table', status: 'done' },
  { title: 'Add the user id foreign key', status: 'done' },
  { title: 'Build the shared request types', status: 'done' },
  { title: 'Style the login page', status: 'done' },
  { title: 'Add the empty-state message', status: 'done' },
  { title: 'Wire the create-todo form', status: 'done' },
  { title: 'Validate title length', status: 'done' },
  { title: 'Return paged list results', status: 'done' },
  { title: 'Show completed counts', status: 'done' },
  { title: 'Handle unauthorized responses', status: 'done' },
  { title: 'Confirm logout clears the session', status: 'done' },
  { title: 'Sketch the todo list UI', status: 'in_progress' },
  { title: 'Wire dashboard counts', status: 'in_progress' },
  { title: 'Write API error handling', status: 'in_progress' },
  { title: 'Check pagination on the list', status: 'in_progress' },
  { title: 'Prepare the demo walkthrough', status: 'in_progress' },
  { title: 'Add edit-todo support', status: 'in_progress' },
  { title: 'Filter the list by status', status: 'in_progress' },
  { title: 'Soft-delete a todo', status: 'in_progress' },
  { title: 'Refresh an expired session', status: 'in_progress' },
  { title: 'Show validation errors on the form', status: 'in_progress' },
  { title: 'Add a loading state', status: 'in_progress' },
  { title: 'Test the register conflict case', status: 'in_progress' },
  { title: 'Document the local setup', status: 'in_progress' },
  { title: 'Check mobile layout', status: 'in_progress' },
  { title: 'Review the seed data', status: 'in_progress' },
];

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
  await AppDataSource.initialize();

  try {
    const titles = TODOS.map((todo) => todo.title);
    const existing: { title: string }[] = await AppDataSource.query(
      'SELECT title FROM todo WHERE user_id = $1 AND title = ANY($2)',
      [userId, titles],
    );
    const existingTitles = new Set(existing.map((row) => row.title));
    const missing = TODOS.filter((todo) => !existingTitles.has(todo.title));

    for (const todo of missing) {
      await AppDataSource.query(
        `INSERT INTO todo (title, status, user_id)
         VALUES ($1, $2, $3)`,
        [todo.title, todo.status, userId],
      );
    }

    return missing.length;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

async function main() {
  const user = await ensureDemoUser();
  const inserted = await seedTodos(user.id);
  console.log(`Seeded ${DEMO_USERNAME}. Inserted ${inserted} todos.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

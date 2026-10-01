import { Button } from '@heroui/react';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Window } from '../../common/window';

type TaskStatus = 'in_progress' | 'done';

type TaskCard = {
  title: string;
  description: string;
  status: TaskStatus;
  due: string;
  dueIcon: 'clock' | 'calendar';
};

const statusLabel: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  done: 'Done',
};

const statusClassName: Record<TaskStatus, string> = {
  in_progress: 'bg-blue-50 text-blue-600',
  done: 'bg-emerald-50 text-emerald-600',
};

const tasks: TaskCard[] = [
  {
    title: 'Finalize Q3 Marketing Pitch',
    description:
      "Review the final slide deck with the design team and ensure all financial metrics are accurate before tomorrow's meeting.",
    status: 'in_progress',
    due: 'Today 5:00 PM',
    dueIcon: 'clock',
  },
  {
    title: 'Update User Onboarding Flow',
    description:
      'Implement the new hero UI components into the registration and login screens as per the latest Figma designs.',
    status: 'in_progress',
    due: 'Tomorrow',
    dueIcon: 'calendar',
  },
  {
    title: 'Weekly Sync with Frontend',
    description:
      'Discuss the upcoming sprint priorities, address technical debt, and plan out the refactoring for the notification module.',
    status: 'in_progress',
    due: 'Oct 4th',
    dueIcon: 'calendar',
  },
  {
    title: 'Client Kickoff Call',
    description:
      'Initial meeting with the ACME Corp stakeholders to discuss project scope and timeline expectations.',
    status: 'done',
    due: 'Completed Today',
    dueIcon: 'calendar',
  },
  {
    title: 'Renew Domain Registrations',
    description:
      'Check Namecheap for expiring domains in the next 30 days and setup auto-renewal for core business domains.',
    status: 'in_progress',
    due: 'Oct 12th',
    dueIcon: 'calendar',
  },
  {
    title: 'Draft Blog Post',
    description:
      'Write a 1500-word draft about modern UI/UX principles, specifically focusing on the new Hero UI trends and soft layouts.',
    status: 'in_progress',
    due: 'Next Week',
    dueIcon: 'calendar',
  },
];

export function TasksPage() {
  return (
    <Window>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            You&apos;ve got{' '}
            <span className="font-medium text-sky-600">3 tasks</span> complete.
          </p>
        </div>
        <Button
          color="primary"
          radius="lg"
          startContent={<PlusIcon aria-hidden className="h-4 w-4" />}
        >
          New Task
        </Button>
      </header>
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {tasks.map((task) => {
          const DueIcon = task.dueIcon === 'clock' ? ClockIcon : CalendarIcon;
          const done = task.status === 'done';
          return (
            <article
              key={task.title}
              className={`rounded-2xl px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${
                done ? 'bg-emerald-50/70' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    done
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {done ? <CheckIcon className="h-3.5 w-3.5" /> : null}
                </span>
                <div className="min-w-0">
                  <h2
                    className={`text-sm font-semibold ${
                      done ? 'text-emerald-700 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName[task.status]}`}
                >
                  {statusLabel[task.status]}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <DueIcon aria-hidden className="h-3.5 w-3.5" />
                  {task.due}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </Window>
  );
}

export default TasksPage;

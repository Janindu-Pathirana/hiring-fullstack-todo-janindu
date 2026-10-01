import { Button } from '@heroui/react';
import {
  CheckCircleIcon,
  PlusIcon,
  Square3Stack3DIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Window } from '../../common/window';
import { StatCard } from './stat-card';

const stats = [
  {
    label: 'Total Tasks',
    value: '42',
    icon: Square3Stack3DIcon,
    iconClassName: 'bg-sky-50 text-sky-500',
  },
  {
    label: 'Completed',
    value: '28',
    icon: CheckCircleIcon,
    iconClassName: 'bg-emerald-50 text-emerald-500',
  },
  {
    label: 'Deleted',
    value: '5',
    icon: TrashIcon,
    iconClassName: 'bg-rose-50 text-rose-400',
  },
];

export function DashboardPage() {
  return (
    <Window>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s a quick overview of your progress.
          </p>
        </div>
        <Button
          color="primary"
          radius="lg"
          startContent={<PlusIcon aria-hidden className="h-4 w-4" />}
        >
          Create New Task
        </Button>
      </header>
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
    </Window>
  );
}

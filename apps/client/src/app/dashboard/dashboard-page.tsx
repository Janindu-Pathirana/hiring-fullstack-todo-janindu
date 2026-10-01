import { useState } from 'react';
import { Button } from '@heroui/react';
import {
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  Square3Stack3DIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { readErrorMessage } from '../../util/read-error-message';
import { Window } from '../../components/common/window';
import { useDashboardCounts } from '../../service/use-dashboard.service';
import { StatCard } from '../../components/dashboard/stat-card';
import { CreateTaskDialog } from '../../components/todo/create-task-dialog';

export function DashboardPage() {
  const dashboard = useDashboardCounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const counts = dashboard.data?.counts;
  const countLabel = (count: number | undefined) =>
    dashboard.isPending || count === undefined ? '—' : String(count);

  const stats = [
    {
      label: 'Total Tasks',
      value: countLabel(counts?.available),
      icon: Square3Stack3DIcon,
      iconClassName: 'bg-sky-50 text-sky-500',
    },
    {
      label: 'Completed',
      value: countLabel(counts?.completed),
      icon: CheckCircleIcon,
      iconClassName: 'bg-emerald-50 text-emerald-500',
    },
    {
      label: 'In Progress',
      value: countLabel(counts?.inProgress),
      icon: ClockIcon,
      iconClassName: 'bg-amber-50 text-amber-500',
    },
    {
      label: 'Deleted',
      value: countLabel(counts?.deleted),
      icon: TrashIcon,
      iconClassName: 'bg-rose-50 text-rose-400',
    },
  ];

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
          onPress={() => setIsCreateOpen(true)}
        >
          Create New Task
        </Button>
      </header>
      {dashboard.isError ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {readErrorMessage(dashboard.error)}
        </p>
      ) : null}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <CreateTaskDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </Window>
  );
}

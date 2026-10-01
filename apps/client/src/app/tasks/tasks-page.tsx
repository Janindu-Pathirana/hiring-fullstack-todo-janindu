import { useState } from 'react';
import { Button, Card, CardBody, Pagination } from '@heroui/react';
import { CheckIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TodoStatus } from '@hiring-fullstack-todo-janindu/shared-types';
import type { TodoListItem } from '../../api/todo.api';
import { readErrorMessage } from '../../common/read-error-message';
import { Window } from '../../common/window';
import { useTodos } from '../../service/use-todo.service';
import { CreateTaskDialog } from '../dashboard/create-task-dialog';
import { TaskDetailsDialog } from './task-details-dialog';

const statusLabel: Record<TodoStatus, string> = {
  [TodoStatus.InProgress]: 'In Progress',
  [TodoStatus.Done]: 'Done',
};

const statusClassName: Record<TodoStatus, string> = {
  [TodoStatus.InProgress]: 'bg-blue-50 text-blue-600',
  [TodoStatus.Done]: 'bg-emerald-50 text-emerald-600',
};

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function TasksPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TodoListItem | null>(null);
  const todosQuery = useTodos(page);
  const todos = todosQuery.data?.todos ?? [];
  const completed = todosQuery.data?.completed;
  const totalPages = todosQuery.data?.totalPages ?? 0;
  const completedLabel =
    todosQuery.isPending || completed === undefined ? '—' : String(completed);

  return (
    <Window>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              You&apos;ve got{' '}
              <span className="font-medium text-sky-600">
                {completedLabel} tasks
              </span>{' '}
              complete.
            </p>
          </div>
          <Button
            color="primary"
            radius="lg"
            startContent={<PlusIcon aria-hidden className="h-4 w-4" />}
            onPress={() => setIsCreateOpen(true)}
          >
            New Task
          </Button>
        </header>
        {todosQuery.isError ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {readErrorMessage(todosQuery.error)}
          </p>
        ) : null}
        {todosQuery.isPending ? (
          <p className="mt-8 text-sm text-slate-500">Loading tasks…</p>
        ) : null}
        {todosQuery.isSuccess && todosQuery.data.total === 0 ? (
          <p className="mt-8 text-sm text-slate-500">No tasks yet.</p>
        ) : null}
        {todos.length > 0 ? (
          <section className="mt-8 grid w-full gap-4 lg:grid-cols-3">
              {todos.map((task) => {
                const done = task.status === TodoStatus.Done;
                const status = done ? TodoStatus.Done : TodoStatus.InProgress;
                return (
                  <Card
                    key={task.id}
                    isPressable
                    onPress={() => setSelectedTask(task)}
                    shadow="sm"
                    className={`w-full ${done ? 'bg-emerald-50/70' : 'bg-white'}`}
                  >
                    <CardBody className="px-5 py-5 text-left">
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
                            done
                              ? 'text-emerald-700 line-through'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h2>
                        {task.description ? (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {task.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName[status]}`}
                      >
                        {statusLabel[status]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <ClockIcon aria-hidden className="h-3.5 w-3.5" />
                        Created at {formatCreatedAt(task.createdAt)}
                      </span>
                    </div>
                    </CardBody>
                  </Card>
                );
              })}
            </section>
          ) : null}
        {todosQuery.isSuccess && totalPages >= 1 ? (
          <div className="mt-auto flex justify-center pt-8">
            <Pagination
              page={page}
              total={totalPages}
              onChange={setPage}
              color="primary"
              showControls
            />
          </div>
        ) : null}
      </div>
      <CreateTaskDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={() => setPage(1)}
      />
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={selectedTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null);
          }
        }}
        onDeleted={() => {
          if (todos.length === 1 && page > 1) {
            setPage(page - 1);
          }
        }}
      />
    </Window>
  );
}

export default TasksPage;

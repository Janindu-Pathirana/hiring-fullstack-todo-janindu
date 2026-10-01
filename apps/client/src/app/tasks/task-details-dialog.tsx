import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TodoStatus } from '@hiring-fullstack-todo-janindu/shared-types';
import type { TodoListItem } from '../../api/todo.api';
import { readErrorMessage } from '../../common/read-error-message';
import { useDeleteTodo, useUpdateTodo } from '../../service/use-todo.service';

const statusLabel: Record<TodoStatus, string> = {
  [TodoStatus.InProgress]: 'In Progress',
  [TodoStatus.Done]: 'Done',
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

type TaskDetailsDialogProps = {
  task: TodoListItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function TaskDetailsDialog({
  task,
  isOpen,
  onOpenChange,
  onDeleted,
}: TaskDetailsDialogProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [notice, setNotice] = useState<string | null>(null);
  const done = task?.status === TodoStatus.Done;
  const nextStatus = done ? TodoStatus.InProgress : TodoStatus.Done;

  function close() {
    setNotice(null);
    onOpenChange(false);
  }

  function onStatus() {
    if (!task) {
      return;
    }
    setNotice(null);
    updateTodo.mutate(
      { id: task.id, body: { status: nextStatus } },
      {
        onSuccess: close,
        onError: (error) => {
          setNotice(readErrorMessage(error));
        },
      },
    );
  }

  function onDelete() {
    if (!task) {
      return;
    }
    setNotice(null);
    deleteTodo.mutate(task.id, {
      onSuccess: () => {
        close();
        onDeleted();
      },
      onError: (error) => {
        setNotice(readErrorMessage(error));
      },
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setNotice(null);
        }
        onOpenChange(open);
      }}
      placement="center"
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-slate-900">
              Task details
            </span>
            {task ? (
              <span className="text-sm font-normal text-slate-500">
                {statusLabel[done ? TodoStatus.Done : TodoStatus.InProgress]}
                {' · '}
                Created at {formatCreatedAt(task.createdAt)}
              </span>
            ) : null}
          </div>
          <Button
            isIconOnly
            color="danger"
            variant="light"
            aria-label="Delete"
            onPress={onDelete}
            isLoading={deleteTodo.isPending}
            isDisabled={updateTodo.isPending}
          >
            <TrashIcon aria-hidden className="h-5 w-5" />
          </Button>
        </ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="Title"
            labelPlacement="outside"
            placeholder="Enter a task title"
            variant="bordered"
            value={task?.title ?? ''}
            isReadOnly
          />
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Add a description"
            variant="bordered"
            minRows={3}
            value={task?.description ?? ''}
            isReadOnly
          />
          {notice ? (
            <p className="text-sm text-danger" role="alert">
              {notice}
            </p>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={close}
            isDisabled={updateTodo.isPending || deleteTodo.isPending}
          >
            Cancel
          </Button>
          <Button
            color={done ? 'primary' : 'success'}
            startContent={<CheckIcon aria-hidden className="h-4 w-4" />}
            onPress={onStatus}
            isLoading={updateTodo.isPending}
            isDisabled={deleteTodo.isPending}
          >
            {done ? 'Change to In Progress' : 'Mark as Done'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

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
import { z } from 'zod';
import type { TodoListItem } from '../../api/todo.api';
import { readErrorMessage } from '../../util/read-error-message';
import { useDeleteTodo, useUpdateTodo } from '../../service/use-todo.service';

const editTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000),
});

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
  onUpdated: (values: { title: string; description: string | null }) => void;
};

export function TaskDetailsDialog({
  task,
  isOpen,
  onOpenChange,
  onDeleted,
  onUpdated,
}: TaskDetailsDialogProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const [notice, setNotice] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const done = task?.status === TodoStatus.Done;
  const nextStatus = done ? TodoStatus.InProgress : TodoStatus.Done;
  const savingDetails = isEditing && updateTodo.isPending;

  function close() {
    setNotice(null);
    setIsEditing(false);
    onOpenChange(false);
  }

  function onEdit() {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setNotice(null);
    setIsEditing(true);
  }

  function onSave() {
    if (!task) {
      return;
    }
    const parsed = editTaskSchema.safeParse({ title, description });
    if (!parsed.success) {
      setNotice(parsed.error.issues[0]?.message ?? 'Title is required');
      return;
    }
    setNotice(null);
    updateTodo.mutate(
      {
        id: task.id,
        body: {
          title: parsed.data.title,
          description: parsed.data.description,
        },
      },
      {
        onSuccess: () => {
          onUpdated({
            title: parsed.data.title,
            description: parsed.data.description
              ? parsed.data.description
              : null,
          });
          setIsEditing(false);
          setNotice(null);
        },
        onError: (error) => {
          setNotice(readErrorMessage(error));
        },
      },
    );
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
          setIsEditing(false);
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
            isDisabled={updateTodo.isPending || savingDetails}
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
            value={isEditing ? title : (task?.title ?? '')}
            onValueChange={setTitle}
            isReadOnly={!isEditing}
          />
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Add a description"
            variant="bordered"
            minRows={3}
            value={isEditing ? description : (task?.description ?? '')}
            onValueChange={setDescription}
            isReadOnly={!isEditing}
          />
          {notice ? (
            <p className="text-sm text-danger" role="alert">
              {notice}
            </p>
          ) : null}
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button
            variant="light"
            onPress={close}
            isDisabled={updateTodo.isPending || deleteTodo.isPending}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="bordered"
              onPress={isEditing ? onSave : onEdit}
              isLoading={savingDetails}
              isDisabled={
                deleteTodo.isPending || (!isEditing && updateTodo.isPending)
              }
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            <Button
              color={done ? 'primary' : 'success'}
              startContent={<CheckIcon aria-hidden className="h-4 w-4" />}
              onPress={onStatus}
              isLoading={!isEditing && updateTodo.isPending}
              isDisabled={deleteTodo.isPending || savingDetails}
            >
              {done ? 'Change to In Progress' : 'Mark as Done'}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

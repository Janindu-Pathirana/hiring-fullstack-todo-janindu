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
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { readErrorMessage } from '../../util/read-error-message';
import { useCreateTodo } from '../../service/use-todo.service';

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(2000),
});

type CreateTaskValues = z.infer<typeof createTaskSchema>;

type CreateTaskDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

export function CreateTaskDialog({
  isOpen,
  onOpenChange,
  onCreated,
}: CreateTaskDialogProps) {
  const createTodo = useCreateTodo();
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '' },
  });

  function onSubmit(values: CreateTaskValues) {
    setNotice(null);
    createTodo.mutate(
      {
        title: values.title,
        ...(values.description ? { description: values.description } : {}),
      },
      {
        onSuccess: () => {
          reset();
          setNotice(null);
          onOpenChange(false);
          onCreated?.();
        },
        onError: (error) => {
          setNotice(readErrorMessage(error));
        },
      },
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setNotice(null);
        }
        onOpenChange(open);
      }}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-slate-900">
                Create New Task
              </span>
              <span className="text-sm font-normal text-slate-500">
                Add a new task to your list.
              </span>
            </ModalHeader>
            <ModalBody className="gap-4">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Enter a task title"
                    variant="bordered"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Add a description"
                    variant="bordered"
                    minRows={3}
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    isInvalid={fieldState.invalid}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
              {notice ? (
                <p className="text-sm text-danger" role="alert">
                  {notice}
                </p>
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" type="button" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={createTodo.isPending}
              >
                Create Task
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

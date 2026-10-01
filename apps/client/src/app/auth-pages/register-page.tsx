import { useState } from 'react';
import { Button, Input, Link } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon } from '@heroicons/react/24/outline';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router';
import { z } from 'zod';
import { readErrorMessage } from '../../common/read-error-message';
import { AppRoutes } from '../../routes';
import { useRegister } from '../../service/use-auth.service';

const registerSchema = z
  .object({
    username: z.string().trim().min(1, 'Username is required').max(64),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error';
    text: string;
  } | null>(null);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const register = useRegister();

  function onSubmit(values: RegisterFormValues) {
    setNotice(null);
    register.mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: (data) => {
          setNotice({ tone: 'success', text: data.message });
          navigate(AppRoutes.LOGIN);
        },
        onError: (error) => {
          setNotice({ tone: 'error', text: readErrorMessage(error) });
        },
      },
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <UserIcon aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Create an Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join us today! Please fill in your details.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="Username"
                labelPlacement="outside"
                placeholder="Choose a username"
                variant="bordered"
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                autoComplete="username"
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="Password"
                labelPlacement="outside"
                placeholder="Create a password"
                type="password"
                variant="bordered"
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                autoComplete="new-password"
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="Confirm Password"
                labelPlacement="outside"
                placeholder="Confirm your password"
                type="password"
                variant="bordered"
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                autoComplete="new-password"
              />
            )}
          />
          {notice ? (
            <p
              className={`text-center text-sm ${notice.tone === 'error' ? 'text-danger' : 'text-success'}`}
              role="status"
            >
              {notice.text}
            </p>
          ) : null}
          <Button
            color="primary"
            type="submit"
            fullWidth
            isLoading={register.isPending}
          >
            Register
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              as={RouterLink}
              to={AppRoutes.LOGIN}
              size="sm"
              color="primary"
            >
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;

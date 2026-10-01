import { useState } from 'react';
import { Button, Checkbox, Input, Link } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { readErrorMessage } from '../../common/read-error-message';
import { authStorageKey } from '../../common/read-stored-auth';
import { useLogin } from '../../service/use-auth.service';
import { AppRoutes } from '../../routes';
import { Link as RouterLink, useNavigate } from 'react-router';

const rememberedUsernameKey = 'remembered-username';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(64),
  password: z.string().min(1, 'Password is required').max(72),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error';
    text: string;
  } | null>(null);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem(rememberedUsernameKey) ?? '',
      password: '',
      remember: localStorage.getItem(rememberedUsernameKey) !== null,
    },
  });

  const signIn = useLogin();

  function onSubmit(values: LoginFormValues) {
    setNotice(null);
    signIn.mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: (data, body) => {
          localStorage.setItem(
            authStorageKey,
            JSON.stringify({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            }),
          );
          if (values.remember) {
            localStorage.setItem(rememberedUsernameKey, body.username);
          } else {
            localStorage.removeItem(rememberedUsernameKey);
          }
          setNotice({ tone: 'success', text: data.message });
          navigate(AppRoutes.HOME);
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
            <LockClosedIcon aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back! Please enter your details.
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={fieldState.invalid}
                errorMessage={fieldState.error?.message}
                autoComplete="current-password"
              />
            )}
          />
          <div className="flex items-center justify-between">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="sm"
                >
                  Remember me
                </Checkbox>
              )}
            />
            <Link size="sm" color="primary" onPress={() => undefined}>
              Forgot password?
            </Link>
          </div>
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
            isLoading={signIn.isPending}
          >
            Sign in
          </Button>
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              as={RouterLink}
              to={AppRoutes.REGISTER}
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

export default LoginPage;

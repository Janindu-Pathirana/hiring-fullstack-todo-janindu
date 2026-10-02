import { Button } from '@heroui/react';
import {
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Link as RouterLink, useNavigate } from 'react-router';
import { AppRoutes } from '../routes';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white px-8 py-12 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
          <MapPinIcon aria-hidden className="h-7 w-7" />
        </span>
        <p className="mt-6 text-6xl font-bold tracking-tight text-sky-500">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
          Oops! It seems the page you&apos;re looking for has vanished into thin
          air, or the link might be broken.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="bordered"
            radius="lg"
            onPress={() => navigate(-1)}
            startContent={<ArrowLeftIcon aria-hidden className="h-4 w-4" />}
          >
            Go Back
          </Button>
          <Button
            as={RouterLink}
            to={AppRoutes.HOME}
            color="primary"
            radius="lg"
            startContent={<HomeIcon aria-hidden className="h-4 w-4" />}
          >
            Back to Dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;

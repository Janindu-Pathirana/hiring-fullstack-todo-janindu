import { Avatar, Button } from '@heroui/react';
import {
  CheckIcon,
  QueueListIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AppRoutes } from '../../routes';
import { useLogout } from '../../service/use-auth.service';
import { clearStoredAuth, readStoredAuth } from '../../util/read-stored-auth';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const navItems: {
  label: string;
  icon: Icon;
  to: AppRoutes;
}[] = [
  { label: 'Dashboard', icon: Squares2X2Icon, to: AppRoutes.HOME },
  { label: 'My Tasks', icon: QueueListIcon, to: AppRoutes.TASKS },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useLogout();
  const username = readStoredAuth()?.user.username ?? '';

  function leave() {
    clearStoredAuth();
    navigate(AppRoutes.LOGIN);
  }

  function onLogout() {
    const refreshToken = readStoredAuth()?.refreshToken;
    if (!refreshToken) {
      leave();
      return;
    }
    logout.mutate(
      { refreshToken },
      {
        onSuccess: leave,
        onError: leave,
      },
    );
  }

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-3xl bg-white px-4 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:h-full lg:min-h-0 lg:w-64">
      <div className="flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white">
          <CheckIcon aria-hidden className="h-5 w-5" />
        </span>
        <span className="text-base font-semibold text-slate-900">
          TaskMaster
        </span>
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                active ? 'bg-sky-50 text-sky-600' : 'text-slate-500'
              }`}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-sky-500"
                />
              ) : null}
              <Icon aria-hidden className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 px-2 pt-5">
        <Button
          size="sm"
          fullWidth
          variant="light"
          color="danger"
          className="mb-3 border max-w-52 border-red-500"
          onPress={onLogout}
          isLoading={logout.isPending}
        >
          Logout
        </Button>

        <div className="flex items-center gap-3">
          <Avatar name={username} className="h-10 w-10 shrink-0 text-xs" />
          <div>
            <p className="text-sm font-semibold text-slate-900">{username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

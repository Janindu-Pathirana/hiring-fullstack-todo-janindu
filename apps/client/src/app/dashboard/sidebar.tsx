import { Avatar } from '@heroui/react';
import {
  CheckIcon,
  QueueListIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const navItems: { label: string; icon: Icon; active: boolean }[] = [
  { label: 'Dashboard', icon: Squares2X2Icon, active: true },
  { label: 'My Tasks', icon: QueueListIcon, active: false },
];

export function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col rounded-3xl bg-white px-4 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:w-64">
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
          return (
            <button
              key={item.label}
              type="button"
              aria-current={item.active ? 'page' : undefined}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                item.active ? 'bg-sky-50 text-sky-600' : 'text-slate-500'
              }`}
            >
              {item.active ? (
                <span
                  aria-hidden
                  className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-sky-500"
                />
              ) : null}
              <Icon aria-hidden className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 px-2 pt-5">
        <Avatar name="Janinu" className="h-10 w-10 shrink-0 text-xs" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Janinu</p>
        </div>
      </div>
    </aside>
  );
}

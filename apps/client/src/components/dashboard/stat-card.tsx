import type { ComponentType, SVGProps } from 'react';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type StatCardProps = {
  label: string;
  value: string;
  icon: Icon;
  iconClassName: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <article className="rounded-2xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon aria-hidden className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

import type { ReactNode } from 'react';
import { Sidebar } from '../app/dashboard/sidebar';

export function Window({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4">
      <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-6 lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 px-2 py-4 md:px-6">{children}</main>
      </div>
    </div>
  );
}

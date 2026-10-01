import type { ReactNode } from 'react';
import { Sidebar } from '../app/dashboard/sidebar';

export function Window({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <div className="flex min-h-[calc(100vh-2rem)] flex-col gap-6 lg:h-full lg:min-h-0 lg:flex-row">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col px-2 py-4 md:px-6 lg:min-h-0 lg:overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

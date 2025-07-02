
'use client';

import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

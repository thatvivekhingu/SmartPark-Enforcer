'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebarStore } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area – shifts based on sidebar width */}
      <main
        className={cn(
          'flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-250 ease-smooth'
        )}
      >
        {children}
      </main>
    </div>
  );
}

import type { ReactNode } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Topbar } from "@/components/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--border)] bg-[var(--sidebar)] px-4 py-4 md:min-h-screen md:border-b-0 md:border-r md:px-5 md:py-6">
        <div className="mb-4 hidden md:block">
          <p className="text-base font-semibold text-[var(--foreground)]">
            Pampanga Dispatch
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
            Modern web foundation for the legacy Java CLI project.
          </p>
        </div>
        <SidebarNav />
      </aside>
      <div className="min-w-0">
        <Topbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

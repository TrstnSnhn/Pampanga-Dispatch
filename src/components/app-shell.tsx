import type { ReactNode } from "react";
import { MapPinned } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { Topbar } from "@/components/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen text-[var(--foreground)] md:grid md:grid-cols-[264px_1fr]">
      <aside className="border-b border-[oklch(1_0_0/0.1)] bg-[var(--sidebar)] px-4 py-4 text-[var(--accent-foreground)] md:min-h-screen md:border-b-0 md:border-r md:px-5 md:py-6">
        <div className="mb-5 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_10px_24px_oklch(0.18_0.04_140/0.22)]">
              <MapPinned className="size-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.01em]">
                Pampanga Dispatch
              </p>
              <p className="text-xs text-[var(--sidebar-muted)]">
                Local operations console
              </p>
            </div>
          </div>
        </div>
        <SidebarNav />
        <div className="mt-6 hidden rounded-xl border border-[oklch(1_0_0/0.1)] bg-[oklch(1_0_0/0.045)] p-3 text-xs leading-5 text-[var(--sidebar-muted)] md:block">
          Modernized from the preserved Java OOP CLI in{" "}
          <span className="font-medium text-[var(--accent-foreground)]">
            legacy/java-cli
          </span>
          .
        </div>
      </aside>
      <div className="min-w-0">
        <Topbar />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import { CircleDot, Database, Route } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-[var(--border)] bg-[oklch(0.986_0.008_92/0.92)] px-4 backdrop-blur-sm sm:px-6">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Pampanga operations dashboard
        </p>
        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
          Map-first sample workspace, local data, no live routing yet
        </p>
      </div>
      <div className="hidden items-center gap-2 lg:flex">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)]">
          <CircleDot className="size-3.5 text-[var(--accent)]" />
          Pampanga only
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
          <Route className="size-3.5 text-[var(--clay)]" />
          Routing pending
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
          <Database className="size-3.5 text-[var(--map-blue)]" />
          Local data
        </span>
      </div>
    </header>
  );
}

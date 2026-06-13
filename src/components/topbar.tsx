export function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6">
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">
          Phase 1 foundation
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          Local sample data, no routing engine, no database
        </p>
      </div>
      <div className="hidden rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] sm:block">
        Pampanga only
      </div>
    </header>
  );
}

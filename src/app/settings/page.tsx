import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";

const settings = [
  {
    label: "Service area",
    value: "Pampanga only",
    badge: "Configured",
    detail: "Initial sample data is limited to Pampanga cities and municipalities.",
    tone: "success" as const,
  },
  {
    label: "Data source",
    value: "Local sample data",
    badge: "Local",
    detail: "Bookings, drivers, and locations are stored in TypeScript modules.",
    tone: "info" as const,
  },
  {
    label: "Routing",
    value: "Not yet enabled",
    badge: "Later phase",
    detail: "Route drawing and estimates are planned for a later phase.",
    tone: "warning" as const,
  },
  {
    label: "Database",
    value: "Not yet connected",
    badge: "Later phase",
    detail: "Persistence will be decided after the core app model is stable.",
    tone: "warning" as const,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Current project configuration placeholders for the Phase 1 foundation."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {settings.map((setting) => (
          <article
            key={setting.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  {setting.label}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                  {setting.value}
                </p>
              </div>
              <StatusPill tone={setting.tone}>{setting.badge}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
              {setting.detail}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

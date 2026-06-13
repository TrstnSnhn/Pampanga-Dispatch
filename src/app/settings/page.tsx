import { Database, MapPinned, Route, Settings2 } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";

const settings = [
  {
    label: "Service area",
    value: "Pampanga only",
    badge: "Configured",
    detail: "Initial sample data is limited to Pampanga cities and municipalities.",
    tone: "success" as const,
    icon: MapPinned,
  },
  {
    label: "Data source",
    value: "Local sample data",
    badge: "Local",
    detail: "Bookings, drivers, and locations are stored in TypeScript modules.",
    tone: "info" as const,
    icon: Settings2,
  },
  {
    label: "Routing",
    value: "Demo only",
    badge: "OSRM optional",
    detail:
      "The map can request an OSRM demo road route, with straight-line preview as fallback.",
    tone: "info" as const,
    icon: Route,
  },
  {
    label: "Database",
    value: "Not yet connected",
    badge: "Later phase",
    detail: "Persistence will be decided after the core app model is stable.",
    tone: "warning" as const,
    icon: Database,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        eyebrow="Project configuration"
        meta="Scope guardrails"
        description="Current project status for service area, sample data, routing, and persistence."
      />

      <section className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Service area"
          value="1"
          note="Pampanga province"
          icon={MapPinned}
          tone="green"
        />
        <MetricCard
          label="Data mode"
          value="Local"
          note="TypeScript sample data"
          icon={Settings2}
          tone="blue"
        />
        <MetricCard
          label="Routing"
          value="Demo"
          note="OSRM optional"
          icon={Route}
          tone="blue"
        />
        <MetricCard
          label="Database"
          value="Off"
          note="No persistence layer"
          icon={Database}
          tone="clay"
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {settings.map((setting) => (
          <article
            key={setting.label}
            className="pd-card-flat rounded-2xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--muted)] text-[var(--foreground)]">
                  <setting.icon className="size-4" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    {setting.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                    {setting.value}
                  </p>
                </div>
              </div>
              <StatusPill tone={setting.tone} dot>
                {setting.badge}
              </StatusPill>
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

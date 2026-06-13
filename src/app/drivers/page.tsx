import { MapPin, RadioTower, Truck } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getLocationName } from "@/data/pampanga-locations";
import { sampleDrivers } from "@/data/sample-drivers";
import { driverStatusLabels, type DriverStatus } from "@/domain/driver";

const driverStatusTone: Record<
  DriverStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  available: "success",
  busy: "info",
  offline: "neutral",
};

export default function DriversPage() {
  const availableCount = sampleDrivers.filter(
    (driver) => driver.status === "available",
  ).length;
  const busyCount = sampleDrivers.filter((driver) => driver.status === "busy")
    .length;
  const offlineCount = sampleDrivers.filter(
    (driver) => driver.status === "offline",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        eyebrow="Driver resources"
        meta={`${sampleDrivers.length} sample drivers`}
        description="A local roster showing vehicle capacity, current municipality, availability, and active assignment state."
      />

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Available"
          value={availableCount}
          note="Ready for future assignment"
          icon={Truck}
          tone="green"
        />
        <MetricCard
          label="Busy"
          value={busyCount}
          note="Currently tied to a booking"
          icon={RadioTower}
          tone="blue"
        />
        <MetricCard
          label="Offline"
          value={offlineCount}
          note="Not in dispatch pool"
          icon={MapPin}
          tone="clay"
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {sampleDrivers.map((driver) => (
          <article
            key={driver.id}
            className="pd-card-flat rounded-2xl p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[var(--muted)] text-[var(--foreground)]">
                  <Truck className="size-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {driver.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {driver.vehicleType}
                  </p>
                </div>
              </div>
              <StatusPill tone={driverStatusTone[driver.status]} dot>
                {driverStatusLabels[driver.status]}
              </StatusPill>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-[var(--surface-raised)] p-3">
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Current location
                </dt>
                <dd className="mt-1 font-medium text-[var(--foreground)]">
                  {getLocationName(driver.currentLocationId)}
                </dd>
              </div>
              <div className="rounded-xl bg-[var(--surface-raised)] p-3">
                <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                  Active assignment
                </dt>
                <dd className="mt-1 font-medium text-[var(--foreground)]">
                  {driver.activeAssignmentId ?? "None"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

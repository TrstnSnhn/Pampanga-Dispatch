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
  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        description="Sample driver roster with current location, vehicle type, availability, and active assignment state."
      />

      <section className="grid gap-3 lg:grid-cols-2">
        {sampleDrivers.map((driver) => (
          <article
            key={driver.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-base font-semibold text-[var(--foreground)]">
                  {driver.name}
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {driver.vehicleType}
                </p>
              </div>
              <StatusPill tone={driverStatusTone[driver.status]}>
                {driverStatusLabels[driver.status]}
              </StatusPill>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  Current city/municipality
                </dt>
                <dd className="mt-1 font-medium text-[var(--foreground)]">
                  {getLocationName(driver.currentLocationId)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
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

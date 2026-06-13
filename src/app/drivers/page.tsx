"use client";

import { MapPin, RadioTower, Truck } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getLocationName } from "@/data/pampanga-locations";
import { driverStatusLabels, type DriverStatus } from "@/domain/driver";
import { serviceTypeLabels } from "@/domain/service-type";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";

const driverStatusTone: Record<
  DriverStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  available: "success",
  assigned: "info",
  offline: "neutral",
};

export default function DriversPage() {
  const { drivers } = useDispatchDemo();
  const availableCount = drivers.filter(
    (driver) => driver.status === "available",
  ).length;
  const assignedCount = drivers.filter(
    (driver) => driver.status === "assigned",
  ).length;
  const offlineCount = drivers.filter(
    (driver) => driver.status === "offline",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Drivers"
        eyebrow="Driver resources"
        meta={`${drivers.length} local drivers`}
        description="A local roster showing vehicle capacity, service coverage, current municipality, availability, and active assignment state."
      />

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Available"
          value={availableCount}
          note="Ready for local assignment"
          icon={Truck}
          tone="green"
        />
        <MetricCard
          label="Assigned"
          value={assignedCount}
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
        {drivers.map((driver) => (
          <article key={driver.id} className="pd-card-flat rounded-2xl p-4">
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

            <div className="mt-4 flex flex-wrap gap-2">
              {driver.serviceTypes.map((serviceType) => (
                <span
                  key={serviceType}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]"
                >
                  {serviceTypeLabels[serviceType]}
                </span>
              ))}
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

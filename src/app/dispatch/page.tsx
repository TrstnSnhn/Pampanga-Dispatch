import { MapPin, RadioTower, Route, Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ServiceBadge } from "@/components/service-badge";
import { StatusPill } from "@/components/status-pill";
import { getLocationName } from "@/data/pampanga-locations";
import { sampleBookings } from "@/data/sample-bookings";
import { sampleDrivers } from "@/data/sample-drivers";
import { formatPeso } from "@/lib/format";

const pendingBookings = sampleBookings.filter(
  (booking) => booking.status === "pending",
);

const availableDrivers = sampleDrivers.filter(
  (driver) => driver.status === "available",
);

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch"
        eyebrow="Dispatch queue"
        meta={`${pendingBookings.length} pending, ${availableDrivers.length} available`}
        description="Review pending bookings beside available driver resources. Assignment logic is not active yet."
      />

      <section className="pd-card-flat rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning-foreground)]">
              <RadioTower className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Manual review state
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                Phase 3 will add matching rules for service type, vehicle type,
                current location, and availability. This page only previews the
                dispatch queue.
              </p>
            </div>
          </div>
          <StatusPill tone="warning" dot>
            Assignment pending
          </StatusPill>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="pd-card rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Pending bookings
            </h2>
            <StatusPill tone="warning">{pendingBookings.length}</StatusPill>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="grid gap-4 p-4 md:grid-cols-[1fr_1.1fr_1.1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {booking.id}
                  </p>
                  <div className="mt-2">
                    <ServiceBadge serviceType={booking.serviceType} />
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    <MapPin className="size-3.5" strokeWidth={1.8} />
                    Pickup
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {getLocationName(booking.pickupLocationId)}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    <Route className="size-3.5" strokeWidth={1.8} />
                    Drop-off
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {getLocationName(booking.dropOffLocationId)}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Estimate
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                    {formatPeso(booking.priceEstimate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pd-card-flat rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Available drivers
            </h2>
            <StatusPill tone="success">{availableDrivers.length}</StatusPill>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {availableDrivers.map((driver) => (
              <div key={driver.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success-foreground)]">
                      <Truck className="size-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {driver.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {driver.vehicleType}
                      </p>
                    </div>
                  </div>
                  <StatusPill tone="success" dot>
                    Available
                  </StatusPill>
                </div>
                <p className="mt-3 rounded-xl bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
                  Current location: {getLocationName(driver.currentLocationId)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

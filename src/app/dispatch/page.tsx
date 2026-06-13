import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getLocationName } from "@/data/pampanga-locations";
import { sampleBookings } from "@/data/sample-bookings";
import { sampleDrivers } from "@/data/sample-drivers";
import { serviceTypeLabels } from "@/domain/service-type";
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
        description="A simple operations view for pending bookings and available drivers. Assignment rules are planned for a later phase."
      />

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
        <StatusPill tone="warning">Placeholder logic</StatusPill>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
          This page does not assign drivers yet. Phase 3 will add dispatch logic
          that considers service type, vehicle type, current location, and driver
          availability.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Pending bookings
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="grid gap-3 p-4 md:grid-cols-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {booking.id}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {serviceTypeLabels[booking.serviceType]}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    Pickup
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {getLocationName(booking.pickupLocationId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                    Drop-off
                  </p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {getLocationName(booking.dropOffLocationId)}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
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

        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Available drivers
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {availableDrivers.map((driver) => (
              <div key={driver.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {driver.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {driver.vehicleType}
                    </p>
                  </div>
                  <StatusPill tone="success">Available</StatusPill>
                </div>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
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

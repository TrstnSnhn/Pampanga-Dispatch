import { PageHeader } from "@/components/page-header";
import { ServiceBadge } from "@/components/service-badge";
import { StatusPill } from "@/components/status-pill";
import { sampleBookings } from "@/data/sample-bookings";
import { getDriverName } from "@/data/sample-drivers";
import { getLocationName } from "@/data/pampanga-locations";
import {
  dispatchStatusLabels,
  type DispatchStatus,
} from "@/domain/dispatch-status";
import { formatPeso } from "@/lib/format";

const statusTone: Record<
  DispatchStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  pending: "warning",
  assigned: "info",
  "in-progress": "info",
  completed: "success",
  cancelled: "danger",
};

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        eyebrow="Booking review"
        meta={`${sampleBookings.length} sample records`}
        description="Read-only ride, parcel, and food delivery records using local TypeScript sample data."
      />

      <section className="pd-card overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Booking ledger
            </h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              No create or edit flow yet. These rows are sample records.
            </p>
          </div>
          <StatusPill tone="neutral">{sampleBookings.length} total</StatusPill>
        </div>
        <div className="grid gap-3 p-3 md:hidden">
          {sampleBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">
                    {booking.id}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Local sample record
                  </p>
                </div>
                <StatusPill tone={statusTone[booking.status]} dot>
                  {dispatchStatusLabels[booking.status]}
                </StatusPill>
              </div>

              <div className="mt-4">
                <ServiceBadge serviceType={booking.serviceType} />
              </div>

              <div className="mt-4 grid gap-3 rounded-xl bg-[var(--surface-raised)] p-3">
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Pickup
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {getLocationName(booking.pickupLocationId)}
                  </p>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Drop-off
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {getLocationName(booking.dropOffLocationId)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                    Driver
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--foreground)]">
                    {getDriverName(booking.driverId)}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                    Estimate
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--foreground)]">
                    {formatPeso(booking.priceEstimate)}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Booking</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Route points</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Driver</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Estimate
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-[var(--surface-raised)]"
                >
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <p className="font-semibold text-[var(--foreground)]">
                      {booking.id}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Local sample record
                    </p>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <ServiceBadge serviceType={booking.serviceType} />
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--foreground)]">
                    <div className="grid gap-2">
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          Pickup
                        </p>
                        <p className="font-medium">
                          {getLocationName(booking.pickupLocationId)}
                        </p>
                      </div>
                      <div className="h-px w-10 bg-[var(--border)]" />
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          Drop-off
                        </p>
                        <p className="font-medium">
                          {getLocationName(booking.dropOffLocationId)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <StatusPill tone={statusTone[booking.status]} dot>
                      {dispatchStatusLabels[booking.status]}
                    </StatusPill>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 font-medium text-[var(--foreground)]">
                    {getDriverName(booking.driverId)}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-right font-medium text-[var(--foreground)]">
                    {formatPeso(booking.priceEstimate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

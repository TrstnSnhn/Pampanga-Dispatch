import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { sampleBookings } from "@/data/sample-bookings";
import { getDriverName } from "@/data/sample-drivers";
import { getLocationName } from "@/data/pampanga-locations";
import {
  dispatchStatusLabels,
  type DispatchStatus,
} from "@/domain/dispatch-status";
import { serviceTypeLabels } from "@/domain/service-type";
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
        description="Read-only sample bookings for the Phase 1 scaffold. Create, edit, and cancellation flows will come later."
      />

      <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-[var(--muted)] text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Booking ID</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Pickup</th>
                <th className="px-4 py-3 font-semibold">Drop-off</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Driver</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Price estimate
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="border-t border-[var(--border)] px-4 py-4 font-medium text-[var(--foreground)]">
                    {booking.id}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--muted-foreground)]">
                    {serviceTypeLabels[booking.serviceType]}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--foreground)]">
                    {getLocationName(booking.pickupLocationId)}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--foreground)]">
                    {getLocationName(booking.dropOffLocationId)}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <StatusPill tone={statusTone[booking.status]}>
                      {dispatchStatusLabels[booking.status]}
                    </StatusPill>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--muted-foreground)]">
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

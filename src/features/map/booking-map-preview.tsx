import { StatusPill } from "@/components/status-pill";
import type { Booking } from "@/domain/booking";
import { dispatchStatusLabels } from "@/domain/dispatch-status";
import type { PampangaLocation } from "@/domain/location";
import { serviceTypeLabels } from "@/domain/service-type";
import { formatPeso } from "@/lib/format";

type BookingMapPreviewProps = {
  booking: Booking;
  pickupLocation: PampangaLocation;
  dropOffLocation: PampangaLocation;
};

function coordinateText(location: PampangaLocation) {
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

export function BookingMapPreview({
  booking,
  pickupLocation,
  dropOffLocation,
}: BookingMapPreviewProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Booking preview
          </p>
          <h2 className="mt-2 text-base font-semibold text-[var(--foreground)]">
            {booking.id}
          </h2>
        </div>
        <StatusPill tone="warning">Visual preview only</StatusPill>
      </div>

      <dl className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Service
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {serviceTypeLabels[booking.serviceType]}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Status
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {dispatchStatusLabels[booking.status]}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Pickup
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {pickupLocation.name}
          </dd>
          <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
            {coordinateText(pickupLocation)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Drop-off
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {dropOffLocation.name}
          </dd>
          <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
            {coordinateText(dropOffLocation)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
        Price estimate:{" "}
        <span className="font-semibold text-[var(--foreground)]">
          {formatPeso(booking.priceEstimate)}
        </span>
        . Route calculation is not implemented in this phase.
      </p>
    </section>
  );
}

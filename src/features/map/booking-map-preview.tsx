import { MapPin, Route } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { ServiceBadge } from "@/components/service-badge";
import type { Booking } from "@/domain/booking";
import { dispatchStatusLabels } from "@/domain/dispatch-status";
import type { PampangaLocation } from "@/domain/location";
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
    <section className="pd-card-flat rounded-2xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Booking preview
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            {booking.id}
          </h2>
        </div>
        <StatusPill tone="warning" dot>
          Visual preview only
        </StatusPill>
      </div>

      <dl className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-[var(--surface-raised)] p-3">
          <dt className="text-xs font-medium text-[var(--muted-foreground)]">
            Service
          </dt>
          <dd className="mt-2">
            <ServiceBadge serviceType={booking.serviceType} />
          </dd>
        </div>
        <div className="rounded-xl bg-[var(--surface-raised)] p-3">
          <dt className="text-xs font-medium text-[var(--muted-foreground)]">
            Status
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {dispatchStatusLabels[booking.status]}
          </dd>
        </div>
        <div className="rounded-xl bg-[var(--surface-raised)] p-3">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
            <MapPin className="size-3.5" strokeWidth={1.8} />
            Pickup
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {pickupLocation.name}
          </dd>
          <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
            {coordinateText(pickupLocation)}
          </dd>
        </div>
        <div className="rounded-xl bg-[var(--surface-raised)] p-3">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
            <Route className="size-3.5" strokeWidth={1.8} />
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

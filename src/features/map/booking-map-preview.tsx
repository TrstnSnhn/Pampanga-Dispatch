import { Loader2, MapPin, Route } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { ServiceBadge } from "@/components/service-badge";
import type { Booking } from "@/domain/booking";
import { dispatchStatusLabels } from "@/domain/dispatch-status";
import type { PampangaLocation } from "@/domain/location";
import type { RouteResult } from "@/domain/route";
import { formatApproxDistance } from "@/lib/distance";
import { formatPeso } from "@/lib/format";

type BookingMapPreviewProps = {
  booking: Booking;
  pickupLocation: PampangaLocation;
  dropOffLocation: PampangaLocation;
  routePreview: RouteResult;
  isRouteLoading: boolean;
  onCalculateRoute: () => void;
};

function coordinateText(location: PampangaLocation) {
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

export function BookingMapPreview({
  booking,
  pickupLocation,
  dropOffLocation,
  routePreview,
  isRouteLoading,
  onCalculateRoute,
}: BookingMapPreviewProps) {
  const isRoadRoute =
    routePreview.provider === "osrm_demo" && !routePreview.isFallback;
  const routeTone = isRoadRoute
    ? "info"
    : routePreview.errorMessage
      ? "warning"
      : "neutral";

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
        <StatusPill tone={routeTone} dot>
          {isRoadRoute ? "OSRM demo route" : "Visual fallback"}
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
            Estimate
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {formatPeso(booking.priceEstimate)}
          </dd>
          <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
            {formatApproxDistance(booking.estimatedDistanceKm)}
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
        Status:{" "}
        <span className="font-semibold text-[var(--foreground)]">
          {dispatchStatusLabels[booking.status]}
        </span>
        . Booking price remains based on the approximate straight-line estimate.
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Route preview
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {routePreview.sourceLabel}
              </p>
            </div>
            <StatusPill tone={routeTone}>
              {isRoadRoute ? "Road reference" : "Approximate"}
            </StatusPill>
          </div>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                Distance shown
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {isRoadRoute
                  ? `${routePreview.distanceKm.toFixed(1)} km road distance`
                  : formatApproxDistance(routePreview.distanceKm)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                Duration
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {isRoadRoute
                  ? `${routePreview.durationMinutes} min demo estimate`
                  : "Not available for straight-line preview"}
              </dd>
            </div>
          </dl>

          {routePreview.errorMessage ? (
            <p className="mt-3 rounded-lg border border-[oklch(0.8_0.065_82)] bg-[var(--warning-soft)] px-3 py-2 text-sm font-medium text-[var(--warning-foreground)]">
              {routePreview.errorMessage}
            </p>
          ) : null}

          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Straight-line preview is approximate and does not follow roads. OSRM
            road routing is optional demo data and may be unavailable.
          </p>
        </div>

        <button
          type="button"
          onClick={onCalculateRoute}
          disabled={isRouteLoading}
          className="pd-pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-65 lg:min-w-52"
        >
          {isRouteLoading ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={1.8} />
          ) : (
            <Route className="size-4" strokeWidth={1.8} />
          )}
          {isRouteLoading ? "Calculating..." : "Calculate road route"}
        </button>
      </div>
    </section>
  );
}

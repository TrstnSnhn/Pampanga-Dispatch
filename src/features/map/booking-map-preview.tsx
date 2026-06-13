import { Loader2, MapPin, RotateCcw, Route } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { ServiceBadge } from "@/components/service-badge";
import type { Booking } from "@/domain/booking";
import { dispatchStatusLabels } from "@/domain/dispatch-status";
import type { PampangaLocation } from "@/domain/location";
import type { RouteResult } from "@/domain/route";
import { formatApproxDistance } from "@/lib/distance";
import { formatPeso } from "@/lib/format";
import type { RouteComparison } from "@/lib/route-preview";
import { cn } from "@/lib/utils";

type BookingMapPreviewProps = {
  booking: Booking;
  pickupLocation: PampangaLocation;
  dropOffLocation: PampangaLocation;
  routePreview: RouteResult;
  straightLineRoute: RouteResult;
  routeComparison: RouteComparison;
  isRouteLoading: boolean;
  onCalculateRoute: () => void;
  onResetRoute: () => void;
};

function coordinateText(location: PampangaLocation) {
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

function routeActionLabel(isRoadRoute: boolean, hasRouteError: boolean) {
  if (isRoadRoute) {
    return "Recalculate road route";
  }

  if (hasRouteError) {
    return "Retry road route";
  }

  return "Calculate road route";
}

function routeProviderLabel(routeProvider: RouteResult["provider"]) {
  return routeProvider === "osrm_demo" ? "OSRM demo" : "Straight-line";
}

function formatDifference(distanceDifferenceKm: number | undefined) {
  if (distanceDifferenceKm === undefined) {
    return "Not available";
  }

  const prefix = distanceDifferenceKm > 0 ? "+" : "";

  return `${prefix}${distanceDifferenceKm.toFixed(1)} km`;
}

export function BookingMapPreview({
  booking,
  pickupLocation,
  dropOffLocation,
  routePreview,
  straightLineRoute,
  routeComparison,
  isRouteLoading,
  onCalculateRoute,
  onResetRoute,
}: BookingMapPreviewProps) {
  const isRoadRoute =
    routePreview.provider === "osrm_demo" && !routePreview.isFallback;
  const hasRouteError = Boolean(routePreview.errorMessage);
  const routeTone = isRoadRoute
    ? "info"
    : hasRouteError
      ? "warning"
      : "neutral";
  const canResetRoute = isRoadRoute || hasRouteError;
  const routeActionClasses = cn(
    "pd-pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-65",
    isRoadRoute
      ? "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]"
      : "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)]",
  );

  return (
    <section className="pd-card-flat rounded-2xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Selected booking
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            {booking.id}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {booking.customerName}
          </p>
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
            Booking price
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {formatPeso(booking.priceEstimate)}
          </dd>
          <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
            Based on {formatApproxDistance(booking.estimatedDistanceKm)}
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
                Current route mode
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {routePreview.sourceLabel}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Provider: {routeProviderLabel(routePreview.provider)}
              </p>
            </div>
            <StatusPill tone={routeTone}>
              {isRoadRoute ? "Road reference" : "Approximate"}
            </StatusPill>
          </div>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                Straight-line distance
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {formatApproxDistance(straightLineRoute.distanceKm)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                Active preview distance
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {isRoadRoute
                  ? `${routePreview.distanceKm.toFixed(1)} km road distance`
                  : formatApproxDistance(routePreview.distanceKm)}
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

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-56 lg:grid-cols-1">
          <button
            type="button"
            onClick={onCalculateRoute}
            disabled={isRouteLoading}
            className={routeActionClasses}
          >
            {isRouteLoading ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={1.8} />
            ) : (
              <Route className="size-4" strokeWidth={1.8} />
            )}
            {isRouteLoading
              ? "Calculating route..."
              : routeActionLabel(isRoadRoute, hasRouteError)}
          </button>
          <button
            type="button"
            onClick={onResetRoute}
            disabled={!canResetRoute || isRouteLoading}
            className="pd-pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <RotateCcw className="size-4" strokeWidth={1.8} />
            Reset to visual preview
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Route comparison
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
              Road values are references only. Booking price is unchanged.
            </p>
          </div>
          <StatusPill tone={routeComparison.hasRoadRoute ? "info" : "neutral"}>
            {routeComparison.hasRoadRoute ? "Road route loaded" : "Road route not loaded"}
          </StatusPill>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-[var(--muted-foreground)]">
              Straight-line
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {routeComparison.straightLineDistanceKm.toFixed(1)} km
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--muted-foreground)]">
              OSRM road distance
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {routeComparison.roadDistanceKm !== undefined
                ? `${routeComparison.roadDistanceKm.toFixed(1)} km`
                : "Not calculated"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--muted-foreground)]">
              OSRM duration
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {routeComparison.roadDurationMinutes !== undefined
                ? `${routeComparison.roadDurationMinutes} min`
                : "Not calculated"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[var(--muted-foreground)]">
              Distance difference
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {formatDifference(routeComparison.distanceDifferenceKm)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

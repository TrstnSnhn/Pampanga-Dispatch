"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { pampangaLocations, getLocationById } from "@/data/pampanga-locations";
import type { Booking } from "@/domain/booking";
import type { RouteLookupResult, RouteResult } from "@/domain/route";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import { BookingMapPreview } from "@/features/map/booking-map-preview";
import { LocationMarkerList } from "@/features/map/location-marker-list";
import { PampangaMap } from "@/features/map/pampanga-map";
import {
  buildRouteComparison,
  buildStraightLineRouteResult,
  selectBestRoutePreview,
} from "@/lib/route-preview";

async function getRouteErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { errorMessage?: string };

    return payload.errorMessage;
  } catch {
    return undefined;
  }
}

function findDefaultPreviewBooking(bookings: Booking[]) {
  return (
    bookings.find((booking) =>
      ["assigned", "picked_up", "in_transit"].includes(booking.status),
    ) ??
    bookings.find((booking) => booking.status === "pending") ??
    bookings[0]
  );
}

function bookingRouteLabel(booking: Booking) {
  const pickup = getLocationById(booking.pickupLocationId)?.name ?? "Unknown";
  const dropOff = getLocationById(booking.dropOffLocationId)?.name ?? "Unknown";

  return `${booking.id} - ${pickup} to ${dropOff}`;
}

export default function MapPage() {
  const { bookings } = useDispatchDemo();
  const [selectedBookingId, setSelectedBookingId] = useState<string>();
  const [routePreviewState, setRoutePreviewState] = useState<{
    bookingId: string;
    route: RouteResult;
  }>();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const defaultPreviewBooking = useMemo(
    () => findDefaultPreviewBooking(bookings),
    [bookings],
  );
  const previewBooking =
    bookings.find((booking) => booking.id === selectedBookingId) ??
    defaultPreviewBooking;

  const pickupLocation = previewBooking
    ? getLocationById(previewBooking.pickupLocationId)
    : undefined;
  const dropOffLocation = previewBooking
    ? getLocationById(previewBooking.dropOffLocationId)
    : undefined;
  const fallbackRoutePreview = useMemo(
    () =>
      pickupLocation && dropOffLocation
        ? buildStraightLineRouteResult(pickupLocation, dropOffLocation)
        : undefined,
    [pickupLocation, dropOffLocation],
  );
  const activeRoutePreview =
    routePreviewState?.bookingId === previewBooking?.id
      ? routePreviewState.route
      : fallbackRoutePreview;
  const routeComparison =
    fallbackRoutePreview && activeRoutePreview
      ? buildRouteComparison(fallbackRoutePreview, activeRoutePreview)
      : undefined;

  function handleBookingSelectionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSelectedBookingId(event.target.value);
    setRoutePreviewState(undefined);
    setIsRouteLoading(false);
  }

  function handleResetRoutePreview() {
    setRoutePreviewState(undefined);
    setIsRouteLoading(false);
  }

  async function handleCalculateRoadRoute() {
    if (
      !previewBooking ||
      !pickupLocation ||
      !dropOffLocation ||
      !fallbackRoutePreview
    ) {
      return;
    }

    setIsRouteLoading(true);

    const params = new URLSearchParams({
      pickupLng: String(pickupLocation.longitude),
      pickupLat: String(pickupLocation.latitude),
      dropoffLng: String(dropOffLocation.longitude),
      dropoffLat: String(dropOffLocation.latitude),
    });

    try {
      const response = await fetch(`/api/routes/osrm?${params.toString()}`, {
        cache: "no-store",
      });

      let lookupResult: RouteLookupResult;

      if (response.ok) {
        lookupResult = {
          ok: true,
          route: (await response.json()) as RouteResult,
        };
      } else {
        lookupResult = {
          ok: false,
          status: response.status,
          errorMessage:
            (await getRouteErrorMessage(response)) ??
            "Road route unavailable. Showing visual straight-line preview.",
        };
      }

      setRoutePreviewState({
        bookingId: previewBooking.id,
        route: selectBestRoutePreview(lookupResult, fallbackRoutePreview),
      });
    } catch (error) {
      setRoutePreviewState({
        bookingId: previewBooking.id,
        route: buildStraightLineRouteResult(
          pickupLocation,
          dropOffLocation,
          error instanceof Error
            ? error.message
            : "Road route unavailable. Showing visual straight-line preview.",
        ),
      });
    } finally {
      setIsRouteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pampanga Map"
        eyebrow="Map workspace"
        meta={`${pampangaLocations.length} Pampanga markers`}
        description="A Pampanga-focused service-area view with local markers and an honest sample booking preview."
        actions={
          <StatusPill tone="info" dot>
            OSRM demo optional
          </StatusPill>
        }
      />

      {previewBooking &&
      pickupLocation &&
      dropOffLocation &&
      activeRoutePreview &&
      fallbackRoutePreview &&
      routeComparison ? (
        <>
          <section className="pd-card-flat rounded-2xl p-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Route review booking
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                  The map defaults to active bookings first, then pending
                  bookings. Selecting another booking resets the route preview.
                </p>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  Selected booking
                </span>
                <select
                  value={previewBooking.id}
                  onChange={handleBookingSelectionChange}
                  className="mt-2 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                >
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {bookingRouteLabel(booking)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <PampangaMap
              locations={pampangaLocations}
              previewBooking={previewBooking}
              pickupLocation={pickupLocation}
              dropOffLocation={dropOffLocation}
              routePreview={activeRoutePreview}
            />
            <LocationMarkerList locations={pampangaLocations} />
          </div>

          <BookingMapPreview
            booking={previewBooking}
            pickupLocation={pickupLocation}
            dropOffLocation={dropOffLocation}
            routePreview={activeRoutePreview}
            straightLineRoute={fallbackRoutePreview}
            routeComparison={routeComparison}
            isRouteLoading={isRouteLoading}
            onCalculateRoute={handleCalculateRoadRoute}
            onResetRoute={handleResetRoutePreview}
          />
        </>
      ) : (
        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted-foreground)]">
            No booking preview is available from the current sample data.
          </p>
        </section>
      )}
    </div>
  );
}

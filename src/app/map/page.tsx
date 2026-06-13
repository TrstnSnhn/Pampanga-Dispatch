"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { pampangaLocations, getLocationById } from "@/data/pampanga-locations";
import type { RouteLookupResult, RouteResult } from "@/domain/route";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import { BookingMapPreview } from "@/features/map/booking-map-preview";
import { LocationMarkerList } from "@/features/map/location-marker-list";
import { PampangaMap } from "@/features/map/pampanga-map";
import {
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

export default function MapPage() {
  const { bookings } = useDispatchDemo();
  const [routePreviewState, setRoutePreviewState] = useState<{
    bookingId: string;
    route: RouteResult;
  }>();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const previewBooking =
    bookings.find((booking) =>
      ["assigned", "picked_up", "in_transit"].includes(booking.status),
    ) ??
    bookings.find((booking) => booking.status === "pending") ??
    bookings[0];

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

      {previewBooking && pickupLocation && dropOffLocation && activeRoutePreview ? (
        <>
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
            isRouteLoading={isRouteLoading}
            onCalculateRoute={handleCalculateRoadRoute}
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

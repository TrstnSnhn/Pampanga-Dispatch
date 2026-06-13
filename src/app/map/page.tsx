"use client";

import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { pampangaLocations, getLocationById } from "@/data/pampanga-locations";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import { BookingMapPreview } from "@/features/map/booking-map-preview";
import { LocationMarkerList } from "@/features/map/location-marker-list";
import { PampangaMap } from "@/features/map/pampanga-map";

export default function MapPage() {
  const { bookings } = useDispatchDemo();
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pampanga Map"
        eyebrow="Map workspace"
        meta={`${pampangaLocations.length} Pampanga markers`}
        description="A Pampanga-focused service-area view with local markers and an honest sample booking preview."
        actions={
          <StatusPill tone="warning" dot>
            No road routing yet
          </StatusPill>
        }
      />

      {previewBooking && pickupLocation && dropOffLocation ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <PampangaMap
              locations={pampangaLocations}
              previewBooking={previewBooking}
              pickupLocation={pickupLocation}
              dropOffLocation={dropOffLocation}
            />
            <LocationMarkerList locations={pampangaLocations} />
          </div>

          <BookingMapPreview
            booking={previewBooking}
            pickupLocation={pickupLocation}
            dropOffLocation={dropOffLocation}
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

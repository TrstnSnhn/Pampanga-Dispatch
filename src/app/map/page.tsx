import { PageHeader } from "@/components/page-header";
import { pampangaLocations, getLocationById } from "@/data/pampanga-locations";
import { sampleBookings } from "@/data/sample-bookings";
import { BookingMapPreview } from "@/features/map/booking-map-preview";
import { LocationMarkerList } from "@/features/map/location-marker-list";
import { PampangaMap } from "@/features/map/pampanga-map";

export default function MapPage() {
  const previewBooking =
    sampleBookings.find((booking) => booking.status === "pending") ??
    sampleBookings[0];

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
        description="A Pampanga-focused service area view with city and municipality markers. Routing is not connected yet."
      />

      {previewBooking && pickupLocation && dropOffLocation ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
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

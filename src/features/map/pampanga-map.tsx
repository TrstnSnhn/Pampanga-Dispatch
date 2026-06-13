"use client";

import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "@/components/ui/map";
import type { Booking } from "@/domain/booking";
import type { PampangaLocation } from "@/domain/location";
import { cn } from "@/lib/utils";

type PampangaMapProps = {
  locations: PampangaLocation[];
  previewBooking: Booking;
  pickupLocation: PampangaLocation;
  dropOffLocation: PampangaLocation;
};

const pampangaCenter: [number, number] = [120.67, 15.04];

function formatLocationType(kind: PampangaLocation["kind"]) {
  return kind === "city" ? "City" : "Municipality";
}

function markerRole(
  location: PampangaLocation,
  pickupLocation: PampangaLocation,
  dropOffLocation: PampangaLocation,
) {
  if (location.id === pickupLocation.id) {
    return "pickup";
  }

  if (location.id === dropOffLocation.id) {
    return "drop-off";
  }

  return "service-area";
}

function markerClasses(role: ReturnType<typeof markerRole>) {
  return cn(
    "grid size-5 place-items-center rounded-full border-2 border-[var(--surface)] shadow-[0_8px_18px_oklch(0.2_0.03_100/0.22)]",
    role === "pickup" && "bg-[var(--success-foreground)]",
    role === "drop-off" && "bg-[var(--info-foreground)]",
    role === "service-area" && "bg-[var(--accent)]",
  );
}

export function PampangaMap({
  locations,
  previewBooking,
  pickupLocation,
  dropOffLocation,
}: PampangaMapProps) {
  const previewCoordinates: [number, number][] = [
    [pickupLocation.longitude, pickupLocation.latitude],
    [dropOffLocation.longitude, dropOffLocation.latitude],
  ];

  return (
    <div className="pd-card relative overflow-hidden rounded-3xl">
      <div className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_16px_42px_var(--shadow-color)]">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Pampanga service area
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--accent)]" />
            Location marker
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--success-foreground)]" />
            Pickup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--info-foreground)]" />
            Drop-off
          </span>
        </div>
      </div>

      <Map
        theme="light"
        center={pampangaCenter}
        zoom={9.15}
        minZoom={8}
        maxZoom={14}
        className="h-[640px] min-h-[460px] w-full"
      >
        <MapControls
          position="top-right"
          showCompass
          showFullscreen
          showLocate={false}
        />

        <MapRoute
          id="booking-preview-line"
          coordinates={previewCoordinates}
          color="#2f7d52"
          width={2}
          opacity={0.72}
          dashArray={[2, 2]}
          interactive={false}
        />

        {locations.map((location) => {
          const role = markerRole(location, pickupLocation, dropOffLocation);

          return (
            <MapMarker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
            >
              <MarkerContent>
                <span className={markerClasses(role)}>
                  <span className="size-1.5 rounded-full bg-[var(--surface)]" />
                </span>
              </MarkerContent>
              <MarkerLabel
                position="bottom"
                className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[9px] text-[var(--foreground)] shadow-sm"
              >
                {location.name}
              </MarkerLabel>
              <MarkerPopup
                closeButton
                className="w-56 border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="pr-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {location.name}
                  </p>
                  <dl className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
                    <div className="flex justify-between gap-3">
                      <dt>Type</dt>
                      <dd className="font-medium text-[var(--foreground)]">
                        {formatLocationType(location.kind)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Service zone</dt>
                      <dd className="font-medium text-[var(--foreground)]">
                        Pampanga
                      </dd>
                    </div>
                  </dl>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
      </Map>

      <div className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs shadow-[0_16px_42px_var(--shadow-color)]">
        <p className="font-semibold text-[var(--foreground)]">
          {previewBooking.id}: visual pickup to drop-off preview only
        </p>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Dashed line is not road routing. OSRM or another routing service is
          not connected yet.
        </p>
      </div>
    </div>
  );
}

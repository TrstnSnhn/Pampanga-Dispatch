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
import type { RouteResult } from "@/domain/route";
import { formatApproxDistance } from "@/lib/distance";
import { cn } from "@/lib/utils";

type PampangaMapProps = {
  locations: PampangaLocation[];
  previewBooking: Booking;
  pickupLocation: PampangaLocation;
  dropOffLocation: PampangaLocation;
  routePreview: RouteResult;
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
  routePreview,
}: PampangaMapProps) {
  const isRoadRoute =
    routePreview.provider === "osrm_demo" && !routePreview.isFallback;
  const routeLineColor = isRoadRoute ? "#246b8f" : "#2f7d52";

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
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "h-0 w-5 border-t-2",
                isRoadRoute
                  ? "border-[var(--info-foreground)]"
                  : "border-dashed border-[var(--success-foreground)]",
              )}
            />
            {isRoadRoute ? "OSRM route" : "Visual line"}
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
          key={isRoadRoute ? "osrm-demo-route" : "straight-line-route"}
          id={isRoadRoute ? "booking-osrm-demo-route" : "booking-straight-line"}
          coordinates={routePreview.coordinates}
          color={routeLineColor}
          width={isRoadRoute ? 4 : 2}
          opacity={isRoadRoute ? 0.78 : 0.72}
          dashArray={isRoadRoute ? undefined : [2, 2]}
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
          {previewBooking.id}: {routePreview.sourceLabel}
        </p>
        <p className="mt-1 text-[var(--muted-foreground)]">
          {isRoadRoute
            ? `${routePreview.distanceKm.toFixed(1)} km road distance, ${routePreview.durationMinutes} min demo estimate.`
            : `${formatApproxDistance(routePreview.distanceKm)}. Dashed line does not follow roads.`}
        </p>
        {routePreview.errorMessage ? (
          <p className="mt-1 font-medium text-[var(--warning-foreground)]">
            {routePreview.errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

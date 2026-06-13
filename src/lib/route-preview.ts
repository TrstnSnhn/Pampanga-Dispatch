import type { PampangaLocation } from "../domain/location.ts";
import type {
  RouteCoordinate,
  RouteLookupResult,
  RouteResult,
} from "../domain/route.ts";
import { calculateStraightLineDistanceKm } from "./distance.ts";

export type RouteComparison = {
  straightLineDistanceKm: number;
  hasRoadRoute: boolean;
  roadDistanceKm?: number;
  roadDurationMinutes?: number;
  distanceDifferenceKm?: number;
};

export function locationToRouteCoordinate(
  location: Pick<PampangaLocation, "longitude" | "latitude">,
): RouteCoordinate {
  return [location.longitude, location.latitude];
}

export function buildStraightLineRouteResult(
  pickupLocation: Pick<PampangaLocation, "latitude" | "longitude">,
  dropOffLocation: Pick<PampangaLocation, "latitude" | "longitude">,
  errorMessage?: string,
): RouteResult {
  return {
    provider: "straight_line",
    coordinates: [
      locationToRouteCoordinate(pickupLocation),
      locationToRouteCoordinate(dropOffLocation),
    ],
    distanceKm: calculateStraightLineDistanceKm(pickupLocation, dropOffLocation),
    durationMinutes: 0,
    sourceLabel: "Straight-line visual preview",
    isFallback: true,
    errorMessage,
  };
}

export function selectBestRoutePreview(
  routeLookup: RouteLookupResult,
  fallback: RouteResult,
): RouteResult {
  if (routeLookup.ok) {
    return routeLookup.route;
  }

  return {
    ...fallback,
    errorMessage: routeLookup.errorMessage,
  };
}

export function buildRouteComparison(
  straightLineRoute: RouteResult,
  activeRoute: RouteResult,
): RouteComparison {
  const hasRoadRoute =
    activeRoute.provider === "osrm_demo" && !activeRoute.isFallback;

  if (!hasRoadRoute) {
    return {
      straightLineDistanceKm: straightLineRoute.distanceKm,
      hasRoadRoute: false,
    };
  }

  return {
    straightLineDistanceKm: straightLineRoute.distanceKm,
    hasRoadRoute: true,
    roadDistanceKm: activeRoute.distanceKm,
    roadDurationMinutes: activeRoute.durationMinutes,
    distanceDifferenceKm: Number(
      (activeRoute.distanceKm - straightLineRoute.distanceKm).toFixed(1),
    ),
  };
}

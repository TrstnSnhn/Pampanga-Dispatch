import type { PampangaLocation } from "../domain/location.ts";

const earthRadiusKm = 6371;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function calculateStraightLineDistanceKm(
  origin: Pick<PampangaLocation, "latitude" | "longitude">,
  destination: Pick<PampangaLocation, "latitude" | "longitude">,
) {
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const distanceKm =
    2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return Number(distanceKm.toFixed(1));
}

export function formatApproxDistance(distanceKm: number) {
  return `${distanceKm.toFixed(1)} km approx.`;
}

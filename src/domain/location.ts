export type PampangaLocation = {
  id: string;
  name: string;
  kind: "city" | "municipality";
  latitude: number;
  longitude: number;
};

export function findLocationById(
  locations: PampangaLocation[],
  locationId: PampangaLocation["id"],
) {
  return locations.find((location) => location.id === locationId);
}

export function findLocationByName(
  locations: PampangaLocation[],
  locationName: string,
) {
  const normalizedName = locationName.trim().toLowerCase();

  return locations.find(
    (location) => location.name.toLowerCase() === normalizedName,
  );
}

export function getLocationDisplayName(
  locations: PampangaLocation[],
  locationId: PampangaLocation["id"],
) {
  return findLocationById(locations, locationId)?.name ?? "Unknown location";
}

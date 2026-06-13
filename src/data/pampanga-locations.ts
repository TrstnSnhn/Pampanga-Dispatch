import type { PampangaLocation } from "@/domain/location";

export const pampangaLocations: PampangaLocation[] = [
  {
    id: "angeles-city",
    name: "Angeles City",
    kind: "city",
    latitude: 15.145,
    longitude: 120.5887,
  },
  {
    id: "mabalacat-city",
    name: "Mabalacat City",
    kind: "city",
    latitude: 15.223,
    longitude: 120.579,
  },
  {
    id: "san-fernando",
    name: "San Fernando",
    kind: "city",
    latitude: 15.0343,
    longitude: 120.6844,
  },
  {
    id: "magalang",
    name: "Magalang",
    kind: "municipality",
    latitude: 15.2151,
    longitude: 120.6596,
  },
  {
    id: "mexico",
    name: "Mexico",
    kind: "municipality",
    latitude: 15.0646,
    longitude: 120.7198,
  },
  {
    id: "porac",
    name: "Porac",
    kind: "municipality",
    latitude: 15.0711,
    longitude: 120.5419,
  },
  {
    id: "bacolor",
    name: "Bacolor",
    kind: "municipality",
    latitude: 15.0007,
    longitude: 120.6504,
  },
  {
    id: "guagua",
    name: "Guagua",
    kind: "municipality",
    latitude: 14.9667,
    longitude: 120.6333,
  },
  {
    id: "lubao",
    name: "Lubao",
    kind: "municipality",
    latitude: 14.9405,
    longitude: 120.6006,
  },
  {
    id: "floridablanca",
    name: "Floridablanca",
    kind: "municipality",
    latitude: 14.9775,
    longitude: 120.5285,
  },
  {
    id: "arayat",
    name: "Arayat",
    kind: "municipality",
    latitude: 15.1505,
    longitude: 120.7698,
  },
  {
    id: "candaba",
    name: "Candaba",
    kind: "municipality",
    latitude: 15.0933,
    longitude: 120.8267,
  },
  {
    id: "apalit",
    name: "Apalit",
    kind: "municipality",
    latitude: 14.9535,
    longitude: 120.7697,
  },
  {
    id: "macabebe",
    name: "Macabebe",
    kind: "municipality",
    latitude: 14.9081,
    longitude: 120.7156,
  },
  {
    id: "masantol",
    name: "Masantol",
    kind: "municipality",
    latitude: 14.896,
    longitude: 120.7101,
  },
  {
    id: "san-simon",
    name: "San Simon",
    kind: "municipality",
    latitude: 14.998,
    longitude: 120.7808,
  },
  {
    id: "santa-ana",
    name: "Santa Ana",
    kind: "municipality",
    latitude: 15.0955,
    longitude: 120.767,
  },
  {
    id: "santa-rita",
    name: "Santa Rita",
    kind: "municipality",
    latitude: 14.9942,
    longitude: 120.6158,
  },
  {
    id: "sasmuan",
    name: "Sasmuan",
    kind: "municipality",
    latitude: 14.9449,
    longitude: 120.616,
  },
  {
    id: "minalin",
    name: "Minalin",
    kind: "municipality",
    latitude: 14.9678,
    longitude: 120.6827,
  },
  {
    id: "san-luis",
    name: "San Luis",
    kind: "municipality",
    latitude: 15.0408,
    longitude: 120.7883,
  },
  {
    id: "santo-tomas",
    name: "Santo Tomas",
    kind: "municipality",
    latitude: 14.9923,
    longitude: 120.7053,
  },
];

export function getLocationName(locationId: PampangaLocation["id"]) {
  return (
    pampangaLocations.find((location) => location.id === locationId)?.name ??
    "Unknown location"
  );
}

export function getLocationById(locationId: PampangaLocation["id"]) {
  return pampangaLocations.find((location) => location.id === locationId);
}

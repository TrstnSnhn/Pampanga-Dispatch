export type RouteCoordinate = [
  longitude: number,
  latitude: number,
];

export type RouteProvider = "straight_line" | "osrm_demo";

export type RouteResult = {
  provider: RouteProvider;
  coordinates: RouteCoordinate[];
  distanceKm: number;
  durationMinutes: number;
  sourceLabel: string;
  isFallback: boolean;
  errorMessage?: string;
};

export type RouteLookupResult =
  | { ok: true; route: RouteResult }
  | { ok: false; errorMessage: string; status?: number };

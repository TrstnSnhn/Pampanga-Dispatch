import type {
  RouteCoordinate,
  RouteLookupResult,
  RouteResult,
} from "../domain/route.ts";

const defaultOsrmBaseUrl = "https://router.project-osrm.org";

type OsrmGeometry = {
  type?: string;
  coordinates?: unknown;
};

type OsrmRoute = {
  distance?: unknown;
  duration?: unknown;
  geometry?: OsrmGeometry;
};

type OsrmResponse = {
  code?: unknown;
  message?: unknown;
  routes?: unknown;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRouteCoordinate(value: unknown): value is RouteCoordinate {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isFiniteNumber(value[0]) &&
    isFiniteNumber(value[1])
  );
}

function extractErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "OSRM route lookup failed.";
}

function formatCoordinate(coordinate: RouteCoordinate) {
  const [longitude, latitude] = coordinate;

  return `${longitude},${latitude}`;
}

export function buildOsrmRouteUrl(
  origin: RouteCoordinate,
  destination: RouteCoordinate,
  baseUrl = defaultOsrmBaseUrl,
) {
  // OSRM route URLs and GeoJSON route geometry both use [longitude, latitude].
  const coordinates = `${formatCoordinate(origin)};${formatCoordinate(destination)}`;
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false",
  });

  return `${baseUrl}/route/v1/driving/${coordinates}?${params.toString()}`;
}

export function parseOsrmRouteResponse(payload: unknown): RouteLookupResult {
  const response = payload as OsrmResponse;

  if (response.code && response.code !== "Ok") {
    return {
      ok: false,
      errorMessage:
        typeof response.message === "string"
          ? response.message
          : "OSRM did not return a usable route.",
    };
  }

  if (!Array.isArray(response.routes) || response.routes.length === 0) {
    return {
      ok: false,
      errorMessage: "No OSRM route was returned for these coordinates.",
    };
  }

  const [route] = response.routes as OsrmRoute[];

  if (!isFiniteNumber(route.distance) || !isFiniteNumber(route.duration)) {
    return {
      ok: false,
      errorMessage: "OSRM route is missing distance or duration data.",
    };
  }

  const coordinates = route.geometry?.coordinates;

  if (!Array.isArray(coordinates) || !coordinates.every(isRouteCoordinate)) {
    return {
      ok: false,
      errorMessage: "OSRM route geometry is missing or malformed.",
    };
  }

  const result: RouteResult = {
    provider: "osrm_demo",
    coordinates,
    distanceKm: Number((route.distance / 1000).toFixed(1)),
    durationMinutes: Math.round(route.duration / 60),
    sourceLabel: "OSRM demo road route",
    isFallback: false,
  };

  return { ok: true, route: result };
}

export async function fetchOsrmRoute(
  origin: RouteCoordinate,
  destination: RouteCoordinate,
  fetchImpl: typeof fetch = fetch,
): Promise<RouteLookupResult> {
  try {
    const response = await fetchImpl(buildOsrmRouteUrl(origin, destination), {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        errorMessage: `OSRM returned HTTP ${response.status}.`,
      };
    }

    const payload = await response.json();

    return parseOsrmRouteResponse(payload);
  } catch (error) {
    return {
      ok: false,
      errorMessage: extractErrorMessage(error),
    };
  }
}

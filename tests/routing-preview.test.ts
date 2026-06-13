import assert from "node:assert/strict";
import test from "node:test";
import { pampangaLocations } from "../src/data/pampanga-locations.ts";
import type { RouteCoordinate } from "../src/domain/route.ts";
import {
  fetchOsrmRoute,
  parseOsrmRouteQuery,
  parseOsrmRouteResponse,
} from "../src/lib/osrm.ts";
import {
  buildRouteComparison,
  buildStraightLineRouteResult,
  selectBestRoutePreview,
} from "../src/lib/route-preview.ts";

const angeles = pampangaLocations.find(
  (location) => location.id === "angeles-city",
);
const mabalacat = pampangaLocations.find(
  (location) => location.id === "mabalacat-city",
);

test("straight-line fallback route result uses longitude latitude coordinate order", () => {
  assert.ok(angeles);
  assert.ok(mabalacat);

  const route = buildStraightLineRouteResult(angeles, mabalacat);

  assert.equal(route.provider, "straight_line");
  assert.equal(route.isFallback, true);
  assert.deepEqual(route.coordinates[0], [angeles.longitude, angeles.latitude]);
  assert.deepEqual(route.coordinates[1], [
    mabalacat.longitude,
    mabalacat.latitude,
  ]);
  assert.ok(route.distanceKm > 0);
});

test("OSRM parser returns demo road distance duration and geometry for a valid payload", () => {
  const coordinates: RouteCoordinate[] = [
    [120.59, 15.15],
    [120.61, 15.18],
    [120.64, 15.2],
  ];

  const parsed = parseOsrmRouteResponse({
    code: "Ok",
    routes: [
      {
        distance: 12800,
        duration: 1860,
        geometry: {
          type: "LineString",
          coordinates,
        },
      },
    ],
  });

  assert.equal(parsed.ok, true);
  assert.equal(parsed.route.provider, "osrm_demo");
  assert.equal(parsed.route.distanceKm, 12.8);
  assert.equal(parsed.route.durationMinutes, 31);
  assert.deepEqual(parsed.route.coordinates, coordinates);
});

test("OSRM parser reports malformed or empty route responses without throwing", () => {
  const malformed = parseOsrmRouteResponse({ code: "Ok", routes: [] });

  assert.equal(malformed.ok, false);
  assert.match(malformed.errorMessage, /No OSRM route/);

  const missingGeometry = parseOsrmRouteResponse({
    code: "Ok",
    routes: [{ distance: 1000, duration: 120 }],
  });

  assert.equal(missingGeometry.ok, false);
  assert.match(missingGeometry.errorMessage, /geometry/);
});

test("fetch OSRM route reports failure through a typed result", async () => {
  const origin: RouteCoordinate = [120.59, 15.15];
  const destination: RouteCoordinate = [120.64, 15.2];

  const result = await fetchOsrmRoute(origin, destination, async () => {
    throw new Error("network unavailable");
  });

  assert.equal(result.ok, false);
  assert.match(result.errorMessage, /network unavailable/);
});

test("fetch OSRM route times out through a typed result", async () => {
  const origin: RouteCoordinate = [120.59, 15.15];
  const destination: RouteCoordinate = [120.64, 15.2];
  const timeoutSentinel = { ok: false as const, errorMessage: "test timed out" };

  const result = await Promise.race([
    fetchOsrmRoute(
      origin,
      destination,
      async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("OSRM request timed out.", "AbortError"));
          });
        }),
      { timeoutMs: 5 },
    ),
    new Promise<typeof timeoutSentinel>((resolve) => {
      setTimeout(() => resolve(timeoutSentinel), 50);
    }),
  ]);

  assert.equal(result.ok, false);
  assert.notEqual(result.errorMessage, timeoutSentinel.errorMessage);
  assert.match(result.errorMessage, /timed out/i);
});

test("route preview selection falls back when OSRM is unavailable", () => {
  assert.ok(angeles);
  assert.ok(mabalacat);

  const fallback = buildStraightLineRouteResult(
    angeles,
    mabalacat,
    "Road route unavailable. Showing visual straight-line preview.",
  );
  const selected = selectBestRoutePreview(
    { ok: false, errorMessage: "OSRM unavailable" },
    fallback,
  );

  assert.equal(selected.provider, "straight_line");
  assert.equal(selected.isFallback, true);
  assert.match(selected.errorMessage ?? "", /OSRM unavailable/);
});

test("route comparison shows road distance and difference when OSRM succeeds", () => {
  assert.ok(angeles);
  assert.ok(mabalacat);

  const straightLine = buildStraightLineRouteResult(angeles, mabalacat);
  const roadRoute = {
    provider: "osrm_demo" as const,
    coordinates: straightLine.coordinates,
    distanceKm: straightLine.distanceKm + 2.4,
    durationMinutes: 21,
    sourceLabel: "OSRM demo road route",
    isFallback: false,
  };

  const comparison = buildRouteComparison(straightLine, roadRoute);

  assert.equal(comparison.hasRoadRoute, true);
  assert.equal(comparison.straightLineDistanceKm, straightLine.distanceKm);
  assert.equal(comparison.roadDistanceKm, roadRoute.distanceKm);
  assert.equal(comparison.roadDurationMinutes, roadRoute.durationMinutes);
  assert.equal(comparison.distanceDifferenceKm, 2.4);
});

test("route comparison omits road values for straight-line fallback", () => {
  assert.ok(angeles);
  assert.ok(mabalacat);

  const straightLine = buildStraightLineRouteResult(angeles, mabalacat);
  const comparison = buildRouteComparison(straightLine, straightLine);

  assert.equal(comparison.hasRoadRoute, false);
  assert.equal(comparison.roadDistanceKm, undefined);
  assert.equal(comparison.roadDurationMinutes, undefined);
  assert.equal(comparison.distanceDifferenceKm, undefined);
});

test("OSRM query validation returns a clear error for missing params", () => {
  const result = parseOsrmRouteQuery(new URLSearchParams());

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.match(result.errorMessage, /Missing pickup and drop-off/);
});

test("OSRM query validation returns a clear error for invalid coordinate ranges", () => {
  const result = parseOsrmRouteQuery(
    new URLSearchParams({
      pickupLng: "999",
      pickupLat: "15.1",
      dropoffLng: "120.6",
      dropoffLat: "15.2",
    }),
  );

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.match(result.errorMessage, /Invalid pickup or drop-off/);
});

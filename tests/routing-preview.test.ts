import assert from "node:assert/strict";
import test from "node:test";
import { pampangaLocations } from "../src/data/pampanga-locations.ts";
import type { RouteCoordinate } from "../src/domain/route.ts";
import {
  fetchOsrmRoute,
  parseOsrmRouteResponse,
} from "../src/lib/osrm.ts";
import {
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

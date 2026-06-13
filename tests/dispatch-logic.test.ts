import assert from "node:assert/strict";
import test from "node:test";
import { pampangaLocations } from "../src/data/pampanga-locations.ts";
import { sampleDrivers } from "../src/data/sample-drivers.ts";
import type { Booking } from "../src/domain/booking.ts";
import { createLocalBooking } from "../src/lib/booking-factory.ts";
import {
  assignDriverToBooking,
  suggestDriverForBooking,
} from "../src/lib/dispatch.ts";
import { calculateStraightLineDistanceKm } from "../src/lib/distance.ts";
import { estimatePrice } from "../src/lib/pricing.ts";

const angelesToMabalacatBooking: Booking = {
  id: "BKG-TEST",
  customerName: "Test Customer",
  serviceType: "ride",
  pickupLocationId: "angeles-city",
  dropOffLocationId: "mabalacat-city",
  status: "pending",
  priceEstimate: 0,
  estimatedDistanceKm: 0,
  createdAt: "2026-06-13T00:00:00+08:00",
};

test("distance estimate returns a positive number for different Pampanga locations", () => {
  const angeles = pampangaLocations.find(
    (location) => location.id === "angeles-city",
  );
  const mabalacat = pampangaLocations.find(
    (location) => location.id === "mabalacat-city",
  );

  assert.ok(angeles);
  assert.ok(mabalacat);
  assert.ok(calculateStraightLineDistanceKm(angeles, mabalacat) > 0);
});

test("local booking creation rejects the same pickup and drop-off", () => {
  assert.throws(
    () =>
      createLocalBooking(
        {
          customerName: "Ana Reyes",
          serviceType: "delivery",
          pickupLocationId: "angeles-city",
          dropOffLocationId: "angeles-city",
          notes: "Envelope",
        },
        { sequence: 1, createdAt: "2026-06-13T00:00:00+08:00" },
      ),
    /Pickup and drop-off must be different/,
  );
});

test("pricing changes with distance and service type", () => {
  const shortRide = estimatePrice("ride", 4);
  const longRide = estimatePrice("ride", 12);
  const delivery = estimatePrice("delivery", 12);

  assert.ok(longRide > shortRide);
  assert.ok(delivery > longRide);
});

test("assignment suggests an available driver who can handle the service", () => {
  const suggested = suggestDriverForBooking(
    angelesToMabalacatBooking,
    sampleDrivers,
    pampangaLocations,
  );

  assert.ok(suggested);
  assert.equal(suggested.status, "available");
  assert.ok(suggested.serviceTypes.includes("ride"));
});

test("assigning a driver changes booking status and driver availability", () => {
  const driver = sampleDrivers.find((candidate) => candidate.id === "drv-001");

  assert.ok(driver);

  const result = assignDriverToBooking(angelesToMabalacatBooking, driver);

  assert.equal(result.booking.status, "assigned");
  assert.equal(result.booking.driverId, driver.id);
  assert.equal(result.driver.status, "assigned");
  assert.equal(result.driver.activeAssignmentId, angelesToMabalacatBooking.id);
});

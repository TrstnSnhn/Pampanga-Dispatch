import assert from "node:assert/strict";
import test from "node:test";
import { pampangaLocations } from "../src/data/pampanga-locations.ts";
import { sampleDrivers } from "../src/data/sample-drivers.ts";
import type { Booking } from "../src/domain/booking.ts";
import { createLocalBooking } from "../src/lib/booking-factory.ts";
import {
  applyBookingStatusTransition,
  assignDriverToBooking,
  suggestDriverForBooking,
  summarizeDispatchOperations,
  transitionBookingStatus,
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

test("booking status flow moves through assigned, picked up, in transit, and completed", () => {
  const assigned = transitionBookingStatus(
    {
      ...angelesToMabalacatBooking,
      status: "assigned",
      driverId: "drv-001",
    },
    "picked_up",
  );
  const inTransit = transitionBookingStatus(assigned, "in_transit");
  const completed = transitionBookingStatus(inTransit, "completed");

  assert.equal(assigned.status, "picked_up");
  assert.equal(inTransit.status, "in_transit");
  assert.equal(completed.status, "completed");
  assert.ok(completed.completedAt);
});

test("invalid status transitions are prevented", () => {
  assert.throws(
    () =>
      transitionBookingStatus(
        {
          ...angelesToMabalacatBooking,
          status: "picked_up",
          driverId: "drv-001",
        },
        "cancelled",
      ),
    /Cannot move booking from picked_up to cancelled/,
  );
  assert.throws(
    () =>
      transitionBookingStatus(
        {
          ...angelesToMabalacatBooking,
          status: "completed",
          driverId: "drv-001",
        },
        "cancelled",
      ),
    /Cannot move booking from completed to cancelled/,
  );
});

test("completing an assigned booking releases the driver", () => {
  const assignedBooking: Booking = {
    ...angelesToMabalacatBooking,
    status: "in_transit",
    driverId: "drv-001",
  };
  const assignedDriver = {
    ...sampleDrivers[0],
    status: "assigned" as const,
    activeAssignmentId: assignedBooking.id,
  };

  const result = applyBookingStatusTransition(
    assignedBooking,
    [assignedDriver],
    "completed",
  );

  assert.equal(result.booking.status, "completed");
  assert.equal(result.drivers[0].status, "available");
  assert.equal(result.drivers[0].activeAssignmentId, undefined);
});

test("cancelling an assigned booking releases the driver", () => {
  const assignedBooking: Booking = {
    ...angelesToMabalacatBooking,
    status: "assigned",
    driverId: "drv-001",
  };
  const assignedDriver = {
    ...sampleDrivers[0],
    status: "assigned" as const,
    activeAssignmentId: assignedBooking.id,
  };

  const result = applyBookingStatusTransition(
    assignedBooking,
    [assignedDriver],
    "cancelled",
  );

  assert.equal(result.booking.status, "cancelled");
  assert.equal(result.drivers[0].status, "available");
  assert.equal(result.drivers[0].activeAssignmentId, undefined);
});

test("cancelling an unassigned pending booking does not affect drivers", () => {
  const availableDriver = sampleDrivers[0];

  const result = applyBookingStatusTransition(
    angelesToMabalacatBooking,
    [availableDriver],
    "cancelled",
  );

  assert.equal(result.booking.status, "cancelled");
  assert.equal(result.drivers[0], availableDriver);
});

test("dispatch summary counts local workflow states", () => {
  const summary = summarizeDispatchOperations([
    { ...angelesToMabalacatBooking, status: "pending" },
    { ...angelesToMabalacatBooking, id: "BKG-A", status: "assigned" },
    { ...angelesToMabalacatBooking, id: "BKG-P", status: "picked_up" },
    { ...angelesToMabalacatBooking, id: "BKG-T", status: "in_transit" },
    { ...angelesToMabalacatBooking, id: "BKG-C", status: "completed" },
    { ...angelesToMabalacatBooking, id: "BKG-X", status: "cancelled" },
  ]);

  assert.equal(summary.pending, 1);
  assert.equal(summary.active, 3);
  assert.equal(summary.completed, 1);
  assert.equal(summary.cancelled, 1);
  assert.equal(summary.closed, 2);
});

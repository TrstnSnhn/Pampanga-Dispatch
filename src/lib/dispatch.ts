import type { Booking } from "../domain/booking.ts";
import type { DispatchStatus } from "../domain/dispatch-status.ts";
import { canTransitionBookingStatus } from "../domain/dispatch-status.ts";
import type { Driver } from "../domain/driver.ts";
import type { PampangaLocation } from "../domain/location.ts";
import { findLocationById } from "../domain/location.ts";
import type { ServiceType } from "../domain/service-type.ts";
import { calculateStraightLineDistanceKm } from "./distance.ts";

export function findAvailableDrivers(drivers: Driver[]) {
  return drivers.filter((driver) => driver.status === "available");
}

export function driverCanHandleService(
  driver: Driver,
  serviceType: ServiceType,
) {
  return driver.serviceTypes.includes(serviceType);
}

function driverDistanceToPickup(
  driver: Driver,
  booking: Booking,
  locations: PampangaLocation[],
) {
  const driverLocation = findLocationById(locations, driver.currentLocationId);
  const pickupLocation = findLocationById(locations, booking.pickupLocationId);

  if (!driverLocation || !pickupLocation) {
    return Number.POSITIVE_INFINITY;
  }

  return calculateStraightLineDistanceKm(driverLocation, pickupLocation);
}

export function suggestDriverForBooking(
  booking: Booking,
  drivers: Driver[],
  locations: PampangaLocation[],
) {
  const candidates = findAvailableDrivers(drivers).filter((driver) =>
    driverCanHandleService(driver, booking.serviceType),
  );

  return candidates
    .map((driver) => ({
      driver,
      distanceKm: driverDistanceToPickup(driver, booking, locations),
    }))
    .sort((first, second) => {
      if (first.distanceKm !== second.distanceKm) {
        return first.distanceKm - second.distanceKm;
      }

      return first.driver.name.localeCompare(second.driver.name);
    })[0]?.driver;
}

export function getSuggestedDriverDistanceKm(
  booking: Booking,
  driver: Driver,
  locations: PampangaLocation[],
) {
  return driverDistanceToPickup(driver, booking, locations);
}

export function assignDriverToBooking(booking: Booking, driver: Driver) {
  if (booking.status !== "pending") {
    throw new Error("Only pending bookings can be assigned.");
  }

  if (driver.status !== "available") {
    throw new Error("Only available drivers can be assigned.");
  }

  if (!driverCanHandleService(driver, booking.serviceType)) {
    throw new Error("Driver cannot handle this service type.");
  }

  return {
    booking: {
      ...booking,
      status: "assigned" as const,
      driverId: driver.id,
    },
    driver: {
      ...driver,
      status: "assigned" as const,
      activeAssignmentId: booking.id,
    },
  };
}

export function transitionBookingStatus(
  booking: Booking,
  nextStatus: DispatchStatus,
) {
  if (!canTransitionBookingStatus(booking.status, nextStatus)) {
    throw new Error(
      `Cannot move booking from ${booking.status} to ${nextStatus}.`,
    );
  }

  return {
    ...booking,
    status: nextStatus,
    completedAt:
      nextStatus === "completed" ? new Date().toISOString() : booking.completedAt,
  };
}

function shouldReleaseDriver(booking: Booking) {
  return (
    ["completed", "cancelled"].includes(booking.status) &&
    Boolean(booking.driverId)
  );
}

export function releaseAssignedDriver(
  drivers: Driver[],
  driverId: Driver["id"],
) {
  return drivers.map((driver) =>
    driver.id === driverId
      ? {
          ...driver,
          status: "available" as const,
          activeAssignmentId: undefined,
        }
      : driver,
  );
}

export function applyBookingStatusTransition(
  booking: Booking,
  drivers: Driver[],
  nextStatus: DispatchStatus,
) {
  const updatedBooking = transitionBookingStatus(booking, nextStatus);

  return {
    booking: updatedBooking,
    drivers:
      shouldReleaseDriver(updatedBooking) && updatedBooking.driverId
        ? releaseAssignedDriver(drivers, updatedBooking.driverId)
        : drivers,
  };
}

export function summarizeDispatchOperations(bookings: Booking[]) {
  const activeStatuses: DispatchStatus[] = [
    "assigned",
    "picked_up",
    "in_transit",
  ];
  const completed = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;
  const cancelled = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  return {
    active: bookings.filter((booking) =>
      activeStatuses.includes(booking.status),
    ).length,
    pending: bookings.filter((booking) => booking.status === "pending").length,
    assigned: bookings.filter((booking) => booking.status === "assigned").length,
    pickedUp: bookings.filter((booking) => booking.status === "picked_up")
      .length,
    inTransit: bookings.filter((booking) => booking.status === "in_transit")
      .length,
    completed,
    cancelled,
    closed: completed + cancelled,
  };
}

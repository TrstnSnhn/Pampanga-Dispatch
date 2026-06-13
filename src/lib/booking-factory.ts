import { pampangaLocations } from "../data/pampanga-locations.ts";
import type { Booking } from "../domain/booking.ts";
import type { PampangaLocation } from "../domain/location.ts";
import { findLocationById } from "../domain/location.ts";
import type { ServiceType } from "../domain/service-type.ts";
import { calculateStraightLineDistanceKm } from "./distance.ts";
import { estimatePrice } from "./pricing.ts";

export type CreateBookingInput = {
  customerName: string;
  serviceType: ServiceType;
  pickupLocationId: PampangaLocation["id"];
  dropOffLocationId: PampangaLocation["id"];
  notes?: string;
};

export type BookingValidationErrors = Partial<
  Record<keyof CreateBookingInput | "route", string>
>;

type CreateBookingOptions = {
  sequence: number;
  createdAt?: string;
  locations?: PampangaLocation[];
};

function normalizeText(value: string) {
  return value.trim();
}

export function validateBookingInput(
  input: CreateBookingInput,
  locations: PampangaLocation[] = pampangaLocations,
) {
  const errors: BookingValidationErrors = {};

  if (!normalizeText(input.customerName)) {
    errors.customerName = "Customer name is required.";
  }

  if (!input.serviceType) {
    errors.serviceType = "Service type is required.";
  }

  if (!input.pickupLocationId) {
    errors.pickupLocationId = "Pickup location is required.";
  } else if (!findLocationById(locations, input.pickupLocationId)) {
    errors.pickupLocationId = "Pickup location is not in the Pampanga list.";
  }

  if (!input.dropOffLocationId) {
    errors.dropOffLocationId = "Drop-off location is required.";
  } else if (!findLocationById(locations, input.dropOffLocationId)) {
    errors.dropOffLocationId = "Drop-off location is not in the Pampanga list.";
  }

  if (
    input.pickupLocationId &&
    input.dropOffLocationId &&
    input.pickupLocationId === input.dropOffLocationId
  ) {
    errors.route = "Pickup and drop-off must be different.";
  }

  return errors;
}

export function hasBookingValidationErrors(errors: BookingValidationErrors) {
  return Object.keys(errors).length > 0;
}

export function createLocalBooking(
  input: CreateBookingInput,
  options: CreateBookingOptions,
): Booking {
  const locations = options.locations ?? pampangaLocations;
  const errors = validateBookingInput(input, locations);

  if (hasBookingValidationErrors(errors)) {
    throw new Error(Object.values(errors)[0]);
  }

  const pickupLocation = findLocationById(locations, input.pickupLocationId);
  const dropOffLocation = findLocationById(locations, input.dropOffLocationId);

  if (!pickupLocation || !dropOffLocation) {
    throw new Error("Pickup and drop-off locations must exist.");
  }

  const estimatedDistanceKm = calculateStraightLineDistanceKm(
    pickupLocation,
    dropOffLocation,
  );

  return {
    id: `BKG-LOCAL-${String(options.sequence).padStart(3, "0")}`,
    customerName: normalizeText(input.customerName),
    serviceType: input.serviceType,
    pickupLocationId: input.pickupLocationId,
    dropOffLocationId: input.dropOffLocationId,
    status: "pending",
    notes: input.notes ? normalizeText(input.notes) : undefined,
    estimatedDistanceKm,
    priceEstimate: estimatePrice(input.serviceType, estimatedDistanceKm),
    createdAt: options.createdAt ?? new Date().toISOString(),
  };
}

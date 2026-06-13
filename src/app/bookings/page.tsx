"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/page-header";
import { ServiceBadge } from "@/components/service-badge";
import { StatusPill } from "@/components/status-pill";
import {
  getLocationById,
  getLocationName,
  pampangaLocations,
} from "@/data/pampanga-locations";
import {
  dispatchStatusLabels,
  getNextBookingStatuses,
  type DispatchStatus,
} from "@/domain/dispatch-status";
import type { Booking } from "@/domain/booking";
import type { PampangaLocation } from "@/domain/location";
import type { ServiceType } from "@/domain/service-type";
import { serviceTypeLabels } from "@/domain/service-type";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import {
  type BookingValidationErrors,
  type CreateBookingInput,
} from "@/lib/booking-factory";
import {
  calculateStraightLineDistanceKm,
  formatApproxDistance,
} from "@/lib/distance";
import { formatPeso } from "@/lib/format";
import { estimatePrice } from "@/lib/pricing";

const statusTone: Record<
  DispatchStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  pending: "warning",
  assigned: "info",
  picked_up: "info",
  in_transit: "info",
  completed: "success",
  cancelled: "danger",
};

type BookingFormState = {
  customerName: string;
  serviceType: ServiceType;
  pickupLocationId: string;
  dropOffLocationId: string;
  notes: string;
};

type BookingFilter =
  | "all"
  | "pending"
  | "assigned"
  | "active"
  | "completed"
  | "cancelled";

const bookingFilters: Array<{ value: BookingFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const activeStatuses: DispatchStatus[] = ["assigned", "picked_up", "in_transit"];

const initialFormState: BookingFormState = {
  customerName: "",
  serviceType: "ride",
  pickupLocationId: "",
  dropOffLocationId: "",
  notes: "",
};

function driverName(
  drivers: ReturnType<typeof useDispatchDemo>["drivers"],
  driverId?: string,
) {
  if (!driverId) {
    return "Unassigned";
  }

  return drivers.find((driver) => driver.id === driverId)?.name ?? "Unknown";
}

function isLocalBooking(booking: Booking) {
  return booking.id.startsWith("BKG-LOCAL");
}

function bookingMatchesFilter(booking: Booking, filter: BookingFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "active") {
    return activeStatuses.includes(booking.status);
  }

  return booking.status === filter;
}

function nextActionLabel(booking: Booking) {
  const nextStatuses = getNextBookingStatuses(booking.status);

  if (nextStatuses.length === 0) {
    return booking.status === "completed"
      ? "Closed: completed"
      : "Closed: cancelled";
  }

  if (booking.status === "pending") {
    return "Next: assign driver or cancel";
  }

  if (booking.status === "assigned") {
    return "Next: mark picked up or cancel";
  }

  if (booking.status === "picked_up") {
    return "Next: mark in transit";
  }

  return "Next: complete booking";
}

function estimateForForm(formState: BookingFormState) {
  if (
    !formState.pickupLocationId ||
    !formState.dropOffLocationId ||
    formState.pickupLocationId === formState.dropOffLocationId
  ) {
    return undefined;
  }

  const pickupLocation = getLocationById(
    formState.pickupLocationId as PampangaLocation["id"],
  );
  const dropOffLocation = getLocationById(
    formState.dropOffLocationId as PampangaLocation["id"],
  );

  if (!pickupLocation || !dropOffLocation) {
    return undefined;
  }

  const distanceKm = calculateStraightLineDistanceKm(
    pickupLocation,
    dropOffLocation,
  );

  return {
    distanceKm,
    priceEstimate: estimatePrice(formState.serviceType, distanceKm),
  };
}

function toBookingInput(formState: BookingFormState): CreateBookingInput {
  return {
    customerName: formState.customerName,
    serviceType: formState.serviceType,
    pickupLocationId: formState.pickupLocationId as PampangaLocation["id"],
    dropOffLocationId: formState.dropOffLocationId as PampangaLocation["id"],
    notes: formState.notes,
  };
}

export default function BookingsPage() {
  const { bookings, drivers, createBooking } = useDispatchDemo();
  const [formState, setFormState] =
    useState<BookingFormState>(initialFormState);
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [createdBookingId, setCreatedBookingId] = useState<string | undefined>();
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("all");
  const estimate = useMemo(() => estimateForForm(formState), [formState]);
  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        bookingMatchesFilter(booking, bookingFilter),
      ),
    [bookingFilter, bookings],
  );
  const localBookingCount = bookings.filter(isLocalBooking).length;
  const sampleBookingCount = bookings.length - localBookingCount;

  function updateField<Field extends keyof BookingFormState>(
    field: Field,
    value: BookingFormState[Field],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, route: undefined }));
    setCreatedBookingId(undefined);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = createBooking(toBookingInput(formState));

    if (!result.ok) {
      setErrors(result.errors);
      setCreatedBookingId(undefined);
      return;
    }

    setErrors({});
    setCreatedBookingId(result.booking.id);
    setFormState(initialFormState);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        eyebrow="Local booking workflow"
        meta={`${bookings.length} session records`}
        description="Create and review local ride, parcel, and food delivery bookings. Data resets when the browser session refreshes."
      />

      <section className="pd-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Create local booking
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              This creates a temporary client-side booking only. Distance is a
              straight-line estimate, not road routing.
            </p>
          </div>
          <StatusPill tone="warning" dot>
            Session only
          </StatusPill>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
              Customer name
              <input
                value={formState.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[oklch(0.62_0.11_150/0.18)]"
                placeholder="Juan Dela Cruz"
              />
              {errors.customerName ? (
                <span className="text-xs font-medium text-[var(--danger-foreground)]">
                  {errors.customerName}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
              Service type
              <select
                value={formState.serviceType}
                onChange={(event) =>
                  updateField("serviceType", event.target.value as ServiceType)
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[oklch(0.62_0.11_150/0.18)]"
              >
                {Object.entries(serviceTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
              Pickup location
              <select
                value={formState.pickupLocationId}
                onChange={(event) =>
                  updateField("pickupLocationId", event.target.value)
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[oklch(0.62_0.11_150/0.18)]"
              >
                <option value="">Select pickup</option>
                {pampangaLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.pickupLocationId ? (
                <span className="text-xs font-medium text-[var(--danger-foreground)]">
                  {errors.pickupLocationId}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
              Drop-off location
              <select
                value={formState.dropOffLocationId}
                onChange={(event) =>
                  updateField("dropOffLocationId", event.target.value)
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[oklch(0.62_0.11_150/0.18)]"
              >
                <option value="">Select drop-off</option>
                {pampangaLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {errors.dropOffLocationId ? (
                <span className="text-xs font-medium text-[var(--danger-foreground)]">
                  {errors.dropOffLocationId}
                </span>
              ) : null}
            </label>
          </div>

          {errors.route ? (
            <p className="rounded-xl border border-[oklch(0.79_0.055_28)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-medium text-[var(--danger-foreground)]">
              {errors.route}
            </p>
          ) : null}

          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            Package or request notes
            <textarea
              value={formState.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={3}
              className="resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[oklch(0.62_0.11_150/0.18)]"
              placeholder="Short handling note or passenger request"
            />
          </label>

          <div className="flex flex-col gap-3 rounded-xl bg-[var(--surface-raised)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Estimate preview
              </p>
              {estimate ? (
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {formatApproxDistance(estimate.distanceKm)} /{" "}
                  {formatPeso(estimate.priceEstimate)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Choose different pickup and drop-off locations.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="pd-pressable inline-flex justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              Create local booking
            </button>
          </div>

          {createdBookingId ? (
            <p className="rounded-xl border border-[oklch(0.78_0.055_151)] bg-[var(--success-soft)] px-3 py-2 text-sm font-medium text-[var(--success-foreground)]">
              {createdBookingId} added to the local booking list.
            </p>
          ) : null}
        </form>
      </section>

      <section className="pd-card overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Booking ledger
            </h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {localBookingCount} local, {sampleBookingCount} sample. Filters do
              not persist after refresh.
            </p>
          </div>
          <StatusPill tone="neutral">
            {filteredBookings.length} shown
          </StatusPill>
        </div>
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--border)] px-3 py-3">
          {bookingFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setBookingFilter(filter.value)}
              className={`pd-pressable rounded-full border px-3 py-1.5 text-xs font-semibold ${
                bookingFilter === filter.value
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 p-3 md:hidden">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">
                    {booking.id}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {booking.customerName}
                  </p>
                </div>
                <StatusPill tone={statusTone[booking.status]} dot>
                  {dispatchStatusLabels[booking.status]}
                </StatusPill>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <ServiceBadge serviceType={booking.serviceType} />
                <StatusPill tone={isLocalBooking(booking) ? "info" : "neutral"}>
                  {isLocalBooking(booking) ? "Local" : "Sample"}
                </StatusPill>
              </div>

              <p className="mt-3 rounded-xl bg-[var(--surface-raised)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">
                {nextActionLabel(booking)}
              </p>

              <div className="mt-4 grid gap-3 rounded-xl bg-[var(--surface-raised)] p-3">
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Pickup
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {getLocationName(booking.pickupLocationId)}
                  </p>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    Drop-off
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {getLocationName(booking.dropOffLocationId)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                    Driver
                  </dt>
                  <dd className="mt-1 font-medium text-[var(--foreground)]">
                    {driverName(drivers, booking.driverId)}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-xs font-medium text-[var(--muted-foreground)]">
                    Estimate
                  </dt>
                  <dd className="mt-1 font-semibold text-[var(--foreground)]">
                    {formatPeso(booking.priceEstimate)}
                  </dd>
                  <dd className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {formatApproxDistance(booking.estimatedDistanceKm)}
                  </dd>
                </div>
              </dl>
            </article>
            ))
          ) : (
            <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
              No bookings match this filter.
            </p>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Booking</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Route points</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Driver</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Estimate
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-[var(--surface-raised)]"
                >
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <p className="font-semibold text-[var(--foreground)]">
                      {booking.id}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {booking.customerName}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[var(--muted-foreground)]">
                      {isLocalBooking(booking) ? "Local session" : "Sample seed"}
                    </p>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <ServiceBadge serviceType={booking.serviceType} />
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-[var(--foreground)]">
                    <div className="grid gap-2">
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          Pickup
                        </p>
                        <p className="font-medium">
                          {getLocationName(booking.pickupLocationId)}
                        </p>
                      </div>
                      <div className="h-px w-10 bg-[var(--border)]" />
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          Drop-off
                        </p>
                        <p className="font-medium">
                          {getLocationName(booking.dropOffLocationId)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4">
                    <StatusPill tone={statusTone[booking.status]} dot>
                      {dispatchStatusLabels[booking.status]}
                    </StatusPill>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                      {nextActionLabel(booking)}
                    </p>
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 font-medium text-[var(--foreground)]">
                    {driverName(drivers, booking.driverId)}
                  </td>
                  <td className="border-t border-[var(--border)] px-4 py-4 text-right font-medium text-[var(--foreground)]">
                    <p>{formatPeso(booking.priceEstimate)}</p>
                    <p className="mt-1 text-xs font-normal text-[var(--muted-foreground)]">
                      {formatApproxDistance(booking.estimatedDistanceKm)}
                    </p>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border-t border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted-foreground)]"
                  >
                    No bookings match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

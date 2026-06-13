"use client";

import { useMemo, useState } from "react";
import { MapPin, RadioTower, Route, Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ServiceBadge } from "@/components/service-badge";
import { StatusPill } from "@/components/status-pill";
import { getLocationName, pampangaLocations } from "@/data/pampanga-locations";
import {
  dispatchStatusLabels,
  getNextBookingStatuses,
  type DispatchStatus,
} from "@/domain/dispatch-status";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import {
  findAvailableDrivers,
  getSuggestedDriverDistanceKm,
  suggestDriverForBooking,
} from "@/lib/dispatch";
import { formatApproxDistance } from "@/lib/distance";
import { formatPeso } from "@/lib/format";

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

const activeStatuses: DispatchStatus[] = ["assigned", "picked_up", "in_transit"];

export default function DispatchPage() {
  const { bookings, drivers, assignDriver, updateBookingStatus } =
    useDispatchDemo();
  const [assignmentMessage, setAssignmentMessage] = useState<string>();
  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "pending"),
    [bookings],
  );
  const availableDrivers = useMemo(() => findAvailableDrivers(drivers), [drivers]);
  const activeBookings = useMemo(
    () => bookings.filter((booking) => activeStatuses.includes(booking.status)),
    [bookings],
  );

  function driverName(driverId?: string) {
    if (!driverId) {
      return "Unassigned";
    }

    return drivers.find((driver) => driver.id === driverId)?.name ?? "Unknown";
  }

  function handleAssign(bookingId: string, driverId?: string) {
    const result = assignDriver(bookingId, driverId);

    if (!result.ok) {
      setAssignmentMessage(result.message);
      return;
    }

    setAssignmentMessage(
      `${result.booking.id} assigned to ${result.driver.name} for this session.`,
    );
  }

  function handleStatusChange(bookingId: string, nextStatus: DispatchStatus) {
    updateBookingStatus(bookingId, nextStatus);
    setAssignmentMessage(
      `${bookingId} moved to ${dispatchStatusLabels[nextStatus]} locally.`,
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch"
        eyebrow="Local dispatch logic"
        meta={`${pendingBookings.length} pending, ${availableDrivers.length} available`}
        description="Review pending bookings, see deterministic driver suggestions, and apply session-only assignments."
      />

      <section className="pd-card-flat rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning-foreground)]">
              <RadioTower className="size-4" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Local review state
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                Assignment uses availability, service capability, and approximate
                straight-line distance from the driver location to pickup. It is
                demo logic only and does not persist after refresh.
              </p>
            </div>
          </div>
          <StatusPill tone="warning" dot>
            Session only
          </StatusPill>
        </div>

        {assignmentMessage ? (
          <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
            {assignmentMessage}
          </p>
        ) : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="pd-card rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Pending bookings
            </h2>
            <StatusPill tone="warning">{pendingBookings.length}</StatusPill>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => {
                const suggestedDriver = suggestDriverForBooking(
                  booking,
                  drivers,
                  pampangaLocations,
                );
                const driverDistanceKm = suggestedDriver
                  ? getSuggestedDriverDistanceKm(
                      booking,
                      suggestedDriver,
                      pampangaLocations,
                    )
                  : undefined;

                return (
                  <div key={booking.id} className="grid gap-4 p-4 lg:grid-cols-2">
                    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {booking.id}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {booking.customerName}
                        </p>
                        <div className="mt-2">
                          <ServiceBadge serviceType={booking.serviceType} />
                        </div>
                      </div>
                      <div className="md:text-right">
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          Estimate
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                          {formatPeso(booking.priceEstimate)}
                        </p>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {formatApproxDistance(booking.estimatedDistanceKm)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                          <MapPin className="size-3.5" strokeWidth={1.8} />
                          Pickup
                        </p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">
                          {getLocationName(booking.pickupLocationId)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                          <Route className="size-3.5" strokeWidth={1.8} />
                          Drop-off
                        </p>
                        <p className="mt-1 text-sm text-[var(--foreground)]">
                          {getLocationName(booking.dropOffLocationId)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3">
                      <p className="text-xs font-medium text-[var(--muted-foreground)]">
                        Suggested driver
                      </p>
                      {suggestedDriver ? (
                        <>
                          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[var(--foreground)]">
                                {suggestedDriver.name}
                              </p>
                              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                {suggestedDriver.vehicleType} near{" "}
                                {getLocationName(suggestedDriver.currentLocationId)}
                              </p>
                              {driverDistanceKm !== undefined ? (
                                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                                  {formatApproxDistance(driverDistanceKm)} from
                                  pickup
                                </p>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleAssign(booking.id, suggestedDriver.id)
                              }
                              className="pd-pressable inline-flex justify-center rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-foreground)] hover:bg-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                            >
                              Assign
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          No available driver currently matches this service.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="p-4 text-sm text-[var(--muted-foreground)]">
                No pending bookings in the current local session.
              </p>
            )}
          </div>
        </section>

        <section className="pd-card-flat rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Available drivers
            </h2>
            <StatusPill tone="success">{availableDrivers.length}</StatusPill>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {availableDrivers.map((driver) => (
              <div key={driver.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success-foreground)]">
                      <Truck className="size-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {driver.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {driver.vehicleType}
                      </p>
                    </div>
                  </div>
                  <StatusPill tone="success" dot>
                    Available
                  </StatusPill>
                </div>
                <p className="mt-3 rounded-xl bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
                  Current location: {getLocationName(driver.currentLocationId)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="pd-card rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Assigned bookings
          </h2>
          <StatusPill tone="info">{activeBookings.length}</StatusPill>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {activeBookings.length > 0 ? (
            activeBookings.map((booking) => {
              const nextStatuses = getNextBookingStatuses(booking.status);

              return (
                <div
                  key={booking.id}
                  className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {booking.id}
                      </p>
                      <StatusPill tone={statusTone[booking.status]} dot>
                        {dispatchStatusLabels[booking.status]}
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {driverName(booking.driverId)} assigned from{" "}
                      {getLocationName(booking.pickupLocationId)} to{" "}
                      {getLocationName(booking.dropOffLocationId)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {nextStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(booking.id, status)}
                        className="pd-pressable rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        {dispatchStatusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-sm text-[var(--muted-foreground)]">
              Assign a pending booking to populate this local session panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

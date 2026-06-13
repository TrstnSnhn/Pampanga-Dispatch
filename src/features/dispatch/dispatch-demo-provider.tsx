"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sampleBookings } from "@/data/sample-bookings";
import { sampleDrivers } from "@/data/sample-drivers";
import type { Booking } from "@/domain/booking";
import type { DispatchStatus } from "@/domain/dispatch-status";
import type { Driver } from "@/domain/driver";
import {
  createLocalBooking,
  type BookingValidationErrors,
  type CreateBookingInput,
  validateBookingInput,
} from "@/lib/booking-factory";
import {
  applyBookingStatusTransition,
  assignDriverToBooking,
  suggestDriverForBooking,
} from "@/lib/dispatch";
import { pampangaLocations } from "@/data/pampanga-locations";

type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; errors: BookingValidationErrors };

type AssignDriverResult =
  | { ok: true; booking: Booking; driver: Driver }
  | { ok: false; message: string };

type UpdateBookingStatusResult =
  | { ok: true; booking: Booking; drivers: Driver[] }
  | { ok: false; message: string };

type DispatchDemoContextValue = {
  bookings: Booking[];
  drivers: Driver[];
  createBooking: (input: CreateBookingInput) => CreateBookingResult;
  assignDriver: (
    bookingId: Booking["id"],
    driverId?: Driver["id"],
  ) => AssignDriverResult;
  updateBookingStatus: (
    bookingId: Booking["id"],
    nextStatus: DispatchStatus,
  ) => UpdateBookingStatusResult;
  resetDemoState: () => void;
};

const DispatchDemoContext = createContext<DispatchDemoContextValue | null>(null);

function cloneBookings() {
  return sampleBookings.map((booking) => ({ ...booking }));
}

function cloneDrivers() {
  return sampleDrivers.map((driver) => ({ ...driver }));
}

export function DispatchDemoProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(cloneBookings);
  const [drivers, setDrivers] = useState<Driver[]>(cloneDrivers);
  const [nextLocalSequence, setNextLocalSequence] = useState(1);

  const createBooking = useCallback(
    (input: CreateBookingInput): CreateBookingResult => {
      const errors = validateBookingInput(input);

      if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
      }

      const booking = createLocalBooking(input, {
        sequence: nextLocalSequence,
      });

      setBookings((currentBookings) => [booking, ...currentBookings]);
      setNextLocalSequence((sequence) => sequence + 1);

      return { ok: true, booking };
    },
    [nextLocalSequence],
  );

  const assignDriver = useCallback(
    (
      bookingId: Booking["id"],
      driverId?: Driver["id"],
    ): AssignDriverResult => {
      const booking = bookings.find((candidate) => candidate.id === bookingId);

      if (!booking) {
        return { ok: false, message: "Booking was not found." };
      }

      const driver =
        drivers.find((candidate) => candidate.id === driverId) ??
        suggestDriverForBooking(booking, drivers, pampangaLocations);

      if (!driver) {
        return {
          ok: false,
          message: "No available driver can handle this booking yet.",
        };
      }

      try {
        const assignment = assignDriverToBooking(booking, driver);

        setBookings((currentBookings) =>
          currentBookings.map((candidate) =>
            candidate.id === booking.id ? assignment.booking : candidate,
          ),
        );
        setDrivers((currentDrivers) =>
          currentDrivers.map((candidate) =>
            candidate.id === driver.id ? assignment.driver : candidate,
          ),
        );

        return { ok: true, ...assignment };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error ? error.message : "Assignment failed.",
        };
      }
    },
    [bookings, drivers],
  );

  const updateBookingStatus = useCallback(
    (
      bookingId: Booking["id"],
      nextStatus: DispatchStatus,
    ): UpdateBookingStatusResult => {
      const booking = bookings.find((candidate) => candidate.id === bookingId);

      if (!booking) {
        return { ok: false, message: "Booking was not found." };
      }

      try {
        const result = applyBookingStatusTransition(booking, drivers, nextStatus);

        setBookings((currentBookings) =>
          currentBookings.map((candidate) =>
            candidate.id === bookingId ? result.booking : candidate,
          ),
        );
        setDrivers(result.drivers);

        return { ok: true, ...result };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error ? error.message : "Status update failed.",
        };
      }
    },
    [bookings, drivers],
  );

  const resetDemoState = useCallback(() => {
    setBookings(cloneBookings());
    setDrivers(cloneDrivers());
    setNextLocalSequence(1);
  }, []);

  const value = useMemo(
    () => ({
      bookings,
      drivers,
      createBooking,
      assignDriver,
      updateBookingStatus,
      resetDemoState,
    }),
    [
      assignDriver,
      bookings,
      createBooking,
      drivers,
      resetDemoState,
      updateBookingStatus,
    ],
  );

  return (
    <DispatchDemoContext.Provider value={value}>
      {children}
    </DispatchDemoContext.Provider>
  );
}

export function useDispatchDemo() {
  const context = useContext(DispatchDemoContext);

  if (!context) {
    throw new Error("useDispatchDemo must be used inside DispatchDemoProvider.");
  }

  return context;
}

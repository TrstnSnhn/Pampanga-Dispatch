"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ClipboardList,
  MapPinned,
  RadioTower,
  Route,
  Settings,
  Truck,
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getLocationName } from "@/data/pampanga-locations";
import { dispatchStatusLabels } from "@/domain/dispatch-status";
import { useDispatchDemo } from "@/features/dispatch/dispatch-demo-provider";
import {
  findAvailableDrivers,
  summarizeDispatchOperations,
} from "@/lib/dispatch";
import { formatPeso } from "@/lib/format";

const quickLinks = [
  {
    href: "/bookings",
    label: "Bookings",
    description: "Review sample ride, parcel, and food delivery requests.",
    icon: ClipboardList,
  },
  {
    href: "/drivers",
    label: "Drivers",
    description: "Check local driver availability and active assignments.",
    icon: Truck,
  },
  {
    href: "/dispatch",
    label: "Dispatch",
    description: "Compare pending bookings with available drivers.",
    icon: RadioTower,
  },
  {
    href: "/map",
    label: "Map",
    description: "View Pampanga service-area markers and a booking preview.",
    icon: MapPinned,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "See the current project configuration placeholders.",
    icon: Settings,
  },
];

export default function Home() {
  const { bookings, drivers } = useDispatchDemo();
  const summary = useMemo(() => summarizeDispatchOperations(bookings), [bookings]);
  const availableDrivers = useMemo(() => findAvailableDrivers(drivers), [drivers]);
  const nextBooking =
    bookings.find((booking) => booking.status === "pending") ??
    bookings.find((booking) =>
      ["assigned", "picked_up", "in_transit"].includes(booking.status),
    ) ??
    bookings[0];
  const summaryCards = [
    {
      label: "Active bookings",
      value: summary.active,
      note: "Assigned, picked up, or in transit",
      icon: ClipboardList,
      tone: "green" as const,
    },
    {
      label: "Available drivers",
      value: availableDrivers.length,
      note: "Ready for dispatch review",
      icon: Truck,
      tone: "blue" as const,
    },
    {
      label: "Pending dispatches",
      value: summary.pending,
      note: "Waiting for assignment",
      icon: RadioTower,
      tone: "amber" as const,
    },
    {
      label: "Completed today",
      value: summary.completed,
      note: "Completed in local session",
      icon: Route,
      tone: "clay" as const,
    },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Pampanga Dispatch"
        eyebrow="Map-first dispatch console"
        meta="Phase 3B workflow polish"
        description="A local operations dashboard for reviewing Pampanga bookings, drivers, dispatch state, and map context."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            note={card.note}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="pd-card rounded-2xl p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                Operations overview
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                The current workspace connects local booking records, driver
                availability, and a Pampanga map preview without pretending
                real routing is ready.
              </p>
            </div>
            <StatusPill tone="warning" dot>
              Routing not enabled
            </StatusPill>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-[var(--surface-raised)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Next pending booking
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {nextBooking?.id ?? "None"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                {nextBooking
                  ? `${getLocationName(nextBooking.pickupLocationId)} to ${getLocationName(nextBooking.dropOffLocationId)}`
                  : "Create a local booking to populate this panel."}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface-raised)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Dispatch state
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {nextBooking
                  ? dispatchStatusLabels[nextBooking.status]
                  : "No booking"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                Status transitions now run locally for the current session.
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface-raised)] p-4">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                Sample estimate
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {nextBooking ? formatPeso(nextBooking.priceEstimate) : "None"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                Static local data, not route-calculated.
              </p>
            </div>
          </div>
        </div>

        <div className="pd-card-flat rounded-2xl p-5">
          <StatusPill tone="info">Modernized from Java OOP CLI</StatusPill>
          <h2 className="mt-4 text-base font-semibold text-[var(--foreground)]">
            Legacy preserved, product model evolving
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            The old CLI remains intact under `legacy/java-cli`. This interface
            builds the modern dispatch story around honest sample data.
          </p>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Workspace sections
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Use these views to inspect the current sample operations model.
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="pd-card-flat pd-pressable rounded-2xl p-4 hover:border-[var(--accent)] hover:bg-[var(--surface-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--muted)] text-[var(--foreground)]">
                  <link.icon className="size-4" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {link.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

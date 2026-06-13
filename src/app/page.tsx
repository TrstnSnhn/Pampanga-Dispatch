import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { sampleBookings } from "@/data/sample-bookings";
import { sampleDrivers } from "@/data/sample-drivers";

const summaryCards = [
  {
    label: "Active bookings",
    value: sampleBookings.filter((booking) =>
      ["assigned", "in-progress"].includes(booking.status),
    ).length,
    note: "Assigned or already moving",
  },
  {
    label: "Available drivers",
    value: sampleDrivers.filter((driver) => driver.status === "available")
      .length,
    note: "Ready for future assignment logic",
  },
  {
    label: "Pending dispatches",
    value: sampleBookings.filter((booking) => booking.status === "pending")
      .length,
    note: "Waiting for dispatcher review",
  },
  {
    label: "Completed today",
    value: sampleBookings.filter((booking) => booking.status === "completed")
      .length,
    note: "From local sample data",
  },
];

const quickLinks = [
  {
    href: "/bookings",
    label: "Bookings",
    description: "Review sample ride, parcel, and food delivery requests.",
  },
  {
    href: "/drivers",
    label: "Drivers",
    description: "Check local driver availability and active assignments.",
  },
  {
    href: "/dispatch",
    label: "Dispatch",
    description: "Compare pending bookings with available drivers.",
  },
  {
    href: "/map",
    label: "Map",
    description: "View Pampanga service-area markers and a booking preview.",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "See the current project configuration placeholders.",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Pampanga Dispatch"
        description="A clean web app foundation for modernizing the original Java OOP logistics CLI into a practical dispatch dashboard."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-sm font-medium text-[var(--muted-foreground)]">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {card.value}
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
              {card.note}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusPill tone="info">Modernized from Java OOP CLI</StatusPill>
            <h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
              Phase 1 keeps the product honest.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              This scaffold uses local TypeScript data to represent the legacy
              booking concept. Routing, assignment automation, maps,
              authentication, and database persistence are intentionally left
              for later phases.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Review sections
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--nav-active)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {link.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

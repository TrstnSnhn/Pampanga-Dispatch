import type { PampangaLocation } from "@/domain/location";

type LocationMarkerListProps = {
  locations: PampangaLocation[];
};

function formatLocationType(kind: PampangaLocation["kind"]) {
  return kind === "city" ? "City" : "Municipality";
}

export function LocationMarkerList({ locations }: LocationMarkerListProps) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Pampanga locations
        </h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Cities and municipalities currently available as map markers.
        </p>
      </div>
      <div className="max-h-[560px] divide-y divide-[var(--border)] overflow-y-auto">
        {locations.map((location) => (
          <div
            key={location.id}
            className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {location.name}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
            <span className="h-fit rounded-md bg-[var(--muted)] px-2 py-1 text-xs font-medium text-[var(--muted-foreground)]">
              {formatLocationType(location.kind)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

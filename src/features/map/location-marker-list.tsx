import type { PampangaLocation } from "@/domain/location";

type LocationMarkerListProps = {
  locations: PampangaLocation[];
};

function formatLocationType(kind: PampangaLocation["kind"]) {
  return kind === "city" ? "City" : "Municipality";
}

export function LocationMarkerList({ locations }: LocationMarkerListProps) {
  const cityCount = locations.filter((location) => location.kind === "city")
    .length;
  const municipalityCount = locations.length - cityCount;

  return (
    <section className="pd-card-flat rounded-2xl">
      <div className="border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Pampanga locations
        </h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Cities and municipalities currently available as map markers.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--info-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--info-foreground)]">
            {cityCount} cities
          </span>
          <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success-foreground)]">
            {municipalityCount} municipalities
          </span>
        </div>
      </div>
      <div className="max-h-[640px] divide-y divide-[var(--border)] overflow-y-auto">
        {locations.map((location) => (
          <div
            key={location.id}
            className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-raised)]"
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

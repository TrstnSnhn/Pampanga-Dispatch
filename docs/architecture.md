# Architecture

Pampanga Dispatch is a Next.js local demo app with a preserved Java CLI legacy project. The modern app uses typed domain models, local sample data, a session-only React provider, and a small API route for optional OSRM road-route previews.

## App Structure

```text
src/app/
  page.tsx                  Dashboard
  bookings/page.tsx         Local booking creation and booking list
  drivers/page.tsx          Driver roster
  dispatch/page.tsx         Assignment and lifecycle operations
  map/page.tsx              Pampanga map and route preview
  settings/page.tsx         Project configuration/status notes
  api/routes/osrm/route.ts  Optional OSRM demo route handler

src/components/
  app-shell.tsx             Shared shell
  sidebar-nav.tsx           Navigation
  topbar.tsx                Top status bar
  page-header.tsx           Reusable page heading
  status-pill.tsx           Status labels
  service-badge.tsx         Service type labels
  ui/map.tsx                MapCN/MapLibre component wrapper

src/domain/
  booking.ts                Booking model
  driver.ts                 Driver model
  dispatch-status.ts        Booking status flow
  location.ts               Pampanga location model
  route.ts                  Route result and provider types
  service-type.ts           Service categories

src/data/
  pampanga-locations.ts     Local cities and municipalities
  sample-bookings.ts        Seed bookings
  sample-drivers.ts         Seed drivers

src/features/
  dispatch/                 Local demo state provider
  map/                      Map, marker list, and route preview UI

src/lib/
  booking-factory.ts        Local booking creation and validation
  dispatch.ts               Driver suggestion, assignment, lifecycle helpers
  distance.ts               Straight-line distance helper
  pricing.ts                Demo price estimate helper
  osrm.ts                   OSRM request, parser, validation, timeout handling
  route-preview.ts          Straight-line fallback and route comparison helpers
```

## Domain Model Overview

- `Booking` tracks customer name, service type, pickup/drop-off locations, status, optional driver, notes, approximate distance, and price estimate.
- `Driver` tracks vehicle type, current Pampanga location, supported service types, availability, and active assignment.
- `DispatchStatus` defines the valid local lifecycle: `pending`, `assigned`, `picked_up`, `in_transit`, `completed`, and `cancelled`.
- `PampangaLocation` stores local coordinates for cities and municipalities.
- `RouteResult` separates straight-line preview routes from optional OSRM demo road routes.

## Local Demo State

`src/features/dispatch/dispatch-demo-provider.tsx` seeds state from local TypeScript sample data.

It owns:

- bookings
- drivers
- local booking creation
- driver assignment
- booking status transitions
- driver release after completion or valid cancellation

State is intentionally session-only. Refreshing the browser resets the app to the sample records.

## Routing Architecture

The map always starts with a straight-line preview built locally from pickup/drop-off coordinates. No network call is needed for this default state.

When the user clicks `Calculate road route`, the browser calls:

```text
GET /api/routes/osrm?pickupLng=...&pickupLat=...&dropoffLng=...&dropoffLat=...
```

The API route validates coordinates, calls the public OSRM demo server, parses GeoJSON route geometry, and returns a typed `RouteResult`.

## OSRM Fallback Behavior

OSRM is optional and demo-only.

Fallback behavior:

- Missing query params return a clear `400`.
- Invalid coordinate ranges return a clear `400`.
- OSRM network failures return a typed error.
- OSRM timeouts return a typed error.
- Empty or malformed OSRM responses return a typed error.
- The UI keeps the straight-line preview visible and shows a retry state.

The app does not call OSRM during build or initial page load.

## Why Legacy Java Is Preserved

The Java CLI project is the source material for the modernization case study. Keeping it under `legacy/java-cli` makes the migration story inspectable:

- old CLI structure
- old Java OOP class design
- old CSV persistence model
- new typed web app structure
- new route and dispatch UX

The legacy Java code is not rewritten in the current phases.

## Known Boundaries

- No database.
- No authentication.
- No persistence after refresh.
- No production route provider.
- No route caching.
- No traffic or road-closure model.
- No multi-stop optimization.
- No deployment configuration yet.

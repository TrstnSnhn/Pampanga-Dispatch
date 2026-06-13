# Pampanga Dispatch

Pampanga Dispatch is a modernization project for an old Java OOP logistics and delivery management final project. The original version is a CLI-based booking system for rides, parcel deliveries, and food deliveries, with simple CSV persistence.

## Legacy Project

The original Java CLI project is preserved under `legacy/java-cli`. It has not been rewritten in this phase. The current documentation captures what the legacy code and CSV files do before the project moves into a modern web implementation.

See [docs/legacy-inventory.md](docs/legacy-inventory.md) for the full inventory.

## Planned Modern Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- mapcn

## Current Status

Phase 0 legacy preservation and documentation are complete. Phase 1 scaffolded the modern Next.js foundation with local sample data. Phase 2 added the Pampanga map view, visual polish, screenshot QA evidence, and mobile layout fixes.

Phase 3A adds local-only booking creation, approximate straight-line distance estimates, service-based pricing estimates, deterministic driver suggestions, and session-only dispatch assignment. Phase 3B extends that into a complete local lifecycle: pending, assigned, picked up, in transit, completed, and cancelled where valid. Completing or cancelling an assigned booking releases the driver back to available.

Phase 4A adds an optional OSRM demo road-route preview on the map. The app still defaults to the straight-line visual preview and keeps booking prices based on approximate straight-line distance unless a future phase changes that explicitly. No database connection has been added, no authentication is enabled, and local demo state resets on refresh.

## Local Development

```bash
npm install
npm run dev
npm test
```

See [docs/logic-notes.md](docs/logic-notes.md) for the current local booking and dispatch assumptions.
See [docs/routing-notes.md](docs/routing-notes.md) for the current straight-line and optional OSRM routing assumptions.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the phased modernization plan.

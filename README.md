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

Phase 0 legacy preservation and documentation are complete. Phase 1 has scaffolded the modern Next.js foundation with local sample data, read-only dashboard pages, and no map routing or database connection yet.

## Local Development

```bash
npm install
npm run dev
```

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the phased modernization plan.

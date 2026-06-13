# GitHub Profile Notes

## Suggested Repository Description

A Pampanga-based delivery dispatch and route preview app modernized from a Java OOP CLI project.

## Public Links

- Repository: <https://github.com/TrstnSnhn/Pampanga-Dispatch>
- Live demo: <https://pampanga-dispatch.vercel.app>
- Vercel deployment page: <https://vercel.com/trstnsnhns-projects/pampanga-dispatch/8E5qKWRgvzX4i66TV27xw6J7Up8V>

## Suggested GitHub Topics

- `nextjs`
- `typescript`
- `tailwindcss`
- `maplibre`
- `mapcn`
- `osrm`
- `dispatch-system`
- `delivery-app`
- `portfolio-project`
- `oop-project`

## Suggested Pinned Repo Blurb

Modernized a Java OOP CLI logistics final project into a Pampanga-focused dispatch dashboard with local booking creation, driver assignment, lifecycle operations, MapCN map views, and optional OSRM demo route preview.

## Suggested Portfolio Bullet Points

- Preserved the original Java CLI project under `legacy/java-cli` and documented its source files, CSV data, behavior, and limitations.
- Built a modern Next.js and TypeScript dashboard around typed booking, driver, location, status, and route models.
- Implemented session-only booking creation, deterministic driver assignment, booking lifecycle transitions, and driver release behavior.
- Added a Pampanga-centered MapCN/MapLibre map with local markers, straight-line route preview, and optional OSRM demo road route.
- Hardened route fallback behavior so OSRM failures do not break the app.
- Added screenshot QA evidence, logic notes, routing notes, architecture docs, and a reviewer demo script.

## Suggested Demo Flow

1. Open the dashboard and explain that the app is a local portfolio demo.
2. Create a local booking from the Bookings page.
3. Assign a suggested driver from the Dispatch page.
4. Move the booking through the lifecycle.
5. Open the Map page and review the default straight-line preview.
6. Calculate the optional OSRM demo road route.
7. Reset back to the visual preview.
8. Call out that state is session-only and OSRM is demo-only.

## Suggested Public Repo Checklist

- Add a concise GitHub repository description.
- Add the suggested topics above.
- Confirm README screenshots render on GitHub.
- Confirm `legacy/java-cli` is preserved.
- Confirm `.agents/`, `.codex/`, and `skills-lock.json` are ignored.
- Confirm `npm test`, `npm run lint`, and `npm run build` pass locally.
- Confirm no secrets or `.env` files are committed.
- Confirm the repository displays the MIT License.
- Confirm the README live demo URL remains current after future deployments.

## Suggested Commit Summary for Portfolio

Modernized legacy Java logistics CLI into a typed Next.js dispatch demo with local booking state, driver assignment, Pampanga map routing previews, OSRM fallback handling, tests, and portfolio-ready documentation.

# Portfolio Case Study

## Problem

The original project was a Java OOP command-line logistics system for rides, parcel deliveries, and food deliveries in Pampanga. It demonstrated basic object-oriented modeling and CSV persistence, but it was difficult to inspect as a product because the workflow lived entirely in a terminal.

The modernization challenge was to keep the original academic context visible while rebuilding the idea as a portfolio-ready web dispatch experience.

## Original College Project Context

The legacy system was built as a college final project. It used Java classes, command-line menus, and CSV files to model customers, drivers, bookings, and delivery-style workflows.

The original Java code is preserved under `legacy/java-cli`. It remains intentionally untouched so the repository can show a clear before-and-after modernization path.

## Modernization Goal

Pampanga Dispatch reinterprets the CLI concept as a Pampanga-focused dispatch dashboard with local sample data, booking creation, driver assignment, lifecycle operations, and map-based route preview.

The goal is not to pretend the app is production logistics software. The goal is to demonstrate practical product thinking, typed domain modeling, routing boundaries, and clear UX around what is real versus demo-only.

## Product Decisions

- Keep the service area scoped to Pampanga.
- Preserve ride, parcel delivery, and food delivery service categories.
- Use local TypeScript data instead of adding a database too early.
- Make booking and dispatch logic session-only but functional.
- Show routing honestly: straight-line preview by default, optional OSRM demo route by user action.
- Keep price estimates tied to approximate straight-line distance until road-route pricing is designed explicitly.
- Document limitations instead of hiding them.

## What Was Improved

- CLI menus became a responsive dashboard.
- CSV-era records became typed local sample data.
- Booking status moved from static records into a session workflow.
- Driver assignment now uses deterministic local logic.
- Driver availability updates when a booking is completed or cancelled.
- The map view grounds the app in Pampanga instead of generic placeholder geography.
- Route preview now distinguishes visual straight-line distance from OSRM demo road distance.
- QA evidence and docs make the project easier to review.

## What Was Intentionally Not Added

- No database.
- No authentication.
- No production routing provider.
- No OSRM route caching.
- No multi-stop optimization.
- No traffic model.
- No deployment automation.
- No rewrite of the preserved Java CLI project.

These omissions keep the portfolio scope honest and make future phases easier to explain.

## Technical Learning Outcomes

- Migrating an OOP CLI concept into typed web-domain models.
- Designing local demo state without overbuilding global state management.
- Separating pure business helpers from UI components.
- Handling route provider failures without breaking the UI.
- Using MapCN and MapLibre GL in a Next.js app while avoiding hydration issues.
- Writing Node test-runner coverage for dispatch and route logic.
- Building documentation and QA evidence alongside product work.

## Future Improvements

- Add persistence for bookings, drivers, status history, and route results.
- Add deployment and a public demo URL.
- Add accessibility testing and keyboard-flow review.
- Cache route results or self-host OSRM for stable demos.
- Add production-grade routing provider boundaries if the project moves beyond portfolio scope.
- Expand the legacy CSV import story.
- Add richer service-specific booking fields.

# Roadmap

## Phase 0: Legacy Inventory

Status: Complete.

Milestones:

- Preserve the original Java CLI project under `legacy/java-cli`.
- Document the source files, classes, CSV files, current behavior, and limitations.
- Create a project brief and modernization roadmap.
- Update the README so the repository has a clear starting point.

Outcome: The legacy project is organized and documented without rewriting Java code or adding a web framework.

## Phase 1: Web App Scaffold

Status: Complete.

Milestones:

- Scaffold a Next.js application with TypeScript.
- Add Tailwind and shadcn/ui.
- Establish project structure, linting, formatting, and baseline UI shell.
- Create typed models for bookings, drivers, services, locations, and statuses.

Outcome: A clean modern foundation is ready for product development, with local TypeScript sample data and read-only dashboard pages.

## Phase 2: Pampanga Map View

Status: In progress. Phase 2A map view foundation is complete.

Milestones:

- Integrate a Pampanga-centered map experience with mapcn. Complete in Phase 2A.
- Add Pampanga city and municipality markers from local sample data. Complete in Phase 2A.
- Add a sample booking pickup/drop-off preview without real route calculation. Complete in Phase 2A.
- Add pickup and drop-off marker interactions. Planned for a later Phase 2 pass.
- Define expanded Pampanga landmark data. Planned.
- Display selected route context in the UI. Planned.

Outcome: Users can now view a Pampanga-focused map with service-area markers and a visual booking preview. Real routing, OSRM integration, and route estimates are still planned for later phases.

## Phase 3: Booking and Dispatch Logic

Status: Planned.

Milestones:

- Build booking flows for ride, parcel delivery, and food delivery.
- Add validation for service-specific fields.
- Create a dispatcher view for pending bookings.
- Implement basic driver assignment using vehicle type and availability.

Outcome: The app supports realistic booking intake and operational dispatch workflows.

## Phase 4: Routing and Estimates

Status: Planned.

Milestones:

- Add route previews between pickup and drop-off points.
- Calculate distance, estimated duration, and price estimates.
- Show service-specific estimate details before booking confirmation.
- Handle edge cases for missing routes or invalid locations.

Outcome: Bookings include useful route and cost context instead of static placeholder values.

## Phase 5: Portfolio Polish

Status: Planned.

Milestones:

- Refine responsive layouts, empty states, loading states, and error states.
- Add sample data and a strong demo flow for portfolio review.
- Write technical documentation explaining the legacy-to-modern migration.
- Add tests for core booking, dispatch, and estimate logic.
- Prepare deployment and final README screenshots or demo notes.

Outcome: Pampanga Dispatch is presentation-ready as a polished modernization case study.

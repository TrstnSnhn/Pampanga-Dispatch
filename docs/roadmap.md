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

Status: Planned.

Milestones:

- Scaffold a Next.js application with TypeScript.
- Add Tailwind and shadcn/ui.
- Establish project structure, linting, formatting, and baseline UI shell.
- Create typed models for bookings, drivers, services, locations, and statuses.

Outcome: A clean modern foundation is ready for product development.

## Phase 2: Pampanga Map View

Status: Planned.

Milestones:

- Integrate a Pampanga-centered map experience with mapcn.
- Add pickup and drop-off marker interactions.
- Define initial Pampanga city/municipality and landmark data.
- Display selected route context in the UI.

Outcome: Users can interact with a Pampanga-focused map instead of entering plain CLI text.

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

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

Status: Complete through Phase 2C.

Milestones:

- Integrate a Pampanga-centered map experience with mapcn. Complete in Phase 2A.
- Add Pampanga city and municipality markers from local sample data. Complete in Phase 2A.
- Add a sample booking pickup/drop-off preview without real route calculation. Complete in Phase 2A.
- Refine the app shell, dashboard, data pages, map panels, and status styling into a more portfolio-ready operations interface. Complete in Phase 2B.
- Capture desktop and mobile screenshot QA evidence and address small responsive issues. Complete in Phase 2C.
- Add pickup and drop-off marker interactions. Planned for a later Phase 2 pass.
- Define expanded Pampanga landmark data. Planned.
- Display selected route context in the UI. Planned.

Outcome: Users can now view a Pampanga-focused map with service-area markers and a visual booking preview inside a more polished local dispatch dashboard. Real routing, OSRM integration, and route estimates are still planned for later phases.

## Phase 3: Booking and Dispatch Logic

Status: In progress. Phase 3A booking and dispatch logic foundation and Phase 3B workflow polish are complete.

Milestones:

- Build a local booking creation flow for ride, parcel delivery, and food delivery. Complete in Phase 3A.
- Add validation for required fields and same pickup/drop-off prevention. Complete in Phase 3A.
- Add approximate straight-line distance and price estimate helpers. Complete in Phase 3A.
- Create a dispatcher view for pending, available, and assigned local session records. Complete in Phase 3A.
- Implement deterministic driver suggestions using availability, service capability, and nearby current location. Complete in Phase 3A.
- Add local status operations for pending, assigned, picked up, in transit, completed, and cancelled states. Complete in Phase 3B.
- Release assigned drivers when a booking is completed or cancelled before pickup. Complete in Phase 3B.
- Add booking filters and workflow labels for local session review. Complete in Phase 3B.
- Persist bookings and assignments beyond refresh. Planned.
- Expand service-specific fields and operational edge cases. Planned.

Outcome: The app now supports local session booking intake, driver assignment, and a complete demo lifecycle without pretending to have persistence, authentication, or real road routing.

## Phase 4: Routing and Estimates

Status: In progress. Phase 4A road route preview and Phase 4B route UX hardening are complete.

Milestones:

- Keep a straight-line pickup/drop-off preview as the default fallback. Complete in Phase 4A.
- Add an optional OSRM demo road-route lookup triggered by the user. Complete in Phase 4A.
- Show the difference between approximate straight-line distance and demo road-route distance/duration. Complete in Phase 4A.
- Handle missing or unavailable OSRM routes without breaking the map. Complete in Phase 4A.
- Add selected-booking route review controls on the map page. Complete in Phase 4B.
- Add reset/retry route controls and a compact route comparison panel. Complete in Phase 4B.
- Add API/query validation, timeout handling, and route UX screenshot evidence. Complete in Phase 4B.
- Calculate service-specific estimate details before booking confirmation. Planned.
- Decide whether road-route distance should influence pricing, and label it clearly if added. Planned.
- Add route polish such as map bounds fitting, richer fallback provider options, and persisted route history. Planned for a later Phase 4 pass.

Outcome: The map now has useful route context without pretending to provide production-grade routing. Straight-line distance remains the price estimate basis, and OSRM is treated as optional demo infrastructure.

## Phase 5: Portfolio Polish

Status: In progress. Phase 5A portfolio packaging and repository cleanup are complete.

Milestones:

- Refine responsive layouts, empty states, loading states, and error states. Ongoing.
- Add sample data and a strong demo flow for portfolio review. Complete through Phase 5A.
- Write technical documentation explaining the legacy-to-modern migration. Complete through Phase 5A.
- Add portfolio README screenshots and GitHub presentation notes. Complete in Phase 5A.
- Add final portfolio QA review notes. Complete in Phase 5A.
- Add tests for core booking, dispatch, and estimate logic.
- Prepare deployment and final README screenshots or demo notes.

Outcome: Pampanga Dispatch is presentation-ready as a polished modernization case study.

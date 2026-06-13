# Phase 4B Route Review

Date of review: June 13, 2026

## Route Checked

- `/map`

## Viewports Checked

- Desktop: 1440 x 900
- Mobile: 390 x 844

## Screenshots Captured

- `desktop-map-straight-preview.png`
- `desktop-map-road-route.png`
- `mobile-map-straight-preview.png`
- `mobile-map-road-route.png`

OSRM succeeded during this review, so fallback screenshots were not captured.

## Browser Console Result

- No hydration errors were observed.
- No application runtime errors were observed.
- Chromium emitted WebGL `ReadPixels` performance warnings while capturing map screenshots. These appeared during screenshot capture and did not block the route workflow.

## Build, Lint, and Test Result

- `npm.cmd test`: passed with 21 tests.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.

## Visual Findings

- Straight-line preview is visible by default and clearly labeled.
- OSRM road route renders as a separate solid route state after user action.
- Selected booking, pickup, drop-off, booking price, route mode, provider, road distance, duration, and comparison values are visible in the route panel.
- Mobile layout remains readable, with the map, location list, selected booking, route actions, and comparison stacked in a usable order.

## Fixes Made

- Added booking selection on the map page.
- Added route comparison values.
- Added reset to visual preview.
- Added recalculate and retry labels based on route state.
- Improved provider labeling so the UI does not expose raw route-provider keys.
- Hardened OSRM query validation and request timeout behavior.

## Known Limitations

- OSRM is demo-only and can fail without notice.
- Route results are not persisted.
- Route results are not cached.
- Booking prices still use straight-line estimates.
- The map does not fit bounds to the selected route.
- There is no production dispatch routing, traffic model, or multi-stop optimization.

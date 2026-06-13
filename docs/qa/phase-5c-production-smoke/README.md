# Phase 5C Production Smoke

## Review Date

2026-06-14

## Links

- Production app: <https://pampanga-dispatch.vercel.app>
- Vercel deployment page: <https://vercel.com/trstnsnhns-projects/pampanga-dispatch/8E5qKWRgvzX4i66TV27xw6J7Up8V>
- GitHub repository: <https://github.com/TrstnSnhn/Pampanga-Dispatch>

## Commands Run

```text
git status --short
npm.cmd test
npm.cmd run lint
npm.cmd run build
git diff -- legacy/java-cli
curl.exe -I https://pampanga-dispatch.vercel.app/
curl.exe -I https://pampanga-dispatch.vercel.app/bookings
curl.exe -I https://pampanga-dispatch.vercel.app/drivers
curl.exe -I https://pampanga-dispatch.vercel.app/dispatch
curl.exe -I https://pampanga-dispatch.vercel.app/map
curl.exe -I https://pampanga-dispatch.vercel.app/settings
```

## Command Results

- Working tree was clean before documentation edits.
- `npm.cmd test`: passed, 21 tests.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- `git diff -- legacy/java-cli`: no output.
- Production route `HEAD` checks returned `200 OK` for all reviewed routes.

## Routes Checked

- `/`
- `/bookings`
- `/drivers`
- `/dispatch`
- `/map`
- `/settings`

## Workflow Checked

Production browser smoke verified:

1. Opened `/bookings`.
2. Created `BKG-LOCAL-001` as a session-only parcel delivery booking.
3. Opened `/dispatch` using in-app navigation.
4. Assigned the suggested driver, John Santos.
5. Moved the booking through `Picked up`, `In transit`, and `Completed`.
6. Confirmed John Santos returned to the available drivers panel.
7. Refreshed the page and confirmed the local booking disappeared, matching the expected session-only reset.

## Map Route Behavior

- Opened production `/map`.
- Confirmed straight-line visual preview loaded by default.
- Clicked `Calculate road route`.
- OSRM demo road route loaded successfully during this review.
- Clicked `Reset to visual preview`.
- Confirmed the map returned to the straight-line visual preview state.

If OSRM is unavailable in a later review, the expected behavior is a fallback message while the straight-line preview remains usable.

## Browser Console Result

Playwright production smoke reported:

- Console errors: none.
- Relevant warnings: none.
- Hydration errors: none.
- Page errors: none.

## Known Production Limitations

- State is session-only and resets on refresh.
- No database or persistence layer exists yet.
- No authentication or user roles exist yet.
- OSRM is optional demo routing, not production infrastructure.
- No route caching, traffic model, or multi-stop optimization exists yet.
- Booking prices remain based on approximate straight-line distance.

## Final Verdict

The deployed Vercel app is ready for public portfolio review as a local demo. The production app loads, the route preview degrades safely, the booking lifecycle works in-session, and the documented limitations remain accurate.

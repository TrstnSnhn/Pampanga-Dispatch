# Demo Script

This flow is designed for a portfolio reviewer. It demonstrates what currently works while making the limitations explicit.

## 1. Open Dashboard

Route: `/`

Point out:

- Pampanga Dispatch is a local operations demo.
- Metrics come from session-only sample data.
- The app is modernized from a preserved Java OOP CLI project.

## 2. Go to Bookings

Route: `/bookings`

Point out:

- Existing sample bookings are visible.
- Booking statuses are readable.
- Pickup and drop-off locations use local Pampanga data.

## 3. Create a Booking

Use the local booking form.

Suggested demo input:

- Customer name: `Portfolio Reviewer`
- Service type: `Parcel delivery`
- Pickup: `Angeles City`
- Drop-off: `San Fernando`
- Notes: `Small demo parcel`

Point out:

- Required fields are validated.
- Same pickup and drop-off is blocked.
- Distance and price are estimated locally.
- The booking only exists for the current browser session.

## 4. Go to Dispatch

Route: `/dispatch`

Point out:

- Pending bookings are listed.
- Available drivers are listed separately.
- Suggested driver logic uses availability, service capability, and approximate distance.

## 5. Assign a Driver

Click the assign action for a pending booking.

Point out:

- Booking status moves to `assigned`.
- Driver becomes assigned/unavailable.
- This is deterministic local demo logic, not production dispatch automation.

## 6. Move Booking Through Lifecycle

Use the visible next-action buttons:

1. Assigned to picked up.
2. Picked up to in transit.
3. In transit to completed.

Point out:

- Invalid transitions are not exposed in the UI.
- Completed bookings are terminal.
- Completing a booking releases the assigned driver back to available.
- Cancelling an assigned booking before pickup also releases the driver.

## 7. Open Map

Route: `/map`

Point out:

- The map is centered on Pampanga.
- Pampanga cities and municipalities are visible as markers.
- The selected booking appears above the map.
- The default route preview is a straight-line visual preview.

## 8. Calculate Road Route

Click `Calculate road route`.

Point out:

- The app calls a local Next route handler.
- The route handler calls OSRM only after user action.
- Road distance and duration are shown separately.
- Booking price does not automatically change.
- If OSRM fails, the app keeps the straight-line preview and shows a retry state.

## 9. Reset to Visual Preview

Click `Reset to visual preview`.

Point out:

- The map returns to the straight-line fallback.
- Route state is local UI state.
- Nothing is persisted to a database.

## 10. Explain Limitations

Be explicit:

- State resets on refresh.
- No auth.
- No database.
- No production routing infrastructure.
- No route caching.
- No traffic model.
- No multi-stop optimization.
- OSRM is demo-only and can be unavailable.

# Logic Notes

Phase 3A added practical local booking and dispatch behavior for the modern Pampanga Dispatch app. Phase 3B extends it with session-only lifecycle management. Phase 4A adds an optional demo road-route preview while keeping the straight-line fallback. Phase 4B hardens that route flow with reset/retry controls, route comparison, and timeout handling. The logic is intentionally small, deterministic, and honest about its limits.

## Local Demo State

- Bookings and drivers are stored in a client-side React provider.
- State is seeded from local TypeScript sample data.
- New bookings and assignments last only for the current browser session.
- Status changes also last only for the current browser session.
- Refreshing the page resets the data to the sample records.
- No database, authentication, server actions, or API persistence is connected.

## Approximate Distance

- Distance is calculated with a Haversine straight-line formula between Pampanga location coordinates.
- The value is labeled as approximate.
- It is not road distance and does not account for traffic, road shape, closures, or routing constraints.
- The map dashed line remains a visual preview only.
- Phase 4A can request an optional OSRM demo road route from the map page, but that value is shown separately from the booking price estimate.

## Route Preview Assumptions

- Straight-line preview is available by default and never requires a network request.
- OSRM demo routing is requested only when the user clicks `Calculate road route`.
- OSRM request and response geometry coordinates use `[longitude, latitude]` order.
- OSRM road distance and duration are labeled as demo references.
- Route selection and route preview state are local UI state only.
- Selecting a different booking resets the map back to the straight-line preview.
- Resetting a route returns to the straight-line fallback without changing booking data.
- If OSRM is unavailable or returns malformed data, the app keeps showing the straight-line fallback.
- See [routing-notes.md](routing-notes.md) for the fuller routing explanation.

## Price Estimate Assumptions

- Estimates are based on service type plus approximate straight-line distance.
- Each service has a simple base fare, per-kilometer rate, and minimum fare.
- Prices are rounded to the nearest ten pesos.
- These estimates are demo values, not production pricing rules.
- Phase 4A does not silently change booking prices after a road-route lookup.

## Driver Assignment Assumptions

- Only available drivers can be assigned.
- A driver must support the booking service type.
- Suggested drivers are sorted by approximate straight-line distance from the driver's current location to the pickup location.
- Ties are resolved by driver name for deterministic results.
- Assigning a booking changes the booking status to `assigned` and the driver status to `assigned`.
- Completing an assigned booking releases the driver back to `available`.
- Cancelling an assigned booking before pickup releases the driver back to `available`.
- Cancelling an unassigned pending booking does not affect driver state.

## Status Flow

Valid booking statuses:

- `pending`
- `assigned`
- `picked_up`
- `in_transit`
- `completed`
- `cancelled`

Allowed transitions:

- `pending` to `assigned` or `cancelled`
- `assigned` to `picked_up` or `cancelled`
- `picked_up` to `in_transit`
- `in_transit` to `completed`

Completed and cancelled bookings are terminal states in this phase.

## Known Limitations

- No persistence after refresh.
- No server-side conflict checks.
- OSRM is optional demo routing, not production route infrastructure.
- No traffic model, route caching, route persistence, or multi-stop optimization.
- No account, role, or authentication model.
- No production-grade pricing rules.
- Driver current locations are static sample values.
- Assignment is a deterministic suggestion, not real dispatch automation.

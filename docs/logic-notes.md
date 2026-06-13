# Logic Notes

Phase 3A adds practical local booking and dispatch behavior for the modern Pampanga Dispatch app. The logic is intentionally small, deterministic, and honest about its limits.

## Local Demo State

- Bookings and drivers are stored in a client-side React provider.
- State is seeded from local TypeScript sample data.
- New bookings and assignments last only for the current browser session.
- Refreshing the page resets the data to the sample records.
- No database, authentication, server actions, or API persistence is connected.

## Approximate Distance

- Distance is calculated with a Haversine straight-line formula between Pampanga location coordinates.
- The value is labeled as approximate.
- It is not road distance and does not account for traffic, road shape, closures, or routing constraints.
- The map dashed line remains a visual preview only.

## Price Estimate Assumptions

- Estimates are based on service type plus approximate straight-line distance.
- Each service has a simple base fare, per-kilometer rate, and minimum fare.
- Prices are rounded to the nearest ten pesos.
- These estimates are demo values, not production pricing rules.

## Driver Assignment Assumptions

- Only available drivers can be assigned.
- A driver must support the booking service type.
- Suggested drivers are sorted by approximate straight-line distance from the driver's current location to the pickup location.
- Ties are resolved by driver name for deterministic results.
- Assigning a booking changes the booking status to `assigned` and the driver status to `assigned`.

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
- `picked_up` to `in_transit` or `cancelled`
- `in_transit` to `completed` or `cancelled`

Completed and cancelled bookings are terminal states in this phase.

## Known Limitations

- No persistence after refresh.
- No server-side conflict checks.
- No real routing, OSRM, duration estimate, or traffic model.
- No map route snapping to roads.
- No account, role, or authentication model.
- No production-grade pricing rules.
- Driver current locations are static sample values.
- Assignment is a deterministic suggestion, not real dispatch automation.

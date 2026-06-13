# Routing Notes

Phase 4A adds route preview foundations for Pampanga Dispatch. The app now separates the always-available straight-line preview from an optional OSRM demo road-route lookup.

## Straight-Line Preview

- The straight-line preview is built from local Pampanga sample coordinates.
- It uses the existing Haversine helper to calculate approximate distance.
- It renders as a dashed line on the map.
- It is the default and fallback route view.
- It does not follow roads and should not be treated as a travel path.

## Optional OSRM Demo Route

- The map page includes a `Calculate road route` button.
- Clicking the button calls a local Next route handler at `/api/routes/osrm`.
- The route handler calls the public OSRM demo server with the driving profile.
- OSRM output is shown as a solid route line with road distance and estimated duration.
- The app does not call OSRM during build or initial page load.
- The app continues to work if OSRM is unavailable.

## Coordinate Order

OSRM route requests and returned GeoJSON route geometry use `[longitude, latitude]` order.

This is different from the way locations are often written for humans as latitude and longitude. The code keeps this explicit in route types and helper comments to avoid reversed markers or broken route geometry.

## Distance and Pricing

- Booking estimates still use approximate straight-line distance.
- OSRM road distance is shown as a separate reference value.
- Phase 4A does not silently recalculate or replace booking prices after a route lookup.
- Future phases can add a road-route price estimate, but it should be labeled separately and documented.

## Why OSRM Is Demo-Only

The public OSRM server is useful for demonstration, but it is not project infrastructure. It can be unavailable, rate limited, or return incomplete data. Pampanga Dispatch currently treats OSRM as optional demo routing, not a production routing engine.

## Known Limitations

- No route persistence after refresh.
- No route caching.
- No traffic, road closure, ferry, truck restriction, or service-level rules.
- No multi-stop optimization.
- No fallback provider beyond the straight-line preview.
- No database storage for route results.
- Public OSRM availability can vary.

## Future Options

- Self-host OSRM for a more reliable demo environment.
- Cache successful route results.
- Add road-route-based pricing as a clearly labeled estimate.
- Add multi-stop optimization for dispatch batches.
- Store bookings, assignments, and route results in a database.

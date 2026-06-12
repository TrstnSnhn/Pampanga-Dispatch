# Legacy Inventory

This inventory documents the original Java CLI project preserved under `legacy/java-cli`. The goal is to describe the current behavior honestly before any rewrite work starts.

## File Inventory

| Path | Purpose |
| --- | --- |
| `legacy/java-cli/LogisticsDeliveryManagement.java` | Main CLI entry point and menu loop for ride, parcel delivery, and food delivery bookings. |
| `legacy/java-cli/RideService.java` | Stores passenger count and drop-off location for ride bookings; prints a placeholder driver assignment. |
| `legacy/java-cli/DeliveryService.java` | Stores pickup and drop-off locations for parcel delivery; prints a placeholder driver assignment. |
| `legacy/java-cli/FoodDeliveryService.java` | Stores selected fast food option and drop-off location; prints a placeholder driver assignment. |
| `legacy/java-cli/CSVHandler.java` | Appends comma-separated fields to a file using `FileWriter`. |
| `legacy/java-cli/ServiceBase.java` | A simple base class with `deliveryId` and `assignDriver`, but it is not currently extended by the service classes. |
| `legacy/java-cli/delivery.csv` | Minimal delivery sample row. |
| `legacy/java-cli/delivery_bookings.csv` | Sample delivery booking table. |
| `legacy/java-cli/drivers.csv` | Sample driver roster. |
| `legacy/java-cli/food_delivery.csv` | Sample food delivery order table. |
| `legacy/java-cli/ride_bookings.csv` | Sample ride booking table. |
| `legacy/java-cli/ride_service.csv` | Minimal ride booking output matching the current CLI shape. |

## Main Classes

### `LogisticsDeliveryManagement`

Runs the command-line app. It creates one instance each of `RideService`, `DeliveryService`, and `FoodDeliveryService`, then shows a looped menu:

1. Ride
2. Delivery
3. Food Delivery
4. Exit

Each service handler collects a small set of values from `Scanner`, assigns a placeholder driver, writes a row through `CSVHandler`, and prints a success message.

### `RideService`

Represents a ride request with:

- `numPassengers`
- `dropOffLocation`
- fixed placeholder `deliveryId = 1`

The class has setters/getters, a placeholder `assignDriver()` method, and a `saveDeliveryData()` helper that writes to `ride_service.csv`.

### `DeliveryService`

Represents a parcel delivery request with:

- `pickupLocation`
- `dropOffLocation`
- fixed placeholder `deliveryId = 2`

The class has setters/getters, a placeholder `assignDriver()` method, and a `saveDeliveryData()` helper that writes to `delivery_service.csv`.

### `FoodDeliveryService`

Represents a food delivery request with:

- `foodChoice`
- `dropOffLocation`
- fixed placeholder `deliveryId = 3`

The class has setters/getters, a placeholder `assignDriver()` method, and a `saveDeliveryData()` helper that writes to `food_delivery_service.csv`.

### `CSVHandler`

Provides `saveToCSV(String fileName, String[] data)`, which appends each field followed by a comma and then writes a newline. It does not write headers, escape commas, or normalize file paths.

### `ServiceBase`

Defines a reusable `deliveryId` field and `assignDriver()` method, but the current service classes do not inherit from it. It appears to be an early attempt at shared OOP structure.

## CSV Files

| File | Appears to Store | Notes |
| --- | --- | --- |
| `delivery.csv` | A minimal delivery row: id, pickup, drop-off. | Contains `0,angeles,mabalacat`. The current Java code writes delivery bookings to `delivery_service.csv`, not this file. |
| `delivery_bookings.csv` | Delivery booking records with delivery ID, package weight, pickup, drop-off, vehicle type, total price, driver ID, and payment method. | Uses tab-separated columns despite the `.csv` extension. This richer schema is not currently used by the Java CLI code. |
| `drivers.csv` | Driver ID, driver name, vehicle type, phone number, and availability. | Useful seed data for a future dispatch system, but the current CLI does not read from it. |
| `food_delivery.csv` | Food order records with order ID, fast food chain, food item, drop-off, total price, driver ID, and payment method. | Uses tab-separated columns. The current Java code writes food requests to `food_delivery_service.csv`, not this file. |
| `ride_bookings.csv` | Ride booking records with booking ID, passenger count, pickup, drop-off, total price, driver ID, and payment method. | Uses tab-separated columns. The current CLI only asks for passenger count and drop-off location. |
| `ride_service.csv` | Minimal ride booking output from the current CLI format. | Contains id, passenger count, and drop-off location. Rows may include a trailing comma because of `CSVHandler`. |

The code may also generate `delivery_service.csv` and `food_delivery_service.csv` when run, but those generated files are not currently present in the preserved legacy folder.

## Current App Behavior

The current app is a console menu for three booking flows:

- Ride booking asks for passenger count and drop-off location, then writes `deliveryId`, passenger count, and drop-off location to `ride_service.csv`.
- Parcel delivery asks for pickup and drop-off locations, then writes `deliveryId`, pickup, and drop-off to `delivery_service.csv`.
- Food delivery asks the user to choose between Jollibee, McDonald's, and KFC, then asks for a drop-off location and writes `deliveryId`, food choice number, and drop-off to `food_delivery_service.csv`.
- Exit ends the loop.

Driver assignment is currently a printed message only. The app does not read the driver roster, calculate availability, validate Pampanga locations, estimate distance, or calculate prices.

## Limitations of the Old CLI Version

- IDs are fixed placeholders instead of generated unique booking IDs.
- Driver assignment is not implemented beyond printing a message.
- The app writes CSV data but does not read existing bookings or driver data.
- CSV filenames are inconsistent with the included sample files.
- CSV output has trailing commas and no escaping, headers, or schema validation.
- Some included files are tab-separated even though they use `.csv` extensions.
- `Scanner.next()` prevents locations with spaces, such as `San Fernando`.
- There is no input validation for passenger count, food choice, payment, or location.
- There is no pricing, route estimation, status tracking, cancellation, or booking history.
- `ServiceBase` is unused, so the OOP hierarchy is incomplete.
- There is no package structure, build file, automated test suite, or documented run command.
- The system is not map-driven and has no Pampanga-specific routing model.

## Modernization Ideas

- Rebuild the user experience as a map-driven web app focused on Pampanga pickup, drop-off, routing, and dispatch workflows.
- Use Next.js, TypeScript, Tailwind, shadcn/ui, and mapcn for a modern portfolio-grade interface.
- Model bookings with typed entities for ride, parcel delivery, food delivery, drivers, vehicles, payments, and statuses.
- Replace flat CSV writes with a real persistence layer while keeping the legacy CSVs as seed/reference data.
- Add Pampanga-aware location selection, map markers, route previews, distance estimates, and delivery time estimates.
- Implement driver availability, vehicle matching, assignment rules, and booking lifecycle states.
- Add customer and dispatcher views so the app can demonstrate both booking and operations workflows.
- Include validation, error handling, audit-friendly booking records, and automated tests.
- Keep the legacy CLI preserved as historical context for the modernization story.

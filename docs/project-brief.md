# Project Brief

## Project Name

Pampanga Dispatch

## Short Description

Pampanga Dispatch is a planned map-driven logistics and delivery management web application for ride, parcel, and food delivery workflows in Pampanga.

## Original Project Context

The project began as a Java OOP college final project. The original version is a command-line logistics and delivery management system with simple booking flows and CSV-based persistence. It is preserved in `legacy/java-cli` as the historical source for the modernization effort.

## Modernization Goal

The modernization goal is to rebuild the old CLI concept as a professional web application using Next.js, TypeScript, Tailwind, shadcn/ui-ready components, MapCN, MapLibre GL, and optional OSRM demo routing. The new version keeps the original service categories while improving the product model, interface, routing experience, validation, and dispatch logic.

The current web app is a local portfolio demo. It includes session-only state, local sample data, Pampanga map markers, dispatch workflow logic, and optional demo route previews. It does not include persistence, authentication, or production routing infrastructure yet.

## Target Users

- Local customers booking rides, parcel deliveries, or food deliveries.
- Dispatchers coordinating driver assignments and booking statuses.
- Drivers receiving assigned jobs and route context.
- Recruiters or portfolio reviewers evaluating the modernization from legacy Java CLI to modern full-stack product.

## Core Features Planned

- Pampanga-focused map view with pickup and drop-off markers.
- Booking flows for ride, parcel delivery, and food delivery.
- Driver roster with vehicle type, availability, and assignment status.
- Dispatch dashboard for reviewing and assigning bookings.
- Route previews, distance estimates, estimated travel or delivery times, and pricing estimates.
- Booking lifecycle states such as pending, assigned, in progress, completed, and cancelled.
- Clean responsive interface built with reusable typed components.
- Legacy-data import or seed flow based on the preserved CSV files.

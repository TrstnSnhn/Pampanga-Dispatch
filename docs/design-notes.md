# Design Notes

Phase 2B establishes a restrained local logistics interface for Pampanga Dispatch.

## Visual Direction

- Product register: practical operations dashboard, not a marketing site.
- Theme: warm light UI for daytime dispatch review and portfolio scanning.
- Personality: local, grounded, map-first, and operational.
- Motion: minimal CSS feedback only. No heavy animation libraries.

## Token Intent

- Deep road charcoal: sidebar and shell contrast.
- Warm off-white: main app background and readable surfaces.
- Pampanga field green: primary map and operational success state.
- Muted clay: delivery/logistics accent and secondary operational emphasis.
- Soft amber: pending, warning, and not-yet-enabled states.
- Map blue: route clarity and informational map context.

Tokens live in `src/app/globals.css` as OKLCH variables so future phases can extend the palette without introducing unrelated colors.

## Component Rules

- Use rounded 16 to 24px panels for major product surfaces.
- Use status pills with dots for operational states.
- Use service badges for ride, parcel delivery, and food delivery labels.
- Keep map preview copy explicit: dashed lines are visual previews only, not road routing.
- Avoid fake SaaS claims, fake metrics, authentication UI, database UI, or route estimates until those features exist.

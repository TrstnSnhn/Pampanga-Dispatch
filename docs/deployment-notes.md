# Deployment Notes

## Recommended Target

Vercel is the recommended deployment target for the current Next.js app.

The project uses the Next.js App Router and includes a dynamic API route at:

```text
src/app/api/routes/osrm/route.ts
```

Do not configure static export for the current app, because the OSRM demo route handler must be able to run as a server route.

## Vercel Settings

Recommended defaults:

- Framework preset: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Vercel auto-detected Next.js output

No `vercel.json` is required at this stage. Vercel should auto-detect the Next.js configuration cleanly.

## Environment Variables

No environment variables are required yet.

Do not add placeholder values for:

- database URLs
- authentication secrets
- map API keys
- OSRM API keys

The current map uses local sample data and public map tiles through the existing MapCN/MapLibre setup. The optional OSRM route preview uses the public OSRM demo server through the local Next API route.

## OSRM Demo Routing

The OSRM route preview is optional and demo-only.

- The app does not call OSRM during build.
- The app does not call OSRM on initial page load.
- The user must click `Calculate road route`.
- If OSRM is unavailable, the map keeps the straight-line visual preview.

The public OSRM demo server is not production infrastructure. A production version should use a controlled routing provider or self-hosted OSRM, plus caching and failure monitoring.

## Known Deployment Limitations

- No database or persistence layer.
- Session state resets on refresh.
- No authentication.
- No route caching.
- No traffic model.
- No multi-stop optimization.
- No production-grade routing provider.
- No deployment URL has been recorded in the repository yet.

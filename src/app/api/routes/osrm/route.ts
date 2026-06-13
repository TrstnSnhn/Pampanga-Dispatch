import { NextResponse } from "next/server";
import type { RouteCoordinate } from "@/domain/route";
import { fetchOsrmRoute } from "@/lib/osrm";

export const dynamic = "force-dynamic";

function parseCoordinateParam(value: string | null) {
  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function isValidLongitude(value: number | undefined): value is number {
  return value !== undefined && value >= -180 && value <= 180;
}

function isValidLatitude(value: number | undefined): value is number {
  return value !== undefined && value >= -90 && value <= 90;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pickupLongitude = parseCoordinateParam(searchParams.get("pickupLng"));
  const pickupLatitude = parseCoordinateParam(searchParams.get("pickupLat"));
  const dropOffLongitude = parseCoordinateParam(searchParams.get("dropoffLng"));
  const dropOffLatitude = parseCoordinateParam(searchParams.get("dropoffLat"));

  if (
    !isValidLongitude(pickupLongitude) ||
    !isValidLatitude(pickupLatitude) ||
    !isValidLongitude(dropOffLongitude) ||
    !isValidLatitude(dropOffLatitude)
  ) {
    return NextResponse.json(
      { errorMessage: "Invalid pickup or drop-off coordinates." },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const pickup: RouteCoordinate = [pickupLongitude, pickupLatitude];
  const dropOff: RouteCoordinate = [dropOffLongitude, dropOffLatitude];
  const result = await fetchOsrmRoute(pickup, dropOff);

  if (!result.ok) {
    return NextResponse.json(
      {
        errorMessage:
          result.errorMessage || "OSRM demo road route is unavailable.",
      },
      {
        status: result.status ?? 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(result.route, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import { fetchOsrmRoute, parseOsrmRouteQuery } from "@/lib/osrm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseOsrmRouteQuery(searchParams);

  if (!query.ok) {
    return NextResponse.json(
      { errorMessage: query.errorMessage },
      {
        status: query.status,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const result = await fetchOsrmRoute(query.pickup, query.dropOff);

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

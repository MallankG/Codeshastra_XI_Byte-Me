// app/api/amadeus/hotel-list/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityCode = searchParams.get("cityCode");

  if (!cityCode) {
    return NextResponse.json({ error: "Missing cityCode" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch(`${req.nextUrl.origin}/api/amadeus/token`, {
      method: "POST",
    });
    const { access_token } = await tokenRes.json();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Hotel list fetch failed" }, { status: 500 });
  }
}

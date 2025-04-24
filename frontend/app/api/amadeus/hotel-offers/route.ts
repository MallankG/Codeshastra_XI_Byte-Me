// app/api/amadeus/hotel-offers/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hotelIds, checkInDate, checkOutDate } = body;

  if (!hotelIds || !checkInDate || !checkOutDate) {
    return NextResponse.json(
      { error: "Missing hotelIds, checkInDate, or checkOutDate" },
      { status: 400 }
    );
  }

  try {
    const tokenRes = await fetch(`${req.nextUrl.origin}/api/amadeus/token`, {
      method: "POST",
    });
    const { access_token } = await tokenRes.json();

    const response = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Hotel offers fetch failed" }, { status: 500 });
  }
}

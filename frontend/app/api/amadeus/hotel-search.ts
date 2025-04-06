// pages/api/amadeus/hotel-search.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hotelIds, checkInDate, checkOutDate } = req.body;

  const tokenRes = await fetch(`${req.headers.origin}/api/amadeus/token`);
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
  res.status(200).json(data);
}

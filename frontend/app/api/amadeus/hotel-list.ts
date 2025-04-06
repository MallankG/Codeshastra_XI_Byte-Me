// pages/api/amadeus/hotel-list.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cityCode } = req.query;

  const tokenRes = await fetch(`${req.headers.origin}/api/amadeus/token`);
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
  res.status(200).json(data);
}

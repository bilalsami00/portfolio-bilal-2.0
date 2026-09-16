// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type HealthResponse = {
  status: string;
};

/**
 * Minimal health endpoint. No personal data; no external calls.
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  res.status(200).json({ status: "ok" });
}

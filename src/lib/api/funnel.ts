// This file is responsible for making the API call to fetch funnel data.

import { baseUrl, headers } from "../../Enviroment/Local.enviroment";
import type { FunnelRes } from "./types";

/**
 * Fetches the funnel data.
 * @returns The funnel page data.
 */
export async function getFunnelPage(): Promise<FunnelRes> {
  const res = await fetch(`${baseUrl}`, {
    headers: headers,
  });
  return res.json();
}
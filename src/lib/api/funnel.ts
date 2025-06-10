// This file is responsible for making the API call to fetch funnel data.

import { baseUrl, headers } from "../../Enviroment/Local.enviroment";
import type { FunnelRes } from "./types";
// import classicData from "../../Mock Data/classic.json"; // Keep classic for now, or switch based on a flag
import classicData from "../../Mock Data/classic.json"; // Import NASA data

/**
 * Fetches the funnel data.
 * @returns The funnel page data.
 */
export async function getFunnelPage(): Promise<FunnelRes> {
  // For local development, use mock data
  if (import.meta.env.DEV) {
    // For testing NASA theme, directly return nasaData
    return classicData as FunnelRes;
    // return classicData as FunnelRes; // Original line for classic theme
  }
  
  // For production, use the API
  const res = await fetch(`${baseUrl}`, {
    headers: headers,
  });
  return res.json();
}
import type { FunnelRes } from "./types";

const API_BASE = "https://funnel-theme-api.vercel.app/api";

/**
 * Fetches the funnel data from remote API.
 * @param themeName - The theme to fetch (e.g. 'techno')
 * @param page - The page key (e.g. 'techno_WithVariantsWithBundles')
 * @returns The funnel page data.
 */
export async function getFunnelPage(
  themeName: string,
  page: string
): Promise<FunnelRes> {
  const url = `${API_BASE}?themeName=${themeName}&page=${page}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to fetch funnel page: ${err}`);
    throw err;
  }
}
import type { FunnelRes } from "./types";

const API_BASE = "https://funnel-theme-api.vercel.app/api";

/**
 * Fetches the funnel data from remote API.
 * @param themeName - The theme to fetch (e.g. 'techno')
 * @param page - The page key (e.g. 'techno_WithVariantsWithBundles')
 * @param blocks - Optional array of specific block names to fetch
 * @returns The funnel page data.
 */
export async function getFunnelPage(
  themeName: string,
  page: string,
  blocks?: string[]
): Promise<FunnelRes> {
  const params = new URLSearchParams({
    themeName,
    page
  });

  if (blocks && blocks.length > 0) {
    params.append('blocks', blocks.join(','));
  }

  const url = `${API_BASE}?${params.toString()}`;

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
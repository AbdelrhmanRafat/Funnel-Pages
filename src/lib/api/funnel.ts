import { baseUrl, headers } from "../../Enviroment/Local.enviroment";
import type { FunnelRes } from "./types";

// Import all mock data files
import classic_WithoutVariantsWithBundles from "../../Mock Data/classic_WithoutVariantsWithBundles.json";
import classic_WithoutVariantsWithoutBundles from "../../Mock Data/classic_WithoutVariantsWithoutBundles.json";
import classic_WithVariantsWithBundles from "../../Mock Data/classic_WithVariantsWithBundles.json";
import classic_WithVariantsWithoutBundles from "../../Mock Data/classic_WithVariantsWithoutBundles.json";
import classic from "../../Mock Data/classic.json";

import nasa_WithoutVariantsWithBundles from "../../Mock Data/nasa_WithoutVariantsWithBundles.json";
import nasa_WithoutVariantsWithoutBundles from "../../Mock Data/nasa_WithoutVariantsWithoutBundles.json";
import nasa_WithVariantsWithBundles from "../../Mock Data/nasa_WithVariantsWithBundles.json";
import nasa_WithVariantsWithoutBundles from "../../Mock Data/nasa_WithVariantsWithoutBundles.json";

// Updated enum for all mock data types
export enum FunnelDataType {
  CLASSIC_WITHOUT_VARIANTS_WITH_BUNDLES = 'classic_WithoutVariantsWithBundles',
  CLASSIC_WITHOUT_VARIANTS_WITHOUT_BUNDLES = 'classic_WithoutVariantsWithoutBundles',
  CLASSIC_WITH_VARIANTS_WITH_BUNDLES = 'classic_WithVariantsWithBundles',
  CLASSIC_WITH_VARIANTS_WITHOUT_BUNDLES = 'classic_WithVariantsWithoutBundles',
  CLASSIC_DEFAULT = 'classic',

  NASA_WITHOUT_VARIANTS_WITH_BUNDLES = 'nasa_WithoutVariantsWithBundles',
  NASA_WITHOUT_VARIANTS_WITHOUT_BUNDLES = 'nasa_WithoutVariantsWithoutBundles',
  NASA_WITH_VARIANTS_WITH_BUNDLES = 'nasa_WithVariantsWithBundles',
  NASA_WITH_VARIANTS_WITHOUT_BUNDLES = 'nasa_WithVariantsWithoutBundles',
}

// Map enum values to actual mock data
const mockDataMap = {
  [FunnelDataType.CLASSIC_WITHOUT_VARIANTS_WITH_BUNDLES]: classic_WithoutVariantsWithBundles,
  [FunnelDataType.CLASSIC_WITHOUT_VARIANTS_WITHOUT_BUNDLES]: classic_WithoutVariantsWithoutBundles,
  [FunnelDataType.CLASSIC_WITH_VARIANTS_WITH_BUNDLES]: classic_WithVariantsWithBundles,
  [FunnelDataType.CLASSIC_WITH_VARIANTS_WITHOUT_BUNDLES]: classic_WithVariantsWithoutBundles,
  [FunnelDataType.CLASSIC_DEFAULT]: classic,

  [FunnelDataType.NASA_WITHOUT_VARIANTS_WITH_BUNDLES]: nasa_WithoutVariantsWithBundles,
  [FunnelDataType.NASA_WITHOUT_VARIANTS_WITHOUT_BUNDLES]: nasa_WithoutVariantsWithoutBundles,
  [FunnelDataType.NASA_WITH_VARIANTS_WITH_BUNDLES]: nasa_WithVariantsWithBundles,
  [FunnelDataType.NASA_WITH_VARIANTS_WITHOUT_BUNDLES]: nasa_WithVariantsWithoutBundles,
};

/**
 * Fetches the funnel data.
 * @param dataType - The type of funnel data to return (only used in development mode)
 * @returns The funnel page data.
 */
export async function getFunnelPage(
  dataType: FunnelDataType = FunnelDataType.CLASSIC_DEFAULT
): Promise<FunnelRes> {
  const shouldUseMockData =
    import.meta.env.DEV ||
    import.meta.env.USE_MOCK_DATA === 'true' ||
    import.meta.env.VITE_USE_MOCK_DATA === 'true';

  if (shouldUseMockData) {
    const selectedData = mockDataMap[dataType];
    if (!selectedData) throw new Error(`Mock data not found for type: ${dataType}`);
    return selectedData as FunnelRes;
  }

  console.log("Using API call");
  const res = await fetch(`${baseUrl}`, {
    headers: headers,
  });
  return res.json();
}
import { baseUrl, headers } from "../../Enviroment/Local.enviroment";
import type { FunnelRes } from "./types";

// === Classic Theme Mock Data ===
import classic_WithoutVariantsWithBundles from "../../Mock Data/classic_WithoutVariantsWithBundles.json";
import classic_WithoutVariantsWithoutBundles from "../../Mock Data/classic_WithoutVariantsWithoutBundles.json";
import classic_WithVariantsWithBundles from "../../Mock Data/classic_WithVariantsWithBundles.json";
import classic_WithVariantsWithoutBundles from "../../Mock Data/classic_WithVariantsWithoutBundles.json";
import classic from "../../Mock Data/classic.json";

// === Enum for Funnel Data Types ===
export enum FunnelDataType {
  // Classic
  CLASSIC_WITHOUT_VARIANTS_WITH_BUNDLES = 'classic_WithoutVariantsWithBundles',
  CLASSIC_WITHOUT_VARIANTS_WITHOUT_BUNDLES = 'classic_WithoutVariantsWithoutBundles',
  CLASSIC_WITH_VARIANTS_WITH_BUNDLES = 'classic_WithVariantsWithBundles',
  CLASSIC_WITH_VARIANTS_WITHOUT_BUNDLES = 'classic_WithVariantsWithoutBundles',
  CLASSIC_DEFAULT = 'classic',

  // NASA
  NASA_WITHOUT_VARIANTS_WITH_BUNDLES = 'nasa_WithoutVariantsWithBundles',
  NASA_WITHOUT_VARIANTS_WITHOUT_BUNDLES = 'nasa_WithoutVariantsWithoutBundles',
  NASA_WITH_VARIANTS_WITH_BUNDLES = 'nasa_WithVariantsWithBundles',
  NASA_WITH_VARIANTS_WITHOUT_BUNDLES = 'nasa_WithVariantsWithoutBundles',

  // TROY
  TROY_WITHOUT_VARIANTS_WITH_BUNDLES = 'troy_WithoutVariantsWithBundles',
  TROY_WITHOUT_VARIANTS_WITHOUT_BUNDLES = 'troy_WithoutVariantsWithoutBundles',
  TROY_WITH_VARIANTS_WITH_BUNDLES = 'troy_WithVariantsWithBundles',
  TROY_WITH_VARIANTS_WITHOUT_BUNDLES = 'troy_WithVariantsWithoutBundles',
}

// === Mock Data Map ===
const mockDataMap = {
  // Classic
  [FunnelDataType.CLASSIC_WITHOUT_VARIANTS_WITH_BUNDLES]: classic_WithoutVariantsWithBundles,
  [FunnelDataType.CLASSIC_WITHOUT_VARIANTS_WITHOUT_BUNDLES]: classic_WithoutVariantsWithoutBundles,
  [FunnelDataType.CLASSIC_WITH_VARIANTS_WITH_BUNDLES]: classic_WithVariantsWithBundles,
  [FunnelDataType.CLASSIC_WITH_VARIANTS_WITHOUT_BUNDLES]: classic_WithVariantsWithoutBundles,
  [FunnelDataType.CLASSIC_DEFAULT]: classic,

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
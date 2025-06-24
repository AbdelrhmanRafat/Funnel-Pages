// This file is responsible for making the API call to fetch funnel data.
import { baseUrl, headers } from "../../Enviroment/Local.enviroment";
import type { FunnelRes } from "./types";

// Import all the mock data files
import classicProductWithVariantsAndBundles from "../../Mock Data/classic_ProductWithVariantsAndBundles.json";
import classicProductWithVariants from "../../Mock Data/classic_ProductWithVariants.json";
import classicProductWithoutVariantsAndBundles from "../../Mock Data/classic_ProductWithoutVariantsAndBundles.json";
import classicProductWithoutVariants from "../../Mock Data/classic_ProductWithoutVariants.json";

// Exported enumeration for funnel data types
export enum FunnelDataType {
  PRODUCT_WITH_VARIANTS_AND_BUNDLES = 'classic_ProductWithVariantsAndBundles',
  PRODUCT_WITH_VARIANTS = 'classic_ProductWithVariants',
  PRODUCT_WITHOUT_VARIANTS_AND_BUNDLES = 'classic_ProductWithoutVariantsAndBundles',
  PRODUCT_WITHOUT_VARIANTS = 'classic_ProductWithoutVariants'
}

// Map enum values to their corresponding data
const mockDataMap = {
  [FunnelDataType.PRODUCT_WITH_VARIANTS_AND_BUNDLES]: classicProductWithVariantsAndBundles,
  [FunnelDataType.PRODUCT_WITH_VARIANTS]: classicProductWithVariants,
  [FunnelDataType.PRODUCT_WITHOUT_VARIANTS_AND_BUNDLES]: classicProductWithoutVariantsAndBundles,
  [FunnelDataType.PRODUCT_WITHOUT_VARIANTS]: classicProductWithoutVariants
};

/**
 * Fetches the funnel data.
 * @param dataType - The type of funnel data to return (only used in development mode)
 * @returns The funnel page data.
 */
export async function getFunnelPage(
  dataType: FunnelDataType = FunnelDataType.PRODUCT_WITH_VARIANTS_AND_BUNDLES
): Promise<FunnelRes> {
  // Check multiple ways the environment variable might be set
  const shouldUseMockData = 
    import.meta.env.DEV || 
    import.meta.env.USE_MOCK_DATA === 'true' ||
    import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  if (shouldUseMockData) {
    console.log('Using mock data:', dataType);
    const selectedData = mockDataMap[dataType];
    return selectedData as FunnelRes;
  }
  
  console.log('Using API call');
  const res = await fetch(`${baseUrl}`, {
    headers: headers,
  });
  return res.json();
}
import "./ClassicBundleOptionsContainer.css";
import React, { useMemo } from 'react';
import type { Product } from "../../../../../../lib/api/types";
import type { Language } from "../../../../../../lib/utils/i18n/translations";
import { getTranslation } from "../../../../../../lib/utils/i18n/translations";
import { detectColorOption } from "../../../../../../lib/utils/Custom-Options-utils";
import { useCustomOptionBundleStore, usePanelOption } from "../../../../../../lib/stores/customOptionBundleStore";

// Types
interface OptionValue {
  value: string;
  sku_id?: number;
  hex?: string;
  image?: string;
  available_options?: any;
}

interface OptionDetail {
  key: string;
  title: string;
  values: OptionValue[];
  hasColors: boolean;
}

interface ProcessedOptionData {
  firstOption: OptionDetail | null;
  secondOption: OptionDetail | null;
  associations: { [firstValue: string]: Array<{value: string, sku_id?: number, hex?: string, image?: string}> };
}

interface ClassicBundleOptionsContainerReactProps {
  panelIndex: number;
  product: Product;
  currentLang: Language;
}

const ClassicBundleOptionsContainerReact: React.FC<ClassicBundleOptionsContainerReactProps> = ({
  panelIndex,
  product,
  currentLang,
}) => {
  // Zustand store hooks
  const { updatePanelOption } = useCustomOptionBundleStore();
  const panelOption = usePanelOption(panelIndex);

  // Process option data
  const processedData = useMemo((): ProcessedOptionData | null => {
    const isHaveVariant = product.is_have_variant === "true";
    const customOptions = product.custom_options;

    if (!isHaveVariant || !customOptions) return null;

    const optionEntries = Object.entries(customOptions);

    const firstOptionEntry = optionEntries[0];
    const firstOption: OptionDetail | null = firstOptionEntry
      ? {
          key: firstOptionEntry[0],
          title: firstOptionEntry[0],
          values: firstOptionEntry[1] as OptionValue[],
          hasColors: false,
        }
      : null;

    const secondOptionEntry = optionEntries[1];
    const secondOption: OptionDetail | null = secondOptionEntry
      ? {
          key: secondOptionEntry[0],
          title: secondOptionEntry[0],
          values: secondOptionEntry[1] as OptionValue[],
          hasColors: false,
        }
      : null;

    // Detect colors
    const colorDetection = detectColorOption(firstOption, secondOption);
    if (firstOption) firstOption.hasColors = colorDetection.firstHasColors;
    if (secondOption) secondOption.hasColors = colorDetection.secondHasColors;

    // Build associations
    const associations: { [firstValue: string]: Array<{value: string, sku_id?: number, hex?: string, image?: string}> } = {};
    if (firstOption) {
      firstOption.values.forEach((firstValueObj: OptionValue) => {
        const firstVal = firstValueObj.value;
        
        if (secondOption) {
          // Two options: use available_options structure
          if (firstValueObj.available_options && firstValueObj.available_options[secondOption.key]) {
            const availableSecondOptions = firstValueObj.available_options[secondOption.key];
            if (availableSecondOptions && Array.isArray(availableSecondOptions)) {
              associations[firstVal] = availableSecondOptions.map((item: any) => ({
                value: item.value,
                sku_id: item.sku_id,
                hex: item.hex,
                image: item.image,
              }));
            }
          }
        } else {
          // Single option: create association with the option itself
          // For single options, SKU data should be directly in the option or found via product.skus
          const skus = product.skus;
          if (skus) {
            const matchingSku = skus.find(sku => 
              sku.options?.some(opt => opt.value === firstVal)
            );
            associations[firstVal] = [{
              value: firstVal,
              sku_id: matchingSku?.id,
              hex: firstValueObj.hex || matchingSku?.options?.find(opt => opt.value === firstVal)?.hex,
              image: matchingSku?.image || firstValueObj.image,
            }];
          } else {
            // Fallback: use data directly from the option
            associations[firstVal] = [{
              value: firstVal,
              sku_id: firstValueObj.sku_id,
              hex: firstValueObj.hex,
              image: firstValueObj.image,
            }];
          }
        }
      });
    }

    return {
      firstOption,
      secondOption,
      associations,
    };
  }, [product]);

  // Helper functions
  const isSecondOptionDisabled = (secondOptValue: string): boolean => {
    if (!processedData || !panelOption?.firstOption || !processedData.associations[panelOption.firstOption]) {
      return !processedData?.secondOption;
    }
    return !processedData.associations[panelOption.firstOption].some(assoc => assoc.value === secondOptValue);
  };

  const findSkuId = (firstValue: string, secondValue: string): number | null => {
    console.log("=== FIND SKU ID DEBUG ===");
    console.log("Looking for firstValue:", firstValue);
    console.log("Looking for secondValue:", secondValue);
    console.log("Available associations:", processedData?.associations);
    
    if (!processedData?.associations[firstValue]) {
      console.log("❌ No associations found for firstValue:", firstValue);
      
      // Fallback: Check if SKU is directly in second option values
      if (processedData?.secondOption) {
        const directOption = processedData.secondOption.values.find(opt => opt.value === secondValue);
        console.log("Fallback: Direct option search result:", directOption);
        if (directOption?.sku_id) {
          console.log("✅ Found SKU in direct option:", directOption.sku_id);
          return directOption.sku_id;
        }
      }
      
      return null;
    }
    
    const availableOptions = processedData.associations[firstValue];
    console.log("Available options for", firstValue, ":", availableOptions);
    
    const matchingOption = availableOptions.find(opt => opt.value === secondValue);
    console.log("Matching option:", matchingOption);
    console.log("SKU ID from matching option:", matchingOption?.sku_id);
    
    return matchingOption?.sku_id || null;
  };

  const findImageUrl = (firstValue: string, secondValue: string): string | null => {
    if (!processedData?.associations[firstValue]) return null;
    const matchingOption = processedData.associations[firstValue].find(opt => opt.value === secondValue);
    return matchingOption?.image || null;
  };

  // Event handlers
  const handleFirstOptionSelect = (value: string) => {
    console.log("=== FIRST OPTION SELECT ===");
    console.log("Selected value:", value);
    console.log("Number of options:", panelOption?.numberOfOptions);
    console.log("Associations:", processedData?.associations);
    
    // For single option products, get SKU from associations
    let skuId = null;
    let imageUrl = null;
    
    if (panelOption?.numberOfOptions === 1 && processedData?.associations) {
      const skuData = processedData.associations[value]?.[0];
      if (skuData) {
        skuId = skuData.sku_id;
        imageUrl = skuData.image;
        console.log("Single option SKU data:", skuData);
      }
    }

    updatePanelOption(panelIndex, {
      bundleIndex: panelIndex,
      firstOption: value,
      secondOption: null, // Clear second option when first changes
      sku_id: skuId, // Set SKU for single options
      image: imageUrl, // Set image for single options
    });
  };

  const handleSecondOptionSelect = (value: string) => {
    const firstValue = panelOption?.firstOption;
    if (!firstValue) return;

    const skuId = findSkuId(firstValue, value);
    const imageUrl = findImageUrl(firstValue, value);

    console.log("=== SKU ID DEBUG ===");
    console.log("First option:", firstValue);
    console.log("Second option:", value);
    console.log("Associations:", processedData?.associations);
    console.log("Found SKU ID:", skuId);
    console.log("Found Image URL:", imageUrl);

    updatePanelOption(panelIndex, {
      bundleIndex: panelIndex,
      firstOption: firstValue,
      secondOption: value,
      sku_id: skuId,
      image: imageUrl,
    });

    // Check what was actually saved
    setTimeout(() => {
      const updatedPanel = useCustomOptionBundleStore.getState().options.find(opt => opt.bundleIndex === panelIndex);
      console.log("Updated panel after SKU save:", updatedPanel);
    }, 100);
  };

  // Component state
  const isHaveVariant = product.is_have_variant === "true";
  const showSelectionIndicators = true;
  const translatedSelectOptionsText = getTranslation("dynamicPanel.selectOptionsForProduct", currentLang) || "Select Options for Product";

  return (
    <div className="classic-bundle-options-container-panel p-4 border">
      {/* Header with Selection Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pb-3">
        <div className="classic-bundle-options-container-header font-bold text-lg sm:text-xl">
          <p className="inline">
            {translatedSelectOptionsText}{" "}
          </p>
          <span>{panelIndex}</span>
        </div>

        {showSelectionIndicators && processedData && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {processedData.firstOption && (
              <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                <span>{processedData.firstOption.title}</span>
                <span>{panelOption?.firstOption || '-'}</span>
              </div>
            )}
            {processedData.secondOption && (
              <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                <span>{processedData.secondOption.title}</span>
                <span>{panelOption?.secondOption || '-'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="py-2 md:py-1 flex flex-col justify-center md:justify-between items-start md:items-start md:flex-row gap-6 md:gap-0">
        {/* First Option Rendering */}
        {isHaveVariant && processedData?.firstOption && (
          <div className="select-option-section md:w-1/2 space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              {processedData.firstOption.title}
            </p>

            {processedData.firstOption.hasColors ? (
              <div className="flex flex-wrap justify-start content-center gap-2">
                {processedData.firstOption.values.map((option, index) => (
                  <div
                    key={option.value}
                    className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform ${
                      panelOption?.firstOption === option.value ? 'classic-bundle-options-container-selected-color' : ''
                    }`}
                    onClick={() => handleFirstOptionSelect(option.value)}
                  >
                    <div
                      className="classic-bundle-options-container-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
                      style={{ backgroundColor: option.hex || "#ccc" }}
                    />
                    <span className="classic-bundle-options-container-color-name text-xs sm:text-sm text-center">
                      {option.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="md:w-full grid grid-cols-3 gap-2 sm:gap-4 p-1">
                {processedData.firstOption.values.map((option, index) => (
                  <div
                    key={option.value}
                    className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center ${
                      panelOption?.firstOption === option.value ? 'classic-bundle-options-container-selected-size' : ''
                    }`}
                    onClick={() => handleFirstOptionSelect(option.value)}
                  >
                    {option.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Second Option Rendering */}
        {isHaveVariant && processedData?.secondOption && (
          <div className="md:w-1/2 select-option-section space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              {processedData.secondOption.title}
            </p>

            {processedData.secondOption.hasColors ? (
              <div className="flex flex-wrap justify-start content-center gap-2">
                {processedData.secondOption.values.map((option, index) => {
                  const isDisabled = isSecondOptionDisabled(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 transition-transform ${
                        isDisabled ? 'classic-bundle-options-container-option-disabled opacity-30 pointer-events-none' : 'cursor-pointer hover:scale-105'
                      } ${
                        panelOption?.secondOption === option.value && !isDisabled ? 'classic-bundle-options-container-selected-color' : ''
                      }`}
                      onClick={() => !isDisabled && handleSecondOptionSelect(option.value)}
                    >
                      <div
                        className="classic-bundle-options-container-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
                        style={{ backgroundColor: option.hex || "#ccc" }}
                      />
                      <span className="classic-bundle-options-container-color-name text-xs sm:text-sm text-center">
                        {option.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full grid grid-cols-3 gap-2 p-1">
                {processedData.secondOption.values.map((option, index) => {
                  const isDisabled = isSecondOptionDisabled(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-center ${
                        isDisabled ? 'classic-bundle-options-container-option-disabled opacity-30 pointer-events-none' : 'cursor-pointer'
                      } ${
                        panelOption?.secondOption === option.value && !isDisabled ? 'classic-bundle-options-container-selected-size' : ''
                      }`}
                      onClick={() => !isDisabled && handleSecondOptionSelect(option.value)}
                    >
                      {option.value}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Non-variant fallback */}
        {!isHaveVariant && (
          <div className="select-option-section space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              Single Product
            </p>
            <div className="py-2 px-4 border rounded-lg bg-gray-50">
              <span className="text-sm">SKU: {product.sku_code}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicBundleOptionsContainerReact;
export type { ProcessedOptionData, OptionDetail, OptionValue };
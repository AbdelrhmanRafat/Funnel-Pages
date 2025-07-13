import "./ClassicBundleOptionsContainer.css";
import React, { useMemo } from 'react';
import type { Product } from "../../../../../../lib/api/types";
import type { Language } from "../../../../../../lib/utils/i18n/translations";
import { detectColorOption } from "../../../../../../lib/utils/Custom-Options-utils";
import { useCustomOptionBundleStore, usePanelOption } from "../../../../../../lib/stores/customOptionBundleStore";

// Import components
import ContainerHeader from './components/ContainerHeader/ContainerHeader';
import SelectionIndicators from './components/SelectionIndicators/SelectionIndicators';
import OptionSection from './components/OptionSection/OptionSection';
import ColorOptions from './components/ColorOptions/ColorOptions';
import TextOptions from './components/TextOptions/TextOptions';

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

  return (
    <div className="classic-bundle-options-container-panel p-4 border">
      {/* Header with Selection Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pb-3">
        <ContainerHeader 
          panelIndex={panelIndex}
          currentLang={currentLang}
        />

        <SelectionIndicators
          showIndicators={showSelectionIndicators && !!processedData}
          firstOption={processedData?.firstOption || null}
          secondOption={processedData?.secondOption || null}
          selectedFirst={panelOption?.firstOption || null}
          selectedSecond={panelOption?.secondOption || null}
        />
      </div>

      <div className="py-2 md:py-1 flex flex-col justify-center md:justify-between items-start md:items-start md:flex-row gap-6 md:gap-0">
        {/* First Option Rendering */}
        {isHaveVariant && processedData?.firstOption && (
          <OptionSection 
            title={processedData.firstOption.title}
            className="md:w-1/2"
          >
            {processedData.firstOption.hasColors ? (
              <ColorOptions
                options={processedData.firstOption.values}
                selectedValue={panelOption?.firstOption || null}
                onSelect={handleFirstOptionSelect}
              />
            ) : (
              <TextOptions
                options={processedData.firstOption.values}
                selectedValue={panelOption?.firstOption || null}
                onSelect={handleFirstOptionSelect}
              />
            )}
          </OptionSection>
        )}

        {/* Second Option Rendering */}
        {isHaveVariant && processedData?.secondOption && (
          <OptionSection 
            title={processedData.secondOption.title}
            className="md:w-1/2"
          >
            {processedData.secondOption.hasColors ? (
              <ColorOptions
                options={processedData.secondOption.values}
                selectedValue={panelOption?.secondOption || null}
                onSelect={handleSecondOptionSelect}
                isDisabled={isSecondOptionDisabled}
              />
            ) : (
              <TextOptions
                options={processedData.secondOption.values}
                selectedValue={panelOption?.secondOption || null}
                onSelect={handleSecondOptionSelect}
                isDisabled={isSecondOptionDisabled}
              />
            )}
          </OptionSection>
        )}

        {/* Non-variant fallback */}
        {!isHaveVariant && (
          <OptionSection title="Single Product">
            <div className="py-2 px-4 border rounded-lg bg-gray-50">
              <span className="text-sm">SKU: {product.sku_code}</span>
            </div>
          </OptionSection>
        )}
      </div>
    </div>
  );
};

export default ClassicBundleOptionsContainerReact;
export type { ProcessedOptionData, OptionDetail, OptionValue };
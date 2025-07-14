import "./NeonBundleOptionsContainer.css";
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

interface NeonBundleOptionsContainerReactProps {
  panelIndex: number;
  product: Product;
  currentLang: Language;
}

const NeonBundleOptionsContainerReact: React.FC<NeonBundleOptionsContainerReactProps> = ({
  panelIndex,
  product,
  currentLang,
}) => {
  const { updatePanelOption } = useCustomOptionBundleStore();
  const panelOption = usePanelOption(panelIndex);

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

    const colorDetection = detectColorOption(firstOption, secondOption);
    if (firstOption) firstOption.hasColors = colorDetection.firstHasColors;
    if (secondOption) secondOption.hasColors = colorDetection.secondHasColors;

    const associations: { [firstValue: string]: Array<{value: string, sku_id?: number, hex?: string, image?: string}> } = {};
    if (firstOption) {
      firstOption.values.forEach((firstValueObj: OptionValue) => {
        const firstVal = firstValueObj.value;

        if (secondOption) {
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

  const isSecondOptionDisabled = (secondOptValue: string): boolean => {
    if (!processedData || !panelOption?.firstOption || !processedData.associations[panelOption.firstOption]) {
      return !processedData?.secondOption;
    }
    return !processedData.associations[panelOption.firstOption].some(assoc => assoc.value === secondOptValue);
  };

  const findSkuId = (firstValue: string, secondValue: string): number | null => {
    if (!processedData?.associations[firstValue]) {
      if (processedData?.secondOption) {
        const directOption = processedData.secondOption.values.find(opt => opt.value === secondValue);
        if (directOption?.sku_id) {
          return directOption.sku_id;
        }
      }
      return null;
    }

    const availableOptions = processedData.associations[firstValue];
    const matchingOption = availableOptions.find(opt => opt.value === secondValue);
    return matchingOption?.sku_id || null;
  };

  const findImageUrl = (firstValue: string, secondValue: string): string | null => {
    if (!processedData?.associations[firstValue]) return null;
    const matchingOption = processedData.associations[firstValue].find(opt => opt.value === secondValue);
    return matchingOption?.image || null;
  };

  const handleFirstOptionSelect = (value: string) => {
    let skuId = null;
    let imageUrl = null;

    if (panelOption?.numberOfOptions === 1 && processedData?.associations) {
      const skuData = processedData.associations[value]?.[0];
      if (skuData) {
        skuId = skuData.sku_id;
        imageUrl = skuData.image;
      }
    }

    updatePanelOption(panelIndex, {
      bundleIndex: panelIndex,
      firstOption: value,
      secondOption: null,
      sku_id: skuId,
      image: imageUrl,
    });
  };

  const handleSecondOptionSelect = (value: string) => {
    const firstValue = panelOption?.firstOption;
    if (!firstValue) return;

    const skuId = findSkuId(firstValue, value);
    const imageUrl = findImageUrl(firstValue, value);

    updatePanelOption(panelIndex, {
      bundleIndex: panelIndex,
      firstOption: firstValue,
      secondOption: value,
      sku_id: skuId,
      image: imageUrl,
    });
  };

  const isHaveVariant = product.is_have_variant === "true";
  const showSelectionIndicators = true;

  return (
    <>
    <div className="neon-bundle-options-container-panel flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 border-2 rounded-lg">
      
      {/* Header section - flex layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <ContainerHeader 
          panelIndex={panelIndex}
          currentLang={currentLang}
          className="flex-shrink-0"
        />
        <SelectionIndicators
          showIndicators={showSelectionIndicators && !!processedData}
          firstOption={processedData?.firstOption || null}
          secondOption={processedData?.secondOption || null}
          selectedFirst={panelOption?.firstOption || null}
          selectedSecond={panelOption?.secondOption || null}
          className="flex-shrink-0"
        />
      </div>

      {/* Options section - flex layout with responsive columns */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {isHaveVariant && processedData?.firstOption && (
          <OptionSection
            title={processedData.firstOption.title}
            className="flex-1 lg:flex-[0.4]"
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

        {isHaveVariant && processedData?.secondOption && (
          <OptionSection
            title={processedData.secondOption.title}
            className="flex-1 lg:flex-[0.6]"
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

        {!isHaveVariant && (
          <OptionSection title="Single Product" className="flex-1">
            <div className="neon-bundle-options-single-product flex items-center gap-3 py-4 px-6 border-2 rounded-lg">
              <span className="text-sm sm:text-base font-medium">SKU: {product.sku_code}</span>
            </div>
          </OptionSection>
        )}
      </div>
    </div>
    </>
  );
};

export default NeonBundleOptionsContainerReact;
export type { ProcessedOptionData, OptionDetail, OptionValue };
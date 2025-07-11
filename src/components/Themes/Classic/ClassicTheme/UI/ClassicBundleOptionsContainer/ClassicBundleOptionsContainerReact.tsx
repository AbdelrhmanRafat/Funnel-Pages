import React from 'react';
import type { Product } from "../../../../../../lib/api/types"; // Assuming CustomOptions is part of Product or defined elsewhere
import type { Language } from "../../../../../../lib/utils/i18n/translations";

// Define interfaces for the optionData structure for clarity
interface OptionValue {
  value: string;
  sku_id?: number; // If applicable
  hex?: string;    // For color swatches
  image?: string;  // If there's an image associated
  available_options?: any; // For nested available options if any
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
  isHaveVariant: boolean; // Derived from product.is_have_variant
  optionData: ProcessedOptionData | null;
  skuNoVariant?: string; // product.sku_code
  nOfOptions: number;
  showSelectionIndicators?: boolean;
  currentLang: Language;
  getTranslation: (key: string, lang?: Language, vars?: Record<string, string | number>) => string | undefined;


}

const ClassicBundleOptionsContainerReact: React.FC<ClassicBundleOptionsContainerReactProps> = ({
  panelIndex,
  isHaveVariant,
  optionData,
  skuNoVariant,
  nOfOptions,
  showSelectionIndicators = true,
  currentLang,
  getTranslation,
  selectedFirstOptionValue,
  selectedSecondOptionValue,
  // availableSecondOptionValues = new Set(),
}) => {

  // Helper to determine if a second option should be disabled
  const isSecondOptionDisabled = (secondOptValue: string): boolean => {
    if (!optionData || !selectedFirstOptionValue || !optionData.associations[selectedFirstOptionValue]) {
      // If no first option selected, or no associations, all second options might be considered disabled or enabled based on desired default
      return !optionData?.secondOption; // Disable if no second option data at all
    }
    return !optionData.associations[selectedFirstOptionValue].some(assoc => assoc.value === secondOptValue);
  };

  const translatedSelectOptionsText = getTranslation ? getTranslation("dynamicPanel.selectOptionsForProduct", currentLang) : `Select Options for Product`;


  return (
    <div className="classic-bundle-options-container-panel p-4 border">
      {/* Header with Selection Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pb-3">
        <div className="classic-bundle-options-container-header font-bold text-lg sm:text-xl">
          <p className="inline">
            {translatedSelectOptionsText} {/* Using translated text */}
          </p>
          <span /* data-options-panel-index-display */>{panelIndex}</span>
        </div>

        {showSelectionIndicators && optionData && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {optionData.firstOption && (
              <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                <span>{optionData.firstOption.title}</span>
                <span /* data-selected-first-option */>{selectedFirstOptionValue || '-'}</span>
              </div>
            )}
            {optionData.secondOption && (
              <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                <span>{optionData.secondOption.title}</span>
                <span /* data-selected-second-option */>{selectedSecondOptionValue || '-'}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="py-2 md:py-1 flex flex-col justify-center md:justify-between items-start md:items-start md:flex-row gap-6 md:gap-0">
        {isHaveVariant && optionData?.firstOption && (
          <div className="select-option-section md:w-1/2 space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              {optionData.firstOption.title}
            </p>

            {optionData.firstOption.hasColors ? (
              <div className="flex flex-wrap justify-start content-center gap-2">
                {optionData.firstOption.values.map((option, index) => (
                  <div
                    key={option.value}
                    className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform ${
                      selectedFirstOptionValue === option.value ? 'classic-bundle-options-container-selected-color' : ''
                    }`}
                    // data-option-type="first" // For .ts
                    // data-option-value={option.value}
                    // data-option-index={index}
                    // onClick={() => handleFirstOptionSelect(option.value)} // Interactivity later
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
                {optionData.firstOption.values.map((option, index) => (
                  <div
                    key={option.value}
                    className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center ${
                      selectedFirstOptionValue === option.value ? 'classic-bundle-options-container-selected-size' : ''
                    }`}
                    // onClick={() => handleFirstOptionSelect(option.value)} // Interactivity later
                  >
                    {option.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isHaveVariant && optionData?.secondOption && (
          <div className="md:w-1/2 select-option-section space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              {optionData.secondOption.title}
            </p>

            {optionData.secondOption.hasColors ? (
              <div className="flex flex-wrap justify-start content-center gap-2">
                {optionData.secondOption.values.map((option, index) => {
                  const isDisabled = isSecondOptionDisabled(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 transition-transform ${
                        isDisabled ? 'classic-bundle-options-container-option-disabled' : 'cursor-pointer hover:scale-105'
                      } ${
                        selectedSecondOptionValue === option.value && !isDisabled ? 'classic-bundle-options-container-selected-color' : ''
                      }`}
                      // onClick={() => !isDisabled && handleSecondOptionSelect(option.value)} // Interactivity later
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
                {optionData.secondOption.values.map((option, index) => {
                  const isDisabled = isSecondOptionDisabled(option.value);
                  return (
                  <div
                    key={option.value}
                    className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-center ${
                      isDisabled ? 'classic-bundle-options-container-option-disabled' : 'cursor-pointer'
                    } ${
                      selectedSecondOptionValue === option.value && !isDisabled ? 'classic-bundle-options-container-selected-size' : ''
                    }`}
                    // onClick={() => !isDisabled && handleSecondOptionSelect(option.value)} // Interactivity later
                  >
                    {option.value}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!isHaveVariant && (
          <div className="select-option-section space-y-2">
            <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
              Single Product
            </p>
            <div className="py-2 px-4 border rounded-lg bg-gray-50">
              <span className="text-sm">SKU: {skuNoVariant}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicBundleOptionsContainerReact;
export type { ProcessedOptionData, OptionDetail, OptionValue }; // Export types for Astro

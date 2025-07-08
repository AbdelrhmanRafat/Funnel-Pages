import React, { useMemo, useState } from 'react';
import './ClassicBundleOptionsContainer.css';
import type { Product, CustomOptions } from '../../../../../../lib/api/types';
import { detectColorOption } from '../../../../../../lib/utils/Custom-Options-utils';
import { useCustomOptionStore } from '../../../../../../lib/stores/customOptionBundleStore';

interface ClassicBundleOptionsContainerProps {
  product: Product;
  panelIndex: number;
  allowMultipleSelection?: boolean;
  enableAutoSelect?: boolean;
}

const ClassicBundleOptionsContainer: React.FC<ClassicBundleOptionsContainerProps> = ({
  product,
  panelIndex,
  allowMultipleSelection = false,
  enableAutoSelect = false,
}) => {
  const isHaveVariant = product.is_have_variant === 'true';
  const customOptions: CustomOptions = product.custom_options;
  const nOfOptions: number = Object.keys(customOptions).length;
  const skuNoVariant = product.sku_code;
  const showSelectionIndicators = true;

  // Zustand store for this panel
  const panelOption = useCustomOptionStore((state) => state.getPanelOption(panelIndex));
  const updatePanelOption = useCustomOptionStore((state) => state.updatePanelOption);

  // Build optionData as in Astro
  const optionData = useMemo(() => {
    if (!isHaveVariant || !customOptions) return null;
    const optionEntries = Object.entries(customOptions);
    const firstOption = optionEntries[0]
      ? {
          key: optionEntries[0][0],
          title: optionEntries[0][0],
          values: optionEntries[0][1],
        }
      : null;
    const secondOption = optionEntries[1]
      ? {
          key: optionEntries[1][0],
          title: optionEntries[1][0],
          values: optionEntries[1][1],
        }
      : null;
    const colorDetection = detectColorOption(firstOption, secondOption);
    const associations: any = {};
    if (firstOption && secondOption) {
      firstOption.values.forEach((firstValue: any) => {
        const availableSecondOptions = firstValue.available_options?.[secondOption.key];
        if (availableSecondOptions && Array.isArray(availableSecondOptions)) {
          associations[firstValue.value] = availableSecondOptions.map((item: any) => ({
            value: item.value,
            sku_id: item.sku_id,
            hex: item.hex,
            image: item.image,
          }));
        }
      });
    }
    return {
      firstOption: firstOption
        ? {
            ...firstOption,
            hasColors: colorDetection.firstHasColors,
          }
        : null,
      secondOption: secondOption
        ? {
            ...secondOption,
            hasColors: colorDetection.secondHasColors,
          }
        : null,
      associations,
    };
  }, [isHaveVariant, customOptions]);

  // Local state for selections (for UI only, syncs to Zustand)
  const [selectedFirst, setSelectedFirst] = useState<string | null>(panelOption?.firstOption || null);
  const [selectedSecond, setSelectedSecond] = useState<string | null>(panelOption?.secondOption || null);

  // When a first option is selected
  const handleFirstOptionClick = (value: string) => {
    setSelectedFirst(value);
    setSelectedSecond(null);
    updatePanelOption(panelIndex, {
      firstOption: value,
      secondOption: null,
      sku_id: null,
      image: null,
      numberOfOptions: nOfOptions,
    });
  };

  // When a second option is selected
  const handleSecondOptionClick = (value: string) => {
    setSelectedSecond(value);
    // Find sku_id and image from associations
    let sku_id = null;
    let image = null;
    if (selectedFirst && optionData?.associations[selectedFirst]) {
      const found = optionData.associations[selectedFirst].find((opt: any) => opt.value === value);
      if (found) {
        sku_id = found.sku_id;
        image = found.image;
      }
    }
    updatePanelOption(panelIndex, {
      firstOption: selectedFirst,
      secondOption: value,
      sku_id,
      image,
      numberOfOptions: nOfOptions,
    });
  };

  // UI rendering
  return (
    <div id="classic-bundle-options-container" className="classic-bundle-options-container">
      <div className="classic-bundle-options-container-panel p-4 border">
        {/* Header with Selection Indicators */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pb-3">
          <div className="classic-bundle-options-container-header font-bold text-lg sm:text-xl">
            <p className="inline" data-translate="dynamicPanel.selectOptionsForProduct"></p>
            <span data-options-panel-index-display>{panelIndex}</span>
          </div>
          {showSelectionIndicators && optionData && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {optionData.firstOption && (
                <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                  <span>{optionData.firstOption.title}</span>
                  <span data-selected-first-option="">{selectedFirst}</span>
                </div>
              )}
              {optionData.secondOption && (
                <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
                  <span>{optionData.secondOption.title}</span>
                  <span data-selected-second-option="">{selectedSecond}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="py-2 md:py-1 flex flex-col justify-center md:justify-between items-start md:items-start md:flex-row gap-6 md:gap-0">
          {/* First Option */}
          {optionData?.firstOption && (
            <div className="select-option-section md:w-1/2 space-y-2">
              <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
                {optionData.firstOption.title}
              </p>
              {optionData.firstOption.hasColors ? (
                <div className="flex flex-wrap justify-start content-center gap-2">
                  {optionData.firstOption.values.map((option: any, index: number) => {
                    const isSelected = selectedFirst === option.value;
                    return (
                      <div
                        key={index}
                        className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform ${isSelected ? 'classic-bundle-options-container-selected-color classic-selected' : ''}`}
                        data-option-type="first"
                        data-option-value={option.value}
                        data-option-index={index}
                        onClick={() => handleFirstOptionClick(option.value)}
                      >
                        <div
                          className="classic-bundle-options-container-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
                          style={{ backgroundColor: option.hex || '#ccc' }}
                        />
                        <span className="classic-bundle-options-container-color-name text-xs sm:text-sm text-center">
                          {option.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="md:w-full grid grid-cols-3 gap-2 sm:gap-4 p-1">
                  {optionData.firstOption.values.map((option: any, index: number) => {
                    const isSelected = selectedFirst === option.value;
                    return (
                      <div
                        key={index}
                        className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center ${isSelected ? 'classic-bundle-options-container-selected-size classic-selected' : ''}`}
                        data-option-type="first"
                        data-option-value={option.value}
                        data-option-index={index}
                        onClick={() => handleFirstOptionClick(option.value)}
                      >
                        {option.value}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {/* Second Option */}
          {optionData?.secondOption && (
            <div className="md:w-1/2 select-option-section space-y-2">
              <p className="classic-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
                {optionData.secondOption.title}
              </p>
              {optionData.secondOption.hasColors ? (
                <div className="flex flex-wrap justify-start content-center gap-2">
                  {optionData.secondOption.values.map((option: any, index: number) => {
                    // Only enable if selectedFirst is set and association exists
                    const isAvailable = selectedFirst && optionData.associations[selectedFirst]?.some((opt: any) => opt.value === option.value);
                    const isSelected = selectedSecond === option.value;
                    return (
                      <div
                        key={index}
                        className={`classic-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform ${isAvailable ? 'classic-bundle-options-container-option-available' : 'classic-bundle-options-container-option-disabled'} ${isSelected ? 'classic-bundle-options-container-selected-color classic-selected' : ''}`}
                        data-option-type="second"
                        data-option-value={option.value}
                        data-option-index={index}
                        onClick={() => isAvailable && handleSecondOptionClick(option.value)}
                        style={{ pointerEvents: isAvailable ? 'auto' : 'none', opacity: isAvailable ? 1 : 0.3 }}
                      >
                        <div
                          className="classic-bundle-options-container-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
                          style={{ backgroundColor: option.hex || '#ccc' }}
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
                  {optionData.secondOption.values.map((option: any, index: number) => {
                    const isAvailable = selectedFirst && optionData.associations[selectedFirst]?.some((opt: any) => opt.value === option.value);
                    const isSelected = selectedSecond === option.value;
                    return (
                      <div
                        key={index}
                        className={`classic-bundle-options-container-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center ${isAvailable ? 'classic-bundle-options-container-option-available' : 'classic-bundle-options-container-option-disabled'} ${isSelected ? 'classic-bundle-options-container-selected-size classic-selected' : ''}`}
                        data-option-type="second"
                        data-option-value={option.value}
                        data-option-index={index}
                        onClick={() => isAvailable && handleSecondOptionClick(option.value)}
                        style={{ pointerEvents: isAvailable ? 'auto' : 'none', opacity: isAvailable ? 1 : 0.3 }}
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
                <span className="text-sm">SKU: {skuNoVariant}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicBundleOptionsContainer; 
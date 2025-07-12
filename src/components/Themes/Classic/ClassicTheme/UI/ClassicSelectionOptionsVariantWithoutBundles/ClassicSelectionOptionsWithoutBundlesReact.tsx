import "./classicSelectionOptionsWithoutBundles.css";
import React, { useEffect } from 'react';
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";

// Import the option components
import ClassicColorOptionsWithoutBundlesReact from "./Color Options/ClassicColorOptionsWithoutBundlesReact.tsx";
import ClassicTextOptionsWithoutBundlesReact from "./Text Options/ClassicTextOptionsWithoutBundlesReact.tsx";
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore.ts";

// Types for processedOptionData
interface OptionValueReact {
  value: string;
  hex?: string;
  sku_id?: number;
  price?: number;
  price_after_discount?: number;
  image?: string;
  qty?: number;
}

interface OptionDetailReact {
  key: string;
  title: string;
  values: OptionValueReact[];
  hasColors: boolean;
}

interface ProcessedOptionDataReact {
  firstOption: OptionDetailReact | null;
  secondOption: OptionDetailReact | null;
  associations?: { [firstValue: string]: Array<{ 
    value: string, 
    sku_id?: number, 
    hex?: string, 
    price?: number,
    price_after_discount?: number,
    image?: string, 
    qty?: number 
  }> };
}

interface ClassicSelectionOptionsWithoutBundlesReactProps {
  isHaveVariant: boolean;
  hasSecondOption: boolean;
  processedOptionData: ProcessedOptionDataReact | null;
  qtyNonVariant: number;
  skuNoVariant: string;
  basePrice: number | null;
  basePriceAfterDiscount: number | null;
  baseImage: string | null;
  currentLang: Language;
}

const ClassicSelectionOptionsWithoutBundlesReact: React.FC<ClassicSelectionOptionsWithoutBundlesReactProps> = ({
  isHaveVariant,
  hasSecondOption,
  processedOptionData,
  qtyNonVariant,
  skuNoVariant,
  basePrice,
  basePriceAfterDiscount,
  baseImage,
  currentLang,
}) => {

  // Zustand store hooks
  const {
    selectedOption,
    setVariantConfig,
    setNoVariantProduct,
    setFirstOptionLabel,
    setSecondOptionLabel,
    setQty,
    setFullSkuData,
    reset
  } = useProductStore();

  // Initialize store on mount
  useEffect(() => {
    // Reset store first
    reset();
    
    // Set variant configuration
    setVariantConfig({
      isHaveVariant,
      hasSecondOption
    });

    // If no variant, set the base product data with qty = 1
    if (!isHaveVariant) {
      setNoVariantProduct({
        sku_id: parseInt(skuNoVariant) || null,
        price: basePrice,
        price_after_discount: basePriceAfterDiscount,
        image: baseImage,
        qty: 1  // Start with qty = 1, not qtyNonVariant
      });
    }
  }, [isHaveVariant, hasSecondOption, skuNoVariant, basePrice, basePriceAfterDiscount, baseImage, qtyNonVariant]);

  // Handle first option selection
  const handleFirstOptionSelect = (value: string) => {
    setFirstOptionLabel(value);
    
    // If no second option, immediately set SKU data
    if (!hasSecondOption && processedOptionData?.associations) {
      const skuData = processedOptionData.associations[value]?.[0];
      if (skuData) {
        setFullSkuData(
          skuData.sku_id || 0,
          skuData.price || basePrice || 0,
          skuData.price_after_discount || basePriceAfterDiscount || 0,
          skuData.image || baseImage || "",
          1
        );
      }
    }
  };

  // Handle second option selection
  const handleSecondOptionSelect = (value: string) => {
    setSecondOptionLabel(value);
    
    // Set complete SKU data when both options are selected
    if (selectedOption.firstOption && processedOptionData?.associations) {
      const availableOptions = processedOptionData.associations[selectedOption.firstOption];
      const skuData = availableOptions?.find(opt => opt.value === value);
      
      if (skuData) {
        setFullSkuData(
          skuData.sku_id || 0,
          skuData.price || basePrice || 0,
          skuData.price_after_discount || basePriceAfterDiscount || 0,
          skuData.image || baseImage || "",
          1
        );
      }
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    const maxQty = getMaxQuantity();
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQty(newQuantity);
    }
  };

  // Get max quantity based on current selection
  const getMaxQuantity = (): number => {
    if (!isHaveVariant) {
      return qtyNonVariant;
    }

    if (!selectedOption.firstOption) {
      return 1; // Default when no selection
    }

    if (!hasSecondOption && processedOptionData?.associations) {
      const skuData = processedOptionData.associations[selectedOption.firstOption]?.[0];
      return skuData?.qty || 1;
    }

    if (hasSecondOption && selectedOption.secondOption && processedOptionData?.associations) {
      const availableOptions = processedOptionData.associations[selectedOption.firstOption];
      const skuData = availableOptions?.find(opt => opt.value === selectedOption.secondOption);
      return skuData?.qty || 1;
    }

    return 1;
  };

  // Check if second option is disabled
  const isSecondOptionDisabled = (secondOptValue: string): boolean => {
    if (!isHaveVariant || !processedOptionData?.firstOption || !selectedOption.firstOption || !processedOptionData.associations) {
      return !processedOptionData?.secondOption;
    }
    
    const availableForFirst = processedOptionData.associations[selectedOption.firstOption];
    if (!availableForFirst) return true;
    
    return !availableForFirst.some(assoc => assoc.value === secondOptValue);
  };

  // Quantity controls
  const maxQty = getMaxQuantity();
  const currentQty = selectedOption.qty;
  const isSelectionComplete = isHaveVariant ? 
    (hasSecondOption ? 
      selectedOption.firstOption && selectedOption.secondOption :
      selectedOption.firstOption) :
    true;

  const handleDecrease = () => {
    if (currentQty > 1) {
      handleQuantityChange(currentQty - 1);
    }
  };

  const handleIncrease = () => {
    if (currentQty < maxQty) {
      handleQuantityChange(currentQty + 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > maxQty) {
      value = maxQty;
    }
    handleQuantityChange(value);
  };

  return (
    <div className="classic-selection-options-without-bundles w-full">
      <section id="classic-selection-options-without-bundles-section">
        <div className="flex gap-6 flex-col-reverse">

          {/* OPTIONS SECTION */}
          {isHaveVariant && processedOptionData && (
            <div className="flex-1">
              <div className="space-y-6">
                {/* First Option */}
                {processedOptionData.firstOption && (
                  <div className="classic-selection-options-without-bundles-option-group">
                    {processedOptionData.firstOption.hasColors ? (
                      <div className="classic-selection-options-without-bundles-color-grid flex flex-wrap gap-3">
                        {processedOptionData.firstOption.values.map((option, index) => (
                          <ClassicColorOptionsWithoutBundlesReact
                            key={option.value}
                            option={option}
                            index={index}
                            optionType="first"
                            isSelected={selectedOption.firstOption === option.value}
                            onClick={() => handleFirstOptionSelect(option.value)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="classic-selection-options-without-bundles-text-grid grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {processedOptionData.firstOption.values.map((option, index) => (
                          <ClassicTextOptionsWithoutBundlesReact
                            key={option.value}
                            option={option}
                            index={index}
                            optionType="first"
                            isSelected={selectedOption.firstOption === option.value}
                            onClick={() => handleFirstOptionSelect(option.value)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Second Option */}
                {processedOptionData.secondOption && (
                  <div className="classic-selection-options-without-bundles-option-group">
                    {processedOptionData.secondOption.hasColors ? (
                      <div className="classic-selection-options-without-bundles-color-grid flex flex-wrap gap-3">
                        {processedOptionData.secondOption.values.map((option, index) => {
                          const isDisabled = isSecondOptionDisabled(option.value);
                          return (
                            <ClassicColorOptionsWithoutBundlesReact
                              key={option.value}
                              option={option}
                              index={index}
                              optionType="second"
                              isSelected={selectedOption.secondOption === option.value && !isDisabled}
                              isDisabled={isDisabled}
                              onClick={() => !isDisabled && handleSecondOptionSelect(option.value)}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="classic-selection-options-without-bundles-text-grid flex flex-wrap justify-start content-start gap-3">
                        {processedOptionData.secondOption.values.map((option, index) => {
                          const isDisabled = isSecondOptionDisabled(option.value);
                          return (
                            <ClassicTextOptionsWithoutBundlesReact
                              key={option.value}
                              option={option}
                              index={index}
                              optionType="second"
                              isSelected={selectedOption.secondOption === option.value && !isDisabled}
                              isDisabled={isDisabled}
                              onClick={() => !isDisabled && handleSecondOptionSelect(option.value)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUANTITY SECTION */}
          <div className="flex-1 lg:max-w-xs">
            <div className="space-y-4">
              <div>
                <div className="flex justify-start items-center gap-1 pb-4">
                  <div>
                    <label className="classic-selection-options-without-bundles-qty-label text-2xl font-bold">
                      {getTranslation("productFunnel.maxAvailable", currentLang)}
                    </label>
                  </div>
                  
                  {/* Show max quantity when selection is complete */}
                  {isHaveVariant && (
                    <div
                      className={`classic-selection-options-without-bundles-max-qty-display text-2xl font-bold ${isSelectionComplete ? '' : 'hidden'}`}
                    >
                      <span className="inline-block ms-1">
                        <span className="classic-selection-options-without-bundles-max-qty-value">
                          {maxQty}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Show max quantity for non-variant products */}
                  {!isHaveVariant && (
                    <div className="classic-selection-options-without-bundles-max-qty-display text-2xl font-bold">
                      <span className="inline-block ms-1">
                        <span className="classic-selection-options-without-bundles-max-qty-value font-medium">
                          {qtyNonVariant}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="classic-selection-options-without-bundles-qty-controls flex items-center gap-3">
                  <button
                    type="button"
                    className="classic-selection-options-without-bundles-qty-btn classic-selection-options-without-bundles-qty-decrease w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDecrease}
                    disabled={currentQty <= 1}
                  >
                    <span className="text-lg font-medium select-none">−</span>
                  </button>

                  <input
                    type="number"
                    className="classic-selection-options-without-bundles-qty-input w-20 h-10 text-center rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200"
                    value={currentQty}
                    min="1"
                    max={maxQty}
                    onChange={handleInputChange}
                  />

                  <button
                    type="button"
                    className="classic-selection-options-without-bundles-qty-btn classic-selection-options-without-bundles-qty-increase w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleIncrease}
                    disabled={currentQty >= maxQty}
                  >
                    <span className="text-lg font-medium select-none">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClassicSelectionOptionsWithoutBundlesReact;
export type { ProcessedOptionDataReact, OptionDetailReact, OptionValueReact };
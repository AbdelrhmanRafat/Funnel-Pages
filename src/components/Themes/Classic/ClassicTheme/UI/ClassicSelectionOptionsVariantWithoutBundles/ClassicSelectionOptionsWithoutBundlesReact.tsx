import React from 'react';
import type { Product, CustomOptions } from "../../../../../../lib/api/types";
import type { Language } from "../../../../../../lib/utils/i18n/translations";

// Import the already converted option components
import ClassicColorOptionsWithoutBundlesReact from "./Color Options/ClassicColorOptionsWithoutBundlesReact.tsx";
import ClassicTextOptionsWithoutBundlesReact from "./Text Options/ClassicTextOptionsWithoutBundlesReact.tsx";

// Types for processedOptionData (simplified version of what Astro frontmatter produces)
interface OptionValueReact {
  value: string;
  hex?: string;
  // available_options might not be directly needed by this presentational component if filtering logic is external
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
  // associations, firstOptionMetadata, secondOptionMetadata, basePrice etc.
  // are used by the .ts logic. For pure UI, we might only need the options structure.
  // However, to determine disabled state of second option, associations are useful.
  associations?: { [firstValue: string]: Array<{ value: string, sku_id?: number, hex?: string, image?: string, qty?: number }> };
}


interface ClassicSelectionOptionsWithoutBundlesReactProps {
  isHaveVariant: boolean;
  processedOptionData: ProcessedOptionDataReact | null;

  // Quantity related props
  initialQty?: number;
  maxQty?: number; // Max available quantity based on selection
  currentQuantity?: number; // Controlled quantity value

  // For non-variant display
  qtyNonVariant?: number;

  // Selection state
  selectedFirstOptionValue?: string;
  selectedSecondOptionValue?: string;

  // Callbacks for interactivity (to be handled by parent/interactivity layer)
  onFirstOptionSelect?: (value: string) => void;
  onSecondOptionSelect?: (value: string) => void;
  onQuantityChange?: (newQuantity: number) => void;

  getTranslation: (key: string, lang?: Language, vars?: Record<string, string | number>) => string;
  currentLang: Language;
}

const ClassicSelectionOptionsWithoutBundlesReact: React.FC<ClassicSelectionOptionsWithoutBundlesReactProps> = ({
  isHaveVariant,
  processedOptionData,
  initialQty = 1,
  maxQty = 1, // Default to 1 if not variant or no selection
  currentQuantity,
  qtyNonVariant = 1,
  selectedFirstOptionValue,
  selectedSecondOptionValue,
  onFirstOptionSelect = () => {},
  onSecondOptionSelect = () => {},
  onQuantityChange = () => {},
  getTranslation,
  currentLang,
}) => {

  const actualCurrentQuantity = currentQuantity ?? initialQty;

  const handleDecrease = () => {
    if (actualCurrentQuantity > 1) {
      onQuantityChange(actualCurrentQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (actualCurrentQuantity < (maxQty || 1)) { // Use maxQty prop
      onQuantityChange(actualCurrentQuantity + 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (maxQty && value > maxQty) {
      value = maxQty;
    }
    onQuantityChange(value);
  };

  const handleInputBlur = () => {
    // If currentQuantity is not set (uncontrolled), reset to initialQty or clamped value
    if (currentQuantity === undefined) {
        let value = parseInt(String(actualCurrentQuantity), 10); // from input or internal state
        if (isNaN(value) || value < 1) value = 1;
        else if (maxQty && value > maxQty) value = maxQty;
        // If onQuantityChange was meant to update a parent, this might be redundant
        // or should ensure the parent gets the final clamped value.
        // For now, assuming onQuantityChange updates the value displayed if controlled.
    }
  };


  const isSecondOptionDisabled = (secondOptValue: string): boolean => {
    if (!isHaveVariant || !processedOptionData?.firstOption || !selectedFirstOptionValue || !processedOptionData.associations) {
      return !processedOptionData?.secondOption; // Disable if no second option definition or no first selection
    }
    const availableForFirst = processedOptionData.associations[selectedFirstOptionValue];
    if (!availableForFirst) return true; // All disabled if no associations for current first selection
    return !availableForFirst.some(assoc => assoc.value === secondOptValue);
  };

  const displayMaxQty = isHaveVariant ? (maxQty ?? 0) : qtyNonVariant;


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
                    {/* Title for first option can be added here if needed, original astro didn't have explicit title render here */}
                    {/* <h4 className="classic-selection-options-without-bundles-option-title">{processedOptionData.firstOption.title}</h4> */}
                    {processedOptionData.firstOption.hasColors ? (
                      <div className="classic-selection-options-without-bundles-color-grid flex flex-wrap gap-3">
                        {processedOptionData.firstOption.values.map((option, index) => (
                          <ClassicColorOptionsWithoutBundlesReact
                            key={option.value}
                            option={option}
                            index={index}
                            optionType="first"
                            isSelected={selectedFirstOptionValue === option.value}
                            onClick={() => onFirstOptionSelect(option.value)}
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
                            isSelected={selectedFirstOptionValue === option.value}
                            onClick={() => onFirstOptionSelect(option.value)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Second Option */}
                {processedOptionData.secondOption && (
                  <div className="classic-selection-options-without-bundles-option-group">
                    {/* <h4 className="classic-selection-options-without-bundles-option-title">{processedOptionData.secondOption.title}</h4> */}
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
                              isSelected={selectedSecondOptionValue === option.value && !isDisabled}
                              onClick={() => !isDisabled && onSecondOptionSelect(option.value)}
                              // Pass disabled state if ClassicColorOptionsWithoutBundlesReact handles it for styling
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
                              isSelected={selectedSecondOptionValue === option.value && !isDisabled}
                              onClick={() => !isDisabled && onSecondOptionSelect(option.value)}
                               // Pass disabled state if ClassicTextOptionsWithoutBundlesReact handles it
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
                  <div
                    className={`classic-selection-options-without-bundles-max-qty-display text-2xl font-bold ${isHaveVariant ? '' : 'hidden'}`}
                    style={{ display: isHaveVariant && (selectedFirstOptionValue && (processedOptionData?.secondOption ? selectedSecondOptionValue : true)) ? 'block' : 'none' }} // Logic to show only when selection is complete
                  >
                    <span className="inline-block ms-1">
                      <span className="classic-selection-options-without-bundles-max-qty-value">
                        {isHaveVariant ? (maxQty ?? 0) : qtyNonVariant}
                      </span>
                    </span>
                  </div>
                   {!isHaveVariant && (
                     <div className="classic-selection-options-without-bundles-max-qty-display text-2xl font-bold">
                        <span className="inline-block ms-1">
                          <span className="classic-selection-options-without-bundles-max-qty-value font-medium">{qtyNonVariant}</span>
                        </span>
                    </div>
                   )}
                </div>
                <div className="classic-selection-options-without-bundles-qty-controls flex items-center gap-3">
                  <button
                    type="button"
                    className="classic-selection-options-without-bundles-qty-btn classic-selection-options-without-bundles-qty-decrease w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDecrease}
                    disabled={actualCurrentQuantity <= 1}
                  >
                    <span className="text-lg font-medium select-none">−</span>
                  </button>

                  <input
                    type="number"
                    className="classic-selection-options-without-bundles-qty-input w-20 h-10 text-center rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200"
                    value={actualCurrentQuantity}
                    min="1"
                    max={maxQty}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />

                  <button
                    type="button"
                    className="classic-selection-options-without-bundles-qty-btn classic-selection-options-without-bundles-qty-increase w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleIncrease}
                    disabled={actualCurrentQuantity >= (maxQty || Number.POSITIVE_INFINITY) }
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

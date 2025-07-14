import React, { useEffect } from 'react';
import { type Language } from "../../../../../../lib/utils/i18n/translations";
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore.ts";

// Import components
import OptionsContainer from './components/OptionsContainer/OptionsContainer';
import QuantitySection from './components/QuantitySection/QuantitySection';

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

interface PopSelectionOptionsWithoutBundlesReactProps {
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

const PopSelectionOptionsWithoutBundlesReact: React.FC<PopSelectionOptionsWithoutBundlesReactProps> = ({
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

  // Component state
  const maxQty = getMaxQuantity();
  const currentQty = selectedOption.qty;
  const isSelectionComplete = isHaveVariant ? 
    (hasSecondOption ? 
      Boolean(selectedOption.firstOption && selectedOption.secondOption) :
      Boolean(selectedOption.firstOption)) :
    true;

  return (
    <div className="pop-selection-options-without-bundles w-full">
      <section id="pop-selection-options-without-bundles-section">
        <div className="flex gap-6 flex-col-reverse">

          <OptionsContainer
            isHaveVariant={isHaveVariant}
            processedOptionData={processedOptionData}
            selectedFirst={selectedOption.firstOption}
            selectedSecond={selectedOption.secondOption}
            onFirstOptionSelect={handleFirstOptionSelect}
            onSecondOptionSelect={handleSecondOptionSelect}
            isSecondOptionDisabled={isSecondOptionDisabled}
          />

          <QuantitySection
            currentLang={currentLang}
            currentQty={currentQty}
            maxQty={maxQty}
            isHaveVariant={isHaveVariant}
            isSelectionComplete={isSelectionComplete}
            qtyNonVariant={qtyNonVariant}
            onQuantityChange={handleQuantityChange}
          />

        </div>
      </section>
    </div>
  );
};

export default PopSelectionOptionsWithoutBundlesReact;
export type { ProcessedOptionDataReact, OptionDetailReact, OptionValueReact };
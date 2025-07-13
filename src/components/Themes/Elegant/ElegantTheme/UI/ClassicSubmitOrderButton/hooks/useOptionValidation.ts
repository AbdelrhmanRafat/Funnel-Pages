import { useMemo } from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import type { BlockData } from "../../../../../../../lib/api/types";
import { useCustomOptionBundleStore } from "../../../../../../../lib/stores/customOptionBundleStore";
import { useProductStore } from "../../../../../../../lib/stores/customOptionsNonBundleStore";

interface UseOptionValidationProps {
  isHaveVariant: string;
  purchaseOptions: BlockData;
  currentLang: Language;
}

interface UseOptionValidationReturn {
  isProductSelectionComplete: boolean;
  optionsError: string;
  needsOptionValidation: boolean;
}

export const useOptionValidation = ({
  isHaveVariant,
  purchaseOptions,
  currentLang,
}: UseOptionValidationProps): UseOptionValidationReturn => {
  const customOptions = useCustomOptionBundleStore((state) => state.options);
  const productStoreState = useProductStore((state) => state);

  const needsOptionValidation = isHaveVariant === 'true';

  const isProductSelectionComplete = useMemo(() => {
    if (!needsOptionValidation) return true;

    if (purchaseOptions) {
      // Bundle validation logic
      return customOptions?.every(opt => {
        if (!opt.numberOfOptions || opt.numberOfOptions === 0) {
          return true; // No options needed
        } else if (opt.numberOfOptions === 1) {
          return opt.firstOption !== null;
        } else if (opt.numberOfOptions === 2) {
          return opt.firstOption !== null && opt.secondOption !== null;
        }
        return false; // Handle unexpected cases (3+ options)
      }) ?? false; // Handle case where customOptions is null/undefined
    } else {
      // Product validation logic
      return productStoreState.hasSecondOption
        ? Boolean(productStoreState.selectedOption.firstOption && productStoreState.selectedOption.secondOption)
        : Boolean(productStoreState.selectedOption.firstOption);
    }
  }, [needsOptionValidation, purchaseOptions, customOptions, productStoreState]);

  const optionsError = useMemo(() => {
    if (!needsOptionValidation || isProductSelectionComplete) return '';
    
    return getTranslation(
      purchaseOptions ? 'form.validation.bundleIncomplete' : 'form.validation.productIncomplete',
      currentLang
    );
  }, [needsOptionValidation, isProductSelectionComplete, purchaseOptions, currentLang]);

  return {
    isProductSelectionComplete,
    optionsError,
    needsOptionValidation,
  };
};
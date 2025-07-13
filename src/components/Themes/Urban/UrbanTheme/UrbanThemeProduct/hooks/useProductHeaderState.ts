import { useMemo } from 'react';
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore";
import type { Product, BlockData } from "../../../../../../lib/api/types";

interface UseProductHeaderStateProps {
  product: Product;
  purchaseOptions: BlockData | null;
  isHaveVariant: string;
}

interface ProductHeaderState {
  currentSku: string;
  currentPrice: number;
  currentPriceAfterDiscount: number;
  shouldObserve: boolean;
  isStoreActive: boolean;
}

export const useProductHeaderState = ({
  product,
  purchaseOptions,
  isHaveVariant,
}: UseProductHeaderStateProps): ProductHeaderState => {
  const productStore = useProductStore();
  
  // Replaces the Observer pattern conditional logic from initializeSettings()
  // Original: purchaseOptionsFalse && isHaveVariantTrue
  const shouldObserve = useMemo(() => {
    const purchaseOptionsFalse = !purchaseOptions;
    const isHaveVariantTrue = isHaveVariant === 'true';
    return purchaseOptionsFalse && isHaveVariantTrue;
  }, [purchaseOptions, isHaveVariant]);

  // Replaces the updateProductDisplay logic with reactive state calculation
  const currentState = useMemo(() => {
    if (!shouldObserve || !productStore.selectedOption) {
      // Return initial values (replaces resetToInitialValues method)
      return {
        currentSku: product.sku_code,
        currentPrice: product.price,
        currentPriceAfterDiscount: product.price_after_discount,
      };
    }

    // Return store values (replaces update method from Observer)
    const option = productStore.selectedOption;
    return {
      currentSku: option.sku_id?.toString() || product.sku_code,
      currentPrice: option.price ?? product.price,
      currentPriceAfterDiscount: option.price_after_discount ?? product.price_after_discount,
    };
  }, [shouldObserve, productStore.selectedOption, product]);

  // Track if store is actively providing data
  const isStoreActive = shouldObserve && !!productStore.selectedOption;

  return {
    ...currentState,
    shouldObserve,
    isStoreActive,
  };
};
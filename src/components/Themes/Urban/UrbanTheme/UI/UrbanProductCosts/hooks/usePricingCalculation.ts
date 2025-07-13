import { useMemo } from 'react';
import { useBundlePricing } from './useBundlePricing';
import { useProductPricing } from './useProductPricing';
import { useDeliveryCalculation } from './useDeliveryCalculation';

interface CalculatedValues {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

interface UsePricingCalculationProps {
  hasBundles: boolean;
}

interface UsePricingCalculationReturn {
  calculatedValues: CalculatedValues;
}

export const usePricingCalculation = ({
  hasBundles,
}: UsePricingCalculationProps): UsePricingCalculationReturn => {
  
  // Get pricing data from appropriate hook
  const { bundleOffer } = useBundlePricing();
  const { productOffer } = useProductPricing();

  // Determine which offer to use
  const baseOffer = hasBundles ? bundleOffer : productOffer;

  // Apply delivery calculations
  const { finalOffer } = useDeliveryCalculation({ baseOffer });

  // Calculate final values
  const calculatedValues = useMemo((): CalculatedValues => {
    if (!finalOffer) {
      return {
        quantity: 0,
        unitPrice: 0,
        subtotal: 0,
        shippingCost: 0,
        discount: 0,
        total: 0,
      };
    }

    return {
      quantity: finalOffer.items,
      unitPrice: finalOffer.price_per_item,
      subtotal: finalOffer.total_price,
      shippingCost: finalOffer.shipping_price,
      discount: finalOffer.discount,
      total: finalOffer.final_total,
    };
  }, [finalOffer]);

  return {
    calculatedValues,
  };
};
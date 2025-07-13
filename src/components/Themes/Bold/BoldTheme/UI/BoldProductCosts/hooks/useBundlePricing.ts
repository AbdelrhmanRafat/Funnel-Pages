import { useMemo } from 'react';
import { useBundleStore } from "../../../../../../../lib/stores/bundleStore";

interface BundleOffer {
  items: number;
  price_per_item: number;
  total_price: number;
  shipping_price: number;
  discount: number;
  final_total: number;
}

interface UseBundlePricingReturn {
  bundleOffer: BundleOffer | null;
}

export const useBundlePricing = (): UseBundlePricingReturn => {
  const bundleState = useBundleStore();

  const bundleOffer = useMemo((): BundleOffer | null => {
    if (bundleState.selectedOffer) {
      return {
        items: bundleState.quantity || bundleState.selectedOffer.items || 0,
        price_per_item: bundleState.selectedOffer.price_per_item || 0,
        total_price: bundleState.selectedOffer.total_price || 0,
        shipping_price: bundleState.selectedOffer.shipping_price || 0,
        discount: bundleState.selectedOffer.discount || 0,
        final_total: bundleState.selectedOffer.final_total || 0,
      };
    }
    
    // Fallback empty offer for bundles
    return {
      items: bundleState.quantity || 0,
      price_per_item: 0,
      total_price: 0,
      shipping_price: 0,
      discount: 0,
      final_total: 0,
    };
  }, [bundleState]);

  return {
    bundleOffer,
  };
};
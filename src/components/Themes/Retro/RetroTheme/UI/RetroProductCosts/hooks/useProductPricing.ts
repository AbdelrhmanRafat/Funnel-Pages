import { useMemo } from 'react';
import { useProductStore } from "../../../../../../../lib/stores/customOptionsNonBundleStore";

interface ProductOffer {
  items: number;
  price_per_item: number;
  total_price: number;
  shipping_price: number;
  discount: number;
  final_total: number;
}

interface UseProductPricingReturn {
  productOffer: ProductOffer | null;
}

export const useProductPricing = (): UseProductPricingReturn => {
  const productState = useProductStore();

  const productOffer = useMemo((): ProductOffer | null => {
    const option = productState.selectedOption;
    const selectedQuantity = option.qty || 1;
    
    // Calculate prices based on product options selection
    const unitPrice = option.price_after_discount || option.price || 0;
    const totalPrice = unitPrice * selectedQuantity;
    const originalPrice = option.price || 0;
    const discountedPrice = option.price_after_discount || 0;
    const discount = (originalPrice && discountedPrice && originalPrice > discountedPrice) ? 
      (originalPrice - discountedPrice) * selectedQuantity : 0;
    
    return {
      items: selectedQuantity,
      price_per_item: unitPrice,
      total_price: totalPrice,
      shipping_price: 0, // Will be handled by delivery options
      discount: discount,
      final_total: totalPrice,
    };
  }, [productState.selectedOption]);

  return {
    productOffer,
  };
};
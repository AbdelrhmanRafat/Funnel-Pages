import React, { useEffect, useState, useMemo } from 'react';
import { useBundleStore } from '../../../../../../lib/stores/bundleStore';
import { useDeliveryStore } from '../../../../../../lib/stores/deliveryStore';
import { useProductStore } from '../../../../../../lib/stores/customOptionsNonBundleStore';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';

interface ClassicProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
  currentLang: Language;
  isLoading?: boolean;
}

interface CalculatedValues {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

const ClassicProductCostsReact: React.FC<ClassicProductCostsReactProps> = ({
  hasBundles,
  showDiscountWhenZero = false,
  currencySymbol,
  currentLang,
  isLoading = false,
}) => {

  // Zustand store hooks
  const bundleState = useBundleStore();
  const productState = useProductStore();
  const deliveryState = useDeliveryStore();

  // Local state for calculated values
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    quantity: 0,
    unitPrice: 0,
    subtotal: 0,
    shippingCost: 0,
    discount: 0,
    total: 0,
  });

  // Create dynamic offer from store states (similar to old createOfferFromCustomOptions)
  const createCurrentOffer = useMemo(() => {
    if (hasBundles) {
      // Bundle product logic
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
    } else {
      // Non-bundle product logic (from old createOfferFromCustomOptions)
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
    }
  }, [hasBundles, bundleState, productState.selectedOption]);

  // Calculate final values with delivery (similar to old calculateValues)
  const calculateFinalValues = useMemo(() => {
    if (!createCurrentOffer) {
      return {
        quantity: 0,
        unitPrice: 0,
        subtotal: 0,
        shippingCost: 0,
        discount: 0,
        total: 0,
      };
    }

    const offer = createCurrentOffer;
    let actualShippingCost = 0;
    let actualFinalTotal = offer.final_total;

    // Handle delivery options (from old calculateValues logic)
    if (deliveryState.selectedDeliveryOptionId === "delivery-pickup") {
      // Pickup delivery - remove shipping costs
      actualShippingCost = 0;
      actualFinalTotal = offer.final_total - offer.shipping_price;
    } else {
      // Regular delivery - include shipping costs
      actualShippingCost = offer.shipping_price;
      actualFinalTotal = offer.final_total;
    }

    return {
      quantity: offer.items,
      unitPrice: offer.price_per_item,
      subtotal: offer.total_price,
      shippingCost: actualShippingCost,
      discount: offer.discount,
      total: actualFinalTotal,
    };
  }, [createCurrentOffer, deliveryState.selectedDeliveryOptionId]);

  // Update calculated values when any dependency changes
  useEffect(() => {
    setCalculatedValues(calculateFinalValues);
  }, [calculateFinalValues]);

  // Format price utility
  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} ${currencySymbol}`;
  };

  // Determine if discount should be visible (from old updateDiscountDisplay logic)
  const discountVisible = useMemo(() => {
    if (calculatedValues.discount > 0) {
      return true;
    }
    return showDiscountWhenZero;
  }, [calculatedValues.discount, showDiscountWhenZero]);

  return (
    <div className={`classic-product-costs-container ${isLoading ? 'classic-product-costs-loading' : ''}`}>
      <div className="classic-product-costs-body">
        <div className="classic-product-costs-content space-y-3">
          {/* Quantity Row */}
          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.quantity', currentLang)}
            </span>
            <div>
              <span className="classic-product-costs-value">
                {calculatedValues.quantity}
              </span>
              <span>
                {' '}{getTranslation('productFunnel.piece', currentLang)}
              </span>
            </div>
          </div>

          {/* Unit Price Row */}
          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.unitPrice', currentLang)}
            </span>
            <span className="classic-product-costs-value">
              {formatPrice(calculatedValues.unitPrice)}
            </span>
          </div>

          {/* Subtotal Row */}
          <div className="classic-product-costs-row flex justify-between items-center">
            <span className="classic-product-costs-label">
              {getTranslation('productFunnel.subtotal', currentLang)}
            </span>
            <span className="classic-product-costs-value">
              {formatPrice(calculatedValues.subtotal)}
            </span>
          </div>

          {/* Shipping Cost Row (only for bundles) */}
          {hasBundles && (
            <div className="classic-product-costs-row flex justify-between items-center">
              <span className="classic-product-costs-label">
                {getTranslation('productFunnel.shippingCost', currentLang)}
              </span>
              <span className="classic-product-costs-value">
                {formatPrice(calculatedValues.shippingCost)}
              </span>
            </div>
          )}

          {/* Discount Row (conditional visibility) */}
          {discountVisible && (
            <div className="classic-product-costs-row flex justify-between items-center">
              <span className="classic-product-costs-label">
                {getTranslation('productFunnel.discount', currentLang)}
              </span>
              <span className="classic-product-costs-discount">
                - {formatPrice(Math.abs(calculatedValues.discount))}
              </span>
            </div>
          )}
        </div>

        {/* Total Section */}
        <div className="classic-product-costs-total-section">
          <div className="flex justify-between items-center">
            <span className="classic-product-costs-total-label">
              {getTranslation('productFunnel.total', currentLang)}
            </span>
            <span className="classic-product-costs-total-value">
              {formatPrice(calculatedValues.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicProductCostsReact;
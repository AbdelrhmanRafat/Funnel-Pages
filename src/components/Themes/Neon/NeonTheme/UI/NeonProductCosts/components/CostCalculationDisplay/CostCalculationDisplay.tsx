import React, { useMemo } from 'react';
import CostRow from '../CostRow/CostRow';
import TotalSection from '../TotalSection/TotalSection';
import './CostCalculationDisplay.css';
import { getTranslation, type Language } from '../../../../../../../../lib/utils/i18n/translations';

interface CalculatedValues {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

interface CostCalculationDisplayProps {
  calculatedValues: CalculatedValues;
  hasBundles: boolean;
  showDiscountWhenZero: boolean;
  currencySymbol: string;
  currentLang: Language;
}

const CostCalculationDisplay: React.FC<CostCalculationDisplayProps> = ({
  calculatedValues,
  hasBundles,
  showDiscountWhenZero,
  currencySymbol,
  currentLang,
}) => {
  // Format price utility
  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} ${currencySymbol}`;
  };

  // Determine if discount should be visible
  const discountVisible = useMemo(() => {
    if (calculatedValues.discount > 0) {
      return true;
    }
    return showDiscountWhenZero;
  }, [calculatedValues.discount, showDiscountWhenZero]);

  return (
    <div className="neon-product-costs-body flex flex-col gap-3 sm:gap-4">
      <div className="neon-product-costs-content flex flex-col gap-2 sm:gap-3 pb-3 sm:pb-4 border-b">
        {/* Quantity Row */}
        <CostRow
          label={getTranslation('productFunnel.quantity', currentLang)}
          value={`${calculatedValues.quantity} ${getTranslation('productFunnel.piece', currentLang)}`}
        />

        {/* Unit Price Row */}
        <CostRow
          label={getTranslation('productFunnel.unitPrice', currentLang)}
          value={formatPrice(calculatedValues.unitPrice)}
        />

        {/* Subtotal Row */}
        <CostRow
          label={getTranslation('productFunnel.subtotal', currentLang)}
          value={formatPrice(calculatedValues.subtotal)}
        />

        {/* Shipping Cost Row (only for bundles) */}
        <CostRow
          label={getTranslation('productFunnel.shippingCost', currentLang)}
          value={formatPrice(calculatedValues.shippingCost)}
          isVisible={hasBundles}
        />

        {/* Discount Row (conditional visibility) */}
        <CostRow
          label={getTranslation('productFunnel.discount', currentLang)}
          value={formatPrice(Math.abs(calculatedValues.discount))}
          isDiscount={true}
          isVisible={discountVisible}
        />
      </div>

      {/* Total Section */}
      <TotalSection
        label={getTranslation('productFunnel.total', currentLang)}
        value={formatPrice(calculatedValues.total)}
      />
    </div>
  );
};

export default CostCalculationDisplay;
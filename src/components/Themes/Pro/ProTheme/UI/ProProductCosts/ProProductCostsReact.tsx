import React from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';

// Import components
import CostCalculationDisplay from './components/CostCalculationDisplay/CostCalculationDisplay';
import { usePricingCalculation } from './hooks/usePricingCalculation';

// Import hooks

interface ProProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
  currentLang: Language;
}

const ProProductCostsReact: React.FC<ProProductCostsReactProps> = ({
  hasBundles,
  showDiscountWhenZero = false,
  currencySymbol,
  currentLang,
}) => {

  // Get calculated pricing values from hook
  const { calculatedValues } = usePricingCalculation({
    hasBundles,
  });

  return (
    <div className="pro-product-costs-container">
      <CostCalculationDisplay
        calculatedValues={calculatedValues}
        hasBundles={hasBundles}
        showDiscountWhenZero={showDiscountWhenZero}
        currencySymbol={currencySymbol}
        currentLang={currentLang}
      />
    </div>
  );
};

export default ProProductCostsReact;
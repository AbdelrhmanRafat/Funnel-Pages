import React from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';

// Import components
import CostCalculationDisplay from './components/CostCalculationDisplay/CostCalculationDisplay';
import { usePricingCalculation } from './hooks/usePricingCalculation';

// Import hooks

interface NeonProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
  currentLang: Language;
}

const NeonProductCostsReact: React.FC<NeonProductCostsReactProps> = ({
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
    <div className="neon-product-costs-container flex flex-col gap-3 sm:gap-4 p-3 sm:p-6 border rounded-lg overflow-hidden">
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

export default NeonProductCostsReact;
import React from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';

// Import components
import CostCalculationDisplay from './components/CostCalculationDisplay/CostCalculationDisplay';
import { usePricingCalculation } from './hooks/usePricingCalculation';
import { detectLanguage } from '../../../../../../lib/utils/i18n/client';

// Import hooks

interface ArabicTouchProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
}

const ArabicTouchProductCostsReact: React.FC<ArabicTouchProductCostsReactProps> = ({
  hasBundles,
  showDiscountWhenZero = false,
  currencySymbol,
}) => {
  const currentLang : Language = detectLanguage();
  // Get calculated pricing values from hook
  const { calculatedValues } = usePricingCalculation({
    hasBundles,
  });

  return (
    <div className="arabictouch-product-costs-container">
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

export default ArabicTouchProductCostsReact;
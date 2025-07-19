import React from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';
import { detectLanguage } from '../../../../../../lib/utils/i18n/client';

// Import components
import CostCalculationDisplay from './components/CostCalculationDisplay/CostCalculationDisplay';
import { usePricingCalculation } from './hooks/usePricingCalculation';

// Import hooks

interface ClassicProductCostsReactProps {
  hasBundles: boolean;
  showDiscountWhenZero?: boolean;
  currencySymbol: string;
  isLoading?: boolean;
}

const ClassicProductCostsReact: React.FC<ClassicProductCostsReactProps> = ({
  hasBundles,
  showDiscountWhenZero = false,
  currencySymbol,
  isLoading = false,
}) => {
  const currentLang: Language = detectLanguage();

  // Get calculated pricing values from hook
  const { calculatedValues } = usePricingCalculation({
    hasBundles,
  });

  return (
    <div className="classic-product-costs-container">
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

export default ClassicProductCostsReact;
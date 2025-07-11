import React from 'react';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';

interface ClassicSubmitOrderButtonReactProps {
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  isFormValid: boolean;
  currentLang?: Language;
}

const ClassicSubmitOrderButtonReact: React.FC<ClassicSubmitOrderButtonReactProps> = ({
  purchaseOptions,
  isHaveVariant,
  product,
  isFormValid,
  currentLang = "en",
}) => {
  return (
    <div>
      <button
        type="button"
        data-submit-order-button
        className="classic-form-submit"
        data-translate="form.submit"
        disabled={!isFormValid}
      >
        {getTranslation("form.submit", currentLang)}
      </button>
    </div>
  );
};

export default ClassicSubmitOrderButtonReact;
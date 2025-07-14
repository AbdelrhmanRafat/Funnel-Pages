import "./ArabicTouchSubmitOrderButton.css";
import React, { useState } from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import ArabicTouchModalPurchaseInfoReact from '../../ArabicTouchModalPurchaseInfo/ArabicTouchModalPurchaseInfoReact';

// Import components
import ValidationErrorDisplay from './components/ValidationErrorDisplay/ValidationErrorDisplay';
import SubmitButton from './components/SubmitButton/SubmitButton';
import { useFormValidation } from "./hooks/useFormValidation";
import { useOptionValidation } from "./hooks/useOptionValidation";
import { useSubmitOrderLogic } from "./hooks/useSubmitOrderLogic";

// Import hooks


interface ArabicTouchSubmitOrderButtonReactProps {
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  isFormValid: boolean;
  currentLang?: Language;
}

const ArabicTouchSubmitOrderButtonReact: React.FC<ArabicTouchSubmitOrderButtonReactProps> = ({
  product,
  purchaseOptions,
  isHaveVariant,
  currentLang = "en",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hooks for business logic
  const {
    isValidating,
    areAllFieldsValid,
    forceAllTouchedAndValidate,
  } = useFormValidation();

  const {
    isProductSelectionComplete,
    optionsError,
  } = useOptionValidation({
    isHaveVariant,
    purchaseOptions,
    currentLang,
  });

  const {
    showOptionsError,
    handleSubmitClick,
  } = useSubmitOrderLogic({
    isProductSelectionComplete,
    areAllFieldsValid,
    forceAllTouchedAndValidate,
    onModalOpen: () => setIsModalOpen(true),
    currentLang,
  });

  // Modal handlers
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Component state for modal
  const hasVariants = isHaveVariant === 'true';
  const hasBundles = !!purchaseOptions;
  const isArabic = currentLang === 'ar';

  return (
    <>
      <div className="arabictouch-form-submit-wrapper">
        <ValidationErrorDisplay
          isVisible={showOptionsError}
          errorMessage={optionsError}
        />

        <SubmitButton
          isValidating={isValidating}
          onClick={handleSubmitClick}
          disabled={isValidating}
          currentLang={currentLang}
        />
      </div>

      <ArabicTouchModalPurchaseInfoReact
        isArabic={isArabic}
        currentLang={currentLang}
        hasVariants={hasVariants}
        hasBundles={hasBundles}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={product}   
      />
    </>
  );
};

export default ArabicTouchSubmitOrderButtonReact;
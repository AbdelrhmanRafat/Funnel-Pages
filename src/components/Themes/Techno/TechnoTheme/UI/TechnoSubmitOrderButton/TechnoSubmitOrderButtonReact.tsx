import "./TechnoSubmitOrderButton.css";
import React, { useState } from 'react';
import type { Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import TechnoModalPurchaseInfoReact from '../../TechnoModalPurchaseInfo/TechnoModalPurchaseInfoReact';

// Import components
import ValidationErrorDisplay from './components/ValidationErrorDisplay/ValidationErrorDisplay';
import SubmitButton from './components/SubmitButton/SubmitButton';
import { useFormValidation } from "./hooks/useFormValidation";
import { useOptionValidation } from "./hooks/useOptionValidation";
import { useSubmitOrderLogic } from "./hooks/useSubmitOrderLogic";

// Import hooks


interface TechnoSubmitOrderButtonReactProps {
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  isFormValid: boolean;
  currentLang?: Language;
}

const TechnoSubmitOrderButtonReact: React.FC<TechnoSubmitOrderButtonReactProps> = ({
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
      <div className="techno-form-submit-wrapper">
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

      <TechnoModalPurchaseInfoReact
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

export default TechnoSubmitOrderButtonReact;
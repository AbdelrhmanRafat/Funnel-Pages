import "./ClassicSubmitOrderButton.css";
import React, { useState } from 'react';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import { useCustomOptionBundleStore } from '../../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../../lib/stores/formStore';
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore";
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../../lib/utils/validation';
import ClassicModalPurchaseInfoReact from '../../ClassicModalPurchaseInfo/ClassicModalPurchaseInfoReact';

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
  currentLang = "en",
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptionsError, setShowOptionsError] = useState(false);

  const customOptions = useCustomOptionBundleStore((state) => state.options);
  const productStoreState = useProductStore((state) => state);

  const {
    setFieldTouched,
    updateField,
    areAllFieldsValid
  } = useFormStore();

  const needsOptionValidation = isHaveVariant === 'true';

 const isProductSelectionComplete = !needsOptionValidation ? true : (
  purchaseOptions ?
    customOptions?.every(opt => {
      if (!opt.numberOfOptions || opt.numberOfOptions === 0) {
        return true; // No options needed
      } else if (opt.numberOfOptions === 1) {
        return opt.firstOption !== null;
      } else if (opt.numberOfOptions === 2) {
        return opt.firstOption !== null && opt.secondOption !== null;
      }
      return false; // Handle unexpected cases (3+ options)
    }) ?? false // Handle case where customOptions is null/undefined
    : (
      productStoreState.hasSecondOption
        ? productStoreState.selectedOption.firstOption && productStoreState.selectedOption.secondOption
        : productStoreState.selectedOption.firstOption
    )
);

  const canSubmit = areAllFieldsValid() && isProductSelectionComplete;

  const optionsError = needsOptionValidation && !isProductSelectionComplete
    ? getTranslation(
        purchaseOptions ? 'form.validation.bundleIncomplete' : 'form.validation.productIncomplete',
        currentLang
      )
    : '';

  const forceAllTouchedAndValidate = async () => {
    setIsValidating(true);

    const fields = ['fullName', 'phone', 'email', 'address', 'city', 'notes'] as const;

    const validators = {
      fullName: isValidFullName,
      phone: isValidPhoneNumber,
      email: isValidEmail,
      address: isValidAddress,
      city: isValidCity,
      notes: isValidNotes,
    };

    const errorMessageKeys = {
      fullName: 'form.validation.invalidFullName',
      phone: 'form.validation.invalidPhone',
      email: 'form.validation.invalidEmail',
      address: 'form.validation.invalidAddress',
      city: 'form.validation.invalidCity',
      notes: 'form.validation.invalidNotes',
    };

    fields.forEach(fieldName => {
      setFieldTouched(fieldName, true);
      const currentValue = useFormStore.getState()[fieldName].value;
      const validator = validators[fieldName];
      const isValid = validator(currentValue);
      updateField(fieldName, {
        isValid,
        errorMessage: isValid ? '' : getTranslation(errorMessageKeys[fieldName], currentLang)
      });
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    setIsValidating(false);
  };

  const handleClick = async () => {
    await forceAllTouchedAndValidate();
    console.log("Pusadhusad",customOptions);
    const finalFormValid = areAllFieldsValid();
    const finalCanSubmit = finalFormValid && isProductSelectionComplete;

    setShowOptionsError(!isProductSelectionComplete);

    if (finalCanSubmit) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const hasVariants = isHaveVariant === 'true';
  const hasBundles = !!purchaseOptions;
  const isArabic = currentLang === 'ar';

  return (
    <>
      <div className="classic-form-submit-wrapper">
        {showOptionsError && optionsError && (
          <div
            className="classic-form-error"
            role="alert"
            aria-live="assertive"
            style={{
              backgroundColor: '#ffe5e5',
              color: '#cc0000',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              boxShadow: '0 0 5px rgba(204, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            ⚠️ {optionsError}
          </div>
        )}

        <button
          type="button"
          data-submit-order-button
          className={`classic-form-submit ${isValidating ? 'validating' : ''}`}
          onClick={handleClick}
          disabled={isValidating}
          aria-busy={isValidating}
        >
          {isValidating
            ? (
              <span className="loading-spinner" aria-hidden="true"></span>
            )
            : getTranslation("form.submit", currentLang)
          }
        </button>
      </div>

      <ClassicModalPurchaseInfoReact
        isArabic={isArabic}
        currentLang={currentLang}
        hasVariants={hasVariants}
        hasBundles={hasBundles}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default ClassicSubmitOrderButtonReact;
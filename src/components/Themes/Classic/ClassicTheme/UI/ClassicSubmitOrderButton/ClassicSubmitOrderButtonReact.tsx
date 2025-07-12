// ClassicSubmitOrderButtonReact.tsx
import "./ClassicSubmitOrderButton.css";
import React, { useState } from 'react';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import { usePaymentStore } from '../../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../../lib/stores/deliveryStore';
import { useBundleStore } from '../../../../../../lib/stores/bundleStore';
import { useCustomOptionBundleStore } from '../../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../../lib/stores/formStore';
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore";
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
  product,
  isFormValid,
  currentLang = "en",
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Store selectors
  const paymentOptionId = usePaymentStore((state) => state.selectedPaymentOptionId);
  const paymentOptionValue = usePaymentStore((state) => state.selectedPaymentOptionValue);
  const deliveryOptionId = useDeliveryStore((state) => state.selectedDeliveryOptionId);
  const deliveryOptionValue = useDeliveryStore((state) => state.selectedDeliveryOptionValue);
  const customOptions = useCustomOptionBundleStore((state) => state.options);
  const productStoreState = useProductStore((state) => state);
  
  const {
    setFieldTouched,
    updateField,
    areAllFieldsValid
  } = useFormStore();

  const needsOptionValidation = isHaveVariant === 'true';

  // Check if product selection is complete
  const isProductSelectionComplete = !needsOptionValidation ? true : (
    purchaseOptions ?
      customOptions?.every(opt =>
        opt.firstOption && (opt.numberOfOptions <= 1 || opt.secondOption))
      : (
        productStoreState.hasSecondOption
          ? productStoreState.selectedOption.firstOption && productStoreState.selectedOption.secondOption
          : productStoreState.selectedOption.firstOption
      )
  );

  // Calculate if form can be submitted
  const canSubmit = areAllFieldsValid() &&
    !!paymentOptionId && !!paymentOptionValue &&
    !!deliveryOptionId && !!deliveryOptionValue &&
    isProductSelectionComplete;

  // Generate error message for incomplete options
  const optionsError = needsOptionValidation && !isProductSelectionComplete
    ? getTranslation(
        purchaseOptions ? 'form.validation.bundleIncomplete' : 'form.validation.productIncomplete',
        currentLang
      )
    : '';

  // Validation function to force all fields touched and validate
  const forceAllTouchedAndValidate = async () => {
    setIsValidating(true);
    
    const fields = ['fullName', 'phone', 'email', 'address', 'city', 'notes'] as const;

    // Define validators for each field
    const validators = {
      fullName: (val: string) => val.trim().length >= 2,
      phone: (val: string) => /^\+?[0-9\- ]{7,15}$/.test(val),
      email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      address: (val: string) => val.trim().length > 5,
      city: (val: string) => val.trim().length > 0,
      notes: (val: string) => true, // Notes are optional
    };

    // Get error message keys
    const errorMessageKeys = {
      fullName: 'form.validation.invalidFullName',
      phone: 'form.validation.invalidPhone',
      email: 'form.validation.invalidEmail',
      address: 'form.validation.invalidAddress',
      city: 'form.validation.invalidCity',
      notes: '',
    };

    // Validate each field
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

    // Small delay to allow state updates to propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsValidating(false);
  };

  // Handle submit button click
  const handleClick = async () => {
    // Force validation of all fields
    await forceAllTouchedAndValidate();

    // Check final validation state after forcing validation
    const finalFormValid = areAllFieldsValid();
    const finalCanSubmit = finalFormValid &&
      !!paymentOptionId && !!paymentOptionValue &&
      !!deliveryOptionId && !!deliveryOptionValue &&
      isProductSelectionComplete;

    // If validation passes, open the modal
    if (finalCanSubmit) {
      setIsModalOpen(true);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Determine if product has variants and bundles for modal
  const hasVariants = isHaveVariant === 'true';
  const hasBundles = !!purchaseOptions;
  const isArabic = currentLang === 'ar';

  return (
    <>
      <div className="classic-form-submit-wrapper">
        {/* Show options error if exists */}
        {optionsError && (
          <div className="classic-form-error-block" role="alert">
            {optionsError}
          </div>
        )}
        
        {/* Show general validation error if form is not complete after validation attempt */}
        {isValidating === false && (!areAllFieldsValid() || !paymentOptionId || !deliveryOptionId) && (
          <div className="classic-form-error-block" role="alert">
            {getTranslation('form.validation.incompleteForm', currentLang)}
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
            ? getTranslation("form.validating", currentLang) 
            : getTranslation("form.submit", currentLang)
          }
        </button>
      </div>

      {/* Modal Component */}
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
import "./ClassicSubmitOrderButton.css";
import React from 'react';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import { usePaymentStore } from '../../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../../lib/stores/deliveryStore';
import { useBundleStore } from '../../../../../../lib/stores/bundleStore';
import { useCustomOptionBundleStore } from '../../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../../lib/stores/formStore';
import { useProductStore } from "../../../../../../lib/stores/customOptionsNonBundleStore";

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
  const paymentOptionId = usePaymentStore((state) => state.selectedPaymentOptionId);
  const paymentOptionValue = usePaymentStore((state) => state.selectedPaymentOptionValue);

  const deliveryOptionId = useDeliveryStore((state) => state.selectedDeliveryOptionId);
  const deliveryOptionValue = useDeliveryStore((state) => state.selectedDeliveryOptionValue);

  const bundleQuantity = useBundleStore((state) => state.quantity);
  const bundleSelectedOffer = useBundleStore((state) => state.selectedOffer);

  const customOptions = useCustomOptionBundleStore((state) => state.options);

  const productStoreState = useProductStore((state) => state);

  const {
    fullName,
    phone,
    email,
    address,
    city,
    notes,
    setFieldTouched,
    updateField
  } = useFormStore();

  const needsOptionValidation = isHaveVariant === 'true';

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

  const canSubmit = isFormValid &&
    !!paymentOptionId && !!paymentOptionValue &&
    !!deliveryOptionId && !!deliveryOptionValue &&
    isProductSelectionComplete;

  const optionsError = needsOptionValidation && !isProductSelectionComplete
    ? getTranslation(
        purchaseOptions ? 'form.validation.bundleIncomplete' : 'form.validation.productIncomplete',
        currentLang
      )
    : '';

  const forceAllTouchedAndValidate = () => {
    const fields = ['fullName', 'phone', 'email', 'address', 'city', 'notes'] as const;

    fields.forEach(name => {
      setFieldTouched(name, true);
      const value = useFormStore.getState()[name].value;
      const validator = {
        fullName: (val: string) => val.trim().length >= 2,
        phone: (val: string) => /^\+?[0-9\- ]{7,15}$/.test(val),
        email: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        address: (val: string) => val.trim().length > 5,
        city: (val: string) => val.trim().length > 0,
        notes: (val: string) => val.trim().length >= 0,
      }[name];

      const valid = validator(value);
      updateField(name, {
        isValid: valid,
        errorMessage: valid ? '' : getTranslation(`form.validation.invalid${name.charAt(0).toUpperCase() + name.slice(1)}`, currentLang)
      });
    });
  };

  const handleClick = () => {
    forceAllTouchedAndValidate();
    if (!canSubmit) return;

    console.log('=== STORE STATE ===');
    console.log('Form Valid:', isFormValid);
    console.log('Payment Option:', paymentOptionId, paymentOptionValue);
    console.log('Delivery Option:', deliveryOptionId, deliveryOptionValue);
    console.log('Bundle Selected:', bundleQuantity, bundleSelectedOffer);
    console.log('Form Fields:', { fullName, phone, email, address, city, notes });
    console.log('Product Selection Complete:', isProductSelectionComplete);
    console.log('Can Submit:', canSubmit);
  };

  return (
    <div className="classic-form-submit-wrapper">
      {optionsError && (
        <div className="classic-form-error-block" role="alert">
          {optionsError}
        </div>
      )}
      <button
        type="button"
        data-submit-order-button
        className="classic-form-submit"
        data-translate="form.submit"
        onClick={handleClick}
      >
        {getTranslation("form.submit", currentLang)}
      </button>
    </div>
  );
};

export default ClassicSubmitOrderButtonReact;
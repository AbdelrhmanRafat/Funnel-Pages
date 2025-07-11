import "./ClassicSubmitOrderButton.css";
import React from 'react';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import type { BlockData, Product } from '../../../../../../lib/api/types';
import { usePaymentStore } from '../../../../../../lib/stores/paymentStore';
import { useDeliveryStore } from '../../../../../../lib/stores/deliveryStore';
import { useBundleStore } from '../../../../../../lib/stores/bundleStore';
import { useCustomOptionStore } from '../../../../../../lib/stores/customOptionBundleStore';
import { useFormStore } from '../../../../../../lib/stores/formStore';

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
  // Payment Store - stable selectors
  const paymentOptionId = usePaymentStore((state) => state.selectedPaymentOptionId);
  const paymentOptionValue = usePaymentStore((state) => state.selectedPaymentOptionValue);

  // Delivery Store - stable selectors
  const deliveryOptionId = useDeliveryStore((state) => state.selectedDeliveryOptionId);
  const deliveryOptionValue = useDeliveryStore((state) => state.selectedDeliveryOptionValue);

  // Bundle Store - stable selectors
  const bundleQuantity = useBundleStore((state) => state.quantity);
  const bundleSelectedOffer = useBundleStore((state) => state.selectedOffer);

  // Custom Options Store - stable selectors
  const customOptions = useCustomOptionStore((state) => state.options);

  // Form Store - stable selectors
  const formFullName = useFormStore((state) => state.fullName);
  const formPhone = useFormStore((state) => state.phone);
  const formEmail = useFormStore((state) => state.email);
  const formAddress = useFormStore((state) => state.address);
  const formCity = useFormStore((state) => state.city);
  const formNotes = useFormStore((state) => state.notes);

  const handleClick = () => {
    console.log('=== ALL ZUSTAND STORES STATE ===');
    
    console.log('\n🎯 PAYMENT STORE:');
    console.log('  ID:', paymentOptionId || 'Not selected');
    console.log('  Value:', paymentOptionValue || 'Not selected');
    
    console.log('\n🚚 DELIVERY STORE:');
    console.log('  ID:', deliveryOptionId || 'Not selected');
    console.log('  Value:', deliveryOptionValue || 'Not selected');
    
    console.log('\n📦 BUNDLE STORE:');
    console.log('  Quantity:', bundleQuantity || 'Not selected');
    console.log('  Selected Offer:', bundleSelectedOffer || 'Not selected');
    
    console.log('\n⚙️ CUSTOM OPTIONS STORE:');
    console.log('  Options Count:', customOptions?.length || 0);
    console.log('  Options Array:', customOptions || []);
    
    console.log('\n📝 FORM STORE:');
    console.log('  Full Name:', {
      value: formFullName?.value || '',
      isValid: formFullName?.isValid || false,
      error: formFullName?.errorMessage || 'None'
    });
    console.log('  Phone:', {
      value: formPhone?.value || '',
      isValid: formPhone?.isValid || false,
      error: formPhone?.errorMessage || 'None'
    });
    console.log('  Email:', {
      value: formEmail?.value || '',
      isValid: formEmail?.isValid || false,
      error: formEmail?.errorMessage || 'None'
    });
    console.log('  Address:', {
      value: formAddress?.value || '',
      isValid: formAddress?.isValid || false,
      error: formAddress?.errorMessage || 'None'
    });
    console.log('  City:', {
      value: formCity?.value || '',
      isValid: formCity?.isValid || false,
      error: formCity?.errorMessage || 'None'
    });
    console.log('  Notes:', {
      value: formNotes?.value || '',
      isValid: formNotes?.isValid || false,
      error: formNotes?.errorMessage || 'None'
    });
    
    console.log('\n✅ OVERALL STATUS:');
    console.log('  Form Valid:', isFormValid);
    console.log('  Has Payment:', !!(paymentOptionId && paymentOptionValue));
    console.log('  Has Delivery:', !!(deliveryOptionId && deliveryOptionValue));
    console.log('  Has Bundle:', !!(bundleQuantity && bundleSelectedOffer));
    console.log('  Custom Options Complete:', customOptions?.every(opt => 
      opt.firstOption && (opt.numberOfOptions <= 1 || opt.secondOption)
    ) || false);
    
    console.log('\n=== END STORE DUMP ===');
  };

  return (
    <div>
      <button
        type="button"
        data-submit-order-button
        className="classic-form-submit"
        data-translate="form.submit"
        disabled={!isFormValid}
        onClick={handleClick}
      >
        {getTranslation("form.submit", currentLang)}
      </button>
    </div>
  );
};

export default ClassicSubmitOrderButtonReact;
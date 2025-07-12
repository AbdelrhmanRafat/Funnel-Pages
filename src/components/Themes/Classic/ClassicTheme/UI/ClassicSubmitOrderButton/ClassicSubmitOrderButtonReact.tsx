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
  const customOptions = useCustomOptionBundleStore((state) => state.options);

  // Product Store - stable selectors (for non-bundle products)
  const productStoreState = useProductStore((state) => state);

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
    
    // Conditional logging based on purchaseOptions
    if (!purchaseOptions || purchaseOptions === null || purchaseOptions === undefined) {
      console.log('\n🛍️ PRODUCT STORE (Non-Bundle Product):');
      console.log('  Is Have Variant:', productStoreState.isHaveVariant);
      console.log('  Has Second Option:', productStoreState.hasSecondOption);
      console.log('  Selected Option:', {
        firstOption: productStoreState.selectedOption.firstOption || 'Not selected',
        secondOption: productStoreState.selectedOption.secondOption || 'Not selected',
        sku_id: productStoreState.selectedOption.sku_id || 'Not set',
        price: productStoreState.selectedOption.price || 'Not set',
        price_after_discount: productStoreState.selectedOption.price_after_discount || 'Not set',
        qty: productStoreState.selectedOption.qty || 1,
        image: productStoreState.selectedOption.image || 'Not set'
      });
      
      // Check if selection is complete for product store
      const isProductSelectionComplete = productStoreState.isHaveVariant ? 
        (productStoreState.hasSecondOption ? 
          productStoreState.selectedOption.firstOption && productStoreState.selectedOption.secondOption :
          productStoreState.selectedOption.firstOption) :
        true;
      
      console.log('  Selection Complete:', isProductSelectionComplete);
      console.log('  SKU Data Available:', !!(productStoreState.selectedOption.sku_id && productStoreState.selectedOption.price));
    } else {
      console.log('\n⚙️ CUSTOM OPTIONS STORE (Bundle Product):');
      console.log('  Options Count:', customOptions?.length || 0);
      console.log('  Options Array:', customOptions || []);
      
      if (customOptions && customOptions.length > 0) {
        customOptions.forEach((option, index) => {
          console.log(`  Option ${index + 1}:`, {
            firstOption: option.firstOption || 'Not selected',
            secondOption: option.secondOption || 'Not selected',
            numberOfOptions: option.numberOfOptions || 0,
            sku_id: option.sku_id || 'Not set',
            price: option.price || 'Not set',
            qty: option.qty || 1,
            isComplete: option.firstOption && (option.numberOfOptions <= 1 || option.secondOption)
          });
        });
      }
    }
    
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
    
    // Conditional completion check
    if (!purchaseOptions || purchaseOptions === null || purchaseOptions === undefined) {
      const isProductSelectionComplete = productStoreState.isHaveVariant ? 
        (productStoreState.hasSecondOption ? 
          productStoreState.selectedOption.firstOption && productStoreState.selectedOption.secondOption :
          productStoreState.selectedOption.firstOption) :
        true;
      console.log('  Product Selection Complete:', isProductSelectionComplete);
    } else {
      console.log('  Custom Options Complete:', customOptions?.every(opt => 
        opt.firstOption && (opt.numberOfOptions <= 1 || opt.secondOption)
      ) || false);
    }
    
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
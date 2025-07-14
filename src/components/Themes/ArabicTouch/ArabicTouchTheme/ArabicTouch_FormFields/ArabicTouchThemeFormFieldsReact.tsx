import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelArabicTouchComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import ArabicTouchSubmitOrderButtonReact from "../UI/ArabicTouchSubmitOrderButton/ArabicTouchSubmitOrderButtonReact";
import ArabicTouchPersonalInfoSection from './Components/ArabicTouchPersonalInfoSection';
import ArabicTouchPaymentOptionsSection from './Components/ArabicTouchPaymentOptionsSection';
import ArabicTouchDeliveryOptionsSection from './Components/ArabicTouchDeliveryOptionsSection';
import ArabicTouchNotesSection from './Components/ArabicTouchNotesSection';


interface ArabicTouchThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const ArabicTouchThemeFormFieldsReact: React.FC<ArabicTouchThemeFormFieldsReactProps> = ({
  data,
  purchaseOptions,
  isHaveVariant,
  product,
  currentLang,
}) => {
  // Extract form data
  const formInputs = data.FormInputs;
  const cities: string[] = formInputs?.cities ?? [];
  const paymentOptions: PaymentOption[] = formInputs?.PaymentOptions ?? [];
  const deliveryOptions: DeliveryOption[] = formInputs?.DeliveryOptions ?? [];

  // Form validation hook
  const isFormValid = useFormValid();

  return (
    <section 
      id={FunnelArabicTouchComponents.ArabicTouchFormFields}
      className="arabictouch-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <ArabicTouchPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <ArabicTouchPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <ArabicTouchDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <ArabicTouchNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <ArabicTouchSubmitOrderButtonReact 
          purchaseOptions={purchaseOptions}
          isHaveVariant={isHaveVariant}
          product={product}
          isFormValid={isFormValid}
          currentLang={currentLang}
        />
        </div>
      </div>
    </section>
  );
};

export default ArabicTouchThemeFormFieldsReact;
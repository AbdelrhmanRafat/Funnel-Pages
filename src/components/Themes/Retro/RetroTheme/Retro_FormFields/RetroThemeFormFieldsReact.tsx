import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelRetroComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import RetroSubmitOrderButtonReact from "../UI/RetroSubmitOrderButton/RetroSubmitOrderButtonReact";
import RetroPersonalInfoSection from './Components/RetroPersonalInfoSection';
import RetroPaymentOptionsSection from './Components/RetroPaymentOptionsSection';
import RetroDeliveryOptionsSection from './Components/RetroDeliveryOptionsSection';
import RetroNotesSection from './Components/RetroNotesSection';


interface RetroThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const RetroThemeFormFieldsReact: React.FC<RetroThemeFormFieldsReactProps> = ({
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
      id={FunnelRetroComponents.RetroFormFields}
      className="retro-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <RetroPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <RetroPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <RetroDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <RetroNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <RetroSubmitOrderButtonReact 
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

export default RetroThemeFormFieldsReact;
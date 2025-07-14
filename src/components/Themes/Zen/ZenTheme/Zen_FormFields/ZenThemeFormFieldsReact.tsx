import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelZenComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import ZenSubmitOrderButtonReact from "../UI/ZenSubmitOrderButton/ZenSubmitOrderButtonReact";
import ZenPersonalInfoSection from './Components/ZenPersonalInfoSection';
import ZenPaymentOptionsSection from './Components/ZenPaymentOptionsSection';
import ZenDeliveryOptionsSection from './Components/ZenDeliveryOptionsSection';
import ZenNotesSection from './Components/ZenNotesSection';


interface ZenThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const ZenThemeFormFieldsReact: React.FC<ZenThemeFormFieldsReactProps> = ({
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
      id={FunnelZenComponents.ZenFormFields}
      className="zen-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <ZenPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <ZenPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <ZenDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <ZenNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <ZenSubmitOrderButtonReact 
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

export default ZenThemeFormFieldsReact;
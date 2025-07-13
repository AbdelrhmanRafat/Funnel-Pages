import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelTechnoComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import TechnoSubmitOrderButtonReact from "../UI/TechnoSubmitOrderButton/TechnoSubmitOrderButtonReact";
import TechnoPersonalInfoSection from './Components/TechnoPersonalInfoSection';
import TechnoPaymentOptionsSection from './Components/TechnoPaymentOptionsSection';
import TechnoDeliveryOptionsSection from './Components/TechnoDeliveryOptionsSection';
import TechnoNotesSection from './Components/TechnoNotesSection';


interface TechnoThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const TechnoThemeFormFieldsReact: React.FC<TechnoThemeFormFieldsReactProps> = ({
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
      id={FunnelTechnoComponents.TechnoFormFields}
      className="techno-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <TechnoPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <TechnoPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <TechnoDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <TechnoNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <TechnoSubmitOrderButtonReact 
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

export default TechnoThemeFormFieldsReact;
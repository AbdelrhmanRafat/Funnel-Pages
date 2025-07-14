import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelUrbanComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import UrbanSubmitOrderButtonReact from "../UI/UrbanSubmitOrderButton/UrbanSubmitOrderButtonReact";
import UrbanPersonalInfoSection from './Components/UrbanPersonalInfoSection';
import UrbanPaymentOptionsSection from './Components/UrbanPaymentOptionsSection';
import UrbanDeliveryOptionsSection from './Components/UrbanDeliveryOptionsSection';
import UrbanNotesSection from './Components/UrbanNotesSection';


interface UrbanThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const UrbanThemeFormFieldsReact: React.FC<UrbanThemeFormFieldsReactProps> = ({
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
      id={FunnelUrbanComponents.UrbanFormFields}
      className="urban-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <UrbanPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <UrbanPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <UrbanDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <UrbanNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <UrbanSubmitOrderButtonReact 
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

export default UrbanThemeFormFieldsReact;
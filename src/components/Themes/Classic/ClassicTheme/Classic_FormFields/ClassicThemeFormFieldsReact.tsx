import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelClassicComponents } from "../../../../../lib/constants/themes";
import { useFormValid } from "../../../../../lib/stores/formStore";
import ClassicSubmitOrderButtonReact from "../UI/ClassicSubmitOrderButton/ClassicSubmitOrderButtonReact";
import ClassicPersonalInfoSection from './Components/ClassicPersonalInfoSection';
import ClassicPaymentOptionsSection from './Components/ClassicPaymentOptionsSection';
import ClassicDeliveryOptionsSection from './Components/ClassicDeliveryOptionsSection';
import ClassicNotesSection from './Components/ClassicNotesSection';
import { detectLanguage } from '../../../../../lib/utils/i18n/client';


interface ClassicThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
}

const ClassicThemeFormFieldsReact: React.FC<ClassicThemeFormFieldsReactProps> = ({
  data,
  purchaseOptions,
  isHaveVariant,
  product
}) => {
  // Extract form data
  const formInputs = data.FormInputs;
  const cities: string[] = formInputs?.cities ?? [];
  const paymentOptions: PaymentOption[] = formInputs?.PaymentOptions ?? [];
  const deliveryOptions: DeliveryOption[] = formInputs?.DeliveryOptions ?? [];
  const currentLang : Language = detectLanguage();
  // Form validation hook
  const isFormValid = useFormValid();

  return (
    <section 
      id={FunnelClassicComponents.ClassicFormFields}
      className="classic-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* PERSONAL INFORMATION SECTION */}
        <ClassicPersonalInfoSection 
          cities={cities}
          currentLang={currentLang}
        />
        
        {/* PAYMENT OPTIONS SECTION */}
        {paymentOptions.length > 0 && (
          <ClassicPaymentOptionsSection 
            paymentOptions={paymentOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* DELIVERY OPTIONS SECTION */}
        {deliveryOptions.length > 0 && (
          <ClassicDeliveryOptionsSection 
            deliveryOptions={deliveryOptions}
            currentLang={currentLang}
          />
        )}
        
        {/* NOTES SECTION */}
        <ClassicNotesSection 
          currentLang={currentLang}
        />
        <div className='w-full'>
        {/* SUBMIT BUTTON SECTION */}
        <ClassicSubmitOrderButtonReact 
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

export default ClassicThemeFormFieldsReact;
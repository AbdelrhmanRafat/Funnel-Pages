import React from 'react';
import type { DeliveryOption } from "../../../../../../lib/api/types";
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
import { useDeliveryStore } from "../../../../../../lib/stores/deliveryStore";

interface ArabicTouchDeliveryOptionsSectionProps {
  deliveryOptions: DeliveryOption[];
  currentLang: Language;
}

const ArabicTouchDeliveryOptionsSection: React.FC<ArabicTouchDeliveryOptionsSectionProps> = ({
  deliveryOptions,
  currentLang,
}) => {
  // Delivery store hook
  const { setDeliveryOption } = useDeliveryStore();

  // Delivery option change handler
  const handleDeliveryChange = (optionId: string, optionValue: string) => {
    setDeliveryOption(optionId, optionValue);
  };

  // Set default selection on mount
  React.useEffect(() => {
    if (deliveryOptions.length > 0) {
      const firstDelivery = deliveryOptions[0];
      const value = currentLang === "ar" ? firstDelivery.label.ar : firstDelivery.label.en;
      handleDeliveryChange(`delivery-${firstDelivery.id}`, value);
    }
  }, [deliveryOptions, currentLang]);

  const isArabic = currentLang === "ar";

  return (
    <div className='w-full'>
      <label
        className="arabictouch-form-label-static block mb-2 text-sm font-medium md:text-base md:mb-3"
        data-translate="form.deliveryOptions"
      >
        {getTranslation("form.deliveryOptions", currentLang)}
      </label>
      <div
        className="space-y-3 md:space-y-4"
        role="radiogroup"
        aria-label="Delivery Method"
        aria-describedby="form-delivery-error"
      >
        {deliveryOptions.map((option, index) => {
          const value = isArabic ? option.label.ar : option.label.en;
          const id = `delivery-${option.id}`;
          const isChecked = index === 0;
          return (
            <label key={option.id} className="arabictouch-form-div-payment flex items-start gap-2 md:gap-3" htmlFor={id}>
              <input
                type="radio"
                id={id}
                name="delivery-option"
                value={value}
                className="arabictouch-form-input-radio w-4 h-4 md:w-5 md:h-5"
                defaultChecked={isChecked}
                onChange={() => handleDeliveryChange(id, value)}
              />
              <div className="arabictouch-form-div-content flex-1 ml-3 md:ml-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <span className="arabictouch-form-span-payment-label font-medium text-sm md:text-base">
                      {option.label[currentLang]}
                    </span>
                    <span className="arabictouch-form-span-payment-description text-xs md:text-sm">
                      {option.description[currentLang]}
                    </span>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <span
        id="form-delivery-error"
        className="arabictouch-form-span-error text-xs md:text-sm"
        role="alert"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ArabicTouchDeliveryOptionsSection;
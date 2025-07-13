import React from 'react';
import type { PaymentOption } from "../../../../../../lib/api/types";
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
import { usePaymentStore } from "../../../../../../lib/stores/paymentStore";

interface ZenPaymentOptionsSectionProps {
  paymentOptions: PaymentOption[];
  currentLang: Language;
}

const ZenPaymentOptionsSection: React.FC<ZenPaymentOptionsSectionProps> = ({
  paymentOptions,
  currentLang,
}) => {
  // Payment store hook
  const { setPaymentOption } = usePaymentStore();

  // Payment option change handler
  const handlePaymentChange = (optionId: string, optionValue: string) => {
    setPaymentOption(optionId, optionValue);
  };

  // Set default selection on mount
  React.useEffect(() => {
    if (paymentOptions.length > 0) {
      const firstPayment = paymentOptions[0];
      const value = currentLang === "ar" ? firstPayment.label.ar : firstPayment.label.en;
      handlePaymentChange(`payment-${firstPayment.id}`, value);
    }
  }, [paymentOptions, currentLang]);

  const isArabic = currentLang === "ar";

  return (
    <div className='w-full'>
      <label
        className="zen-form-label-static block mb-2 text-sm font-medium md:text-base md:mb-3"
        data-translate="form.paymentOptions"
      >
        {getTranslation("form.paymentOptions", currentLang)}
      </label>
      <div
        className="space-y-3 md:space-y-4"
        role="radiogroup"
        aria-label="Payment Method"
        aria-describedby="form-payment-error"
      >
        {paymentOptions.map((option, index) => {
          const value = isArabic ? option.label.ar : option.label.en;
          const id = `payment-${option.id}`;
          const isChecked = index === 0;
          return (
            <label key={option.id} className="zen-form-div-payment flex items-start gap-2 md:gap-3" htmlFor={id}>
              <input
                type="radio"
                id={id}
                name="payment-option"
                value={value}
                className="zen-form-input-radio w-4 h-4 md:w-5 md:h-5"
                defaultChecked={isChecked}
                onChange={() => handlePaymentChange(id, value)}
              />
              <div className="zen-form-div-content flex-1 ml-3 md:ml-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <span className="zen-form-span-payment-label font-medium text-sm md:text-base">
                      {option.label[currentLang]}
                    </span>
                    <span className="zen-form-span-payment-description text-xs md:text-sm">
                      {option.description[currentLang]}
                    </span>
                     
                    {/* Payment method images */}
                    {option.images && option.images.length > 0 && (
                      <div className="flex justify-start items-center flex-wrap gap-2 md:gap-4">
                        {option.images.map((imageSrc) => (
                          <div key={imageSrc} className="w-6 h-6 md:w-8 md:h-8 flex justify-center items-center">
                            <img
                              src={imageSrc}
                              alt={option.label[currentLang]}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <span
        id="form-payment-error"
        className="zen-form-span-error text-xs md:text-sm"
        role="alert"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ZenPaymentOptionsSection;
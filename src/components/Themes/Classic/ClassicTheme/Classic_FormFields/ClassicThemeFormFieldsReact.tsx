import React from 'react';
import type { Language } from "../../../../../lib/utils/i18n/translations"; // Adjusted path
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types"; // Assuming Product might be needed if purchaseOptions or product are passed

// Props interface for the React component
interface ClassicThemeFormFieldsReactProps {
  data: BlockData; // Contains title, FormInputs
  isArabic: boolean;
  cities: string[];
  paymentOptions: PaymentOption[];
  deliveryOptions: DeliveryOption[];
  currentLang: Language;
}

const ClassicThemeFormFieldsReact: React.FC<ClassicThemeFormFieldsReactProps> = ({
  data,
  isArabic,
  cities,
  paymentOptions,
  deliveryOptions,
  currentLang,
}) => {
  // const formInputs = data.FormInputs; // This was in original Astro, but data.FormInputs is used directly by Astro props logic

  return (
    // Return a fragment or the direct content that should be inside the <form> tag in the Astro file
    <>
      {/* This div was wrapping the form header and the form content in the original Astro */}
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        {/* FORM HEADER */}
        <div className="text-center">
          <h5
            id="form-heading" // This ID is referenced by aria-labelledby in the Astro file's <section>
            className="classic-form-title text-2xl font-semibold"
          >
            {data.title}
          </h5>
        </div>

        {/* This div was wrapping all the input groups and sections */}
        <div className="mb-8">
          {/* PERSONAL INFORMATION SECTION */}
          <h2
            className="classic-form-section-title mb-6 text-xl font-semibold"
            data-translate="form.personalInfo"
          >
            {/* Text content for this h2 was dynamic via JS in .ts or i18n library */}
          </h2>

          <div className="space-y-4">
            {/* FULL NAME INPUT FIELD */}
            <div className="classic-form-group">
              <input
                type="text"
                id="form-fullName"
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm`}
                aria-describedby="form-fullName-error"
                required
              />
              <label
                htmlFor="form-fullName"
                className="classic-form-label"
                data-translate="form.fullName"
              >
              </label>
              <span
                id="form-fullName-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>

            {/* PHONE NUMBER INPUT FIELD */}
            <div className="classic-form-group">
              <input
                type="tel"
                id="form-phone"
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm`}
                aria-describedby="form-phone-error"
                required
              />
              <label
                htmlFor="form-phone"
                className="classic-form-label"
                data-translate="form.phoneNumber"
              >
              </label>
              <span
                id="form-phone-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>

            {/* EMAIL INPUT FIELD */}
            <div className="classic-form-group">
              <input
                type="email"
                id="form-email"
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm`}
                aria-describedby="form-email-error"
                required
              />
              <label
                htmlFor="form-email"
                className="classic-form-label block mb-2 text-sm font-medium"
                data-translate="form.email"
              >
              </label>
              <span
                id="form-email-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>

            {/* ADDRESS TEXTAREA FIELD */}
            <div className="classic-form-group">
              <textarea
                id="form-address"
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} min-h-[80px] resize-y text-sm`}
                aria-describedby="form-address-error"
                required
              ></textarea>
              <label
                htmlFor="form-address"
                className="classic-form-label block mb-2 text-sm font-medium"
                data-translate="form.address"
              >
              </label>
              <span
                id="form-address-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>

            {/* CITY SELECTION DROPDOWN */}
            <div>
              <label
                htmlFor="form-city"
                className="classic-form-label block mb-2 text-sm font-medium"
                data-translate="form.city"
              >
              </label>
              <select
                id="form-city"
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm`}
                aria-describedby="form-city-error"
                required
              >
                <option value="" data-translate="form.selectCity">
                </option>
                {cities.map((city: string) => (
                  <option key={city} value={city.toLowerCase().replace(/\s+/g, "")}>
                    {city}
                  </option>
                ))}
              </select>
              <span
                id="form-city-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>

            {/* PAYMENT OPTIONS SECTION */}
            {paymentOptions && paymentOptions.length > 0 && (
              <div>
                <label
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.paymentOptions"
                >
                </label>
                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label="Payment Method"
                  aria-describedby="form-payment-error"
                >
                  {paymentOptions.map((option, index) => {
                    const value = isArabic ? option.label.ar : option.label.en;
                    const id = `payment-${option.id}`;
                    const isChecked = index === 0;
                    return (
                      <label className="classic-form-payment-option flex items-start gap-2" htmlFor={id} key={id}>
                        <input
                          type="radio"
                          id={id}
                          name="payment-option"
                          value={value}
                          className="classic-form-radio w-4 h-4"
                          defaultChecked={isChecked}
                        />
                        <div className="classic-form-payment-option-content flex-1 ml-3">
                          <div className="flex justify-between items-center">
                            <div className="flex-1 flex flex-col justify-start items-start gap-2">
                              <span className="classic-form-payment-option-label font-medium">
                                {option.label[currentLang]}
                              </span>
                              <span className="classic-form-payment-option-description text-sm">
                                {option.description[currentLang]}
                              </span>
                              {option.images && option.images.length > 0 && (
                                <div className="flex justify-start items-center flex-wrap gap-4">
                                  {option.images.map((imageSrc) => (
                                    <div className="w-8 h-8 flex justify-center items-center" key={imageSrc}>
                                      <img
                                        src={imageSrc}
                                        alt={option.label[currentLang]}
                                        className="w-full"
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
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: 'none' }}
                ></span>
              </div>
            )}

            {/* DELIVERY OPTIONS SECTION */}
            {deliveryOptions && deliveryOptions.length > 0 && (
              <div>
                <label
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.deliveryOptions"
                >
                </label>
                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label="Delivery Method"
                  aria-describedby="form-delivery-error"
                >
                  {deliveryOptions.map((option, index) => {
                    const value = isArabic ? option.label.ar : option.label.en;
                    const id = `delivery-${option.id}`;
                    const isChecked = index === 0;
                    return (
                      <label className="classic-form-payment-option flex items-start gap-2" htmlFor={id} key={id}>
                        <input
                          type="radio"
                          id={id}
                          name="delivery-option"
                          value={value}
                          className="classic-form-radio w-4 h-4"
                          defaultChecked={isChecked}
                        />
                        <div className="classic-form-payment-option-content flex-1 ml-3">
                          <div className="flex justify-between items-center">
                            <div className="flex-1 flex flex-col justify-start items-start gap-2">
                              <span className="classic-form-payment-option-label font-medium">
                                {option.label[currentLang]}
                              </span>
                              <span className="classic-form-payment-option-description text-sm">
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
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: 'none' }}
                ></span>
              </div>
            )}

            {/* NOTES TEXTAREA FIELD */}
            <div className="classic-form-group">
              <textarea
                id="form-notes"
                placeholder=""
                className={`classic-form-input ${isArabic ? "text-right" : "text-left"} min-h-[100px] resize-y text-sm`}
                aria-describedby="form-notes-error"
              ></textarea>
              <label
                htmlFor="form-notes"
                className="classic-form-label block mb-2 text-sm font-medium"
                data-translate="form.notes"
              >
              </label>
              <span
                id="form-notes-error"
                className="classic-form-error text-xs"
                role="alert"
                style={{ display: 'none' }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassicThemeFormFieldsReact;

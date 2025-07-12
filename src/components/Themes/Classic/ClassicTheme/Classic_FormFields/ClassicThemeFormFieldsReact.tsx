import React from 'react';
import type { BlockData, PaymentOption, DeliveryOption, Product } from "../../../../../lib/api/types";
import { getTranslation, type Language } from "../../../../../lib/utils/i18n/translations";
import { FunnelClassicComponents } from "../../../../../lib/constants/themes";
import {
  useFormStore,
  useFormField,
  useFormValid,
  type FormState
} from "../../../../../lib/stores/formStore";
import { usePaymentStore } from "../../../../../lib/stores/paymentStore";
import { useDeliveryStore } from "../../../../../lib/stores/deliveryStore";
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../lib/utils/validation';
import ClassicSubmitOrderButtonReact from "../UI/ClassicSubmitOrderButton/ClassicSubmitOrderButtonReact";

interface ClassicThemeFormFieldsReactProps {
  data: BlockData;
  purchaseOptions: BlockData;
  isHaveVariant: string;
  product: Product;
  currentLang: Language;
}

const ClassicThemeFormFieldsReact: React.FC<ClassicThemeFormFieldsReactProps> = ({
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

  // Form store hooks
  const {
    updateField,
    setFieldValue,
    setFieldTouched
  } = useFormStore();
  const fullNameField = useFormField('fullName');
  const phoneField = useFormField('phone');
  const emailField = useFormField('email');
  const addressField = useFormField('address');
  const cityField = useFormField('city');
  const notesField = useFormField('notes');
  const isFormValid = useFormValid();

  // Payment & delivery hooks
  const { setPaymentOption } = usePaymentStore();
  const { setDeliveryOption } = useDeliveryStore();

  // Validation maps with proper typing
  type FormFieldName = keyof FormState;
  
  const validationMap: Record<FormFieldName, (val: string) => boolean> = {
    fullName: isValidFullName,
    phone: isValidPhoneNumber,
    email: isValidEmail,
    address: isValidAddress,
    city: isValidCity,
    notes: isValidNotes,
  };

  const errorMessageMap: Record<FormFieldName, string> = {
    fullName: 'form.validation.invalidFullName',
    phone: 'form.validation.invalidPhone',
    email: 'form.validation.invalidEmail',
    address: 'form.validation.invalidAddress',
    city: 'form.validation.invalidCity',
    notes: 'form.validation.invalidNotes',
  };

  // Validation function
  const validateField = (fieldName: FormFieldName, value: string) => {
    const validator = validationMap[fieldName];
    const isValid = validator ? validator(value) : false;
    const errorMessage = isValid ? '' : getTranslation(errorMessageMap[fieldName], currentLang) || '';
    
    updateField(fieldName, { isValid, errorMessage });
  };

  // Input change handler
  const handleInputChange = (fieldName: FormFieldName, value: string) => {
    setFieldValue(fieldName, value);
    validateField(fieldName, value);
  };

  // Blur handler to set touched state
  const handleBlur = (fieldName: FormFieldName) => {
    setFieldTouched(fieldName, true);
  };

  // Payment option change handler
  const handlePaymentChange = (optionId: string, optionValue: string) => {
    setPaymentOption(optionId, optionValue);
  };

  // Delivery option change handler
  const handleDeliveryChange = (optionId: string, optionValue: string) => {
    setDeliveryOption(optionId, optionValue);
  };

  // Set default selections on mount
  React.useEffect(() => {
    if (paymentOptions.length > 0) {
      const firstPayment = paymentOptions[0];
      const value = currentLang === "ar" ? firstPayment.label.ar : firstPayment.label.en;
      handlePaymentChange(`payment-${firstPayment.id}`, value);
    }
  }, [paymentOptions, currentLang]);

  React.useEffect(() => {
    if (deliveryOptions.length > 0) {
      const firstDelivery = deliveryOptions[0];
      const value = currentLang === "ar" ? firstDelivery.label.ar : firstDelivery.label.en;
      handleDeliveryChange(`delivery-${firstDelivery.id}`, value);
    }
  }, [deliveryOptions, currentLang]);

  const isArabic = currentLang === "ar";

  return (
    <section 
      id={FunnelClassicComponents.ClassicFormFields}
      className="classic-form w-full p-3"
      aria-labelledby="form-heading"
    >
      <div className="mx-auto py-2 flex flex-col justify-center items-center gap-2">
        
        {/* FORM HEADER */}
        <div className="text-center">
          <h5 
            id="form-heading" 
            className="classic-form-title text-2xl font-semibold"
          >
            {data.title}
          </h5>
        </div>

        {/* MAIN FORM */}
        <div className="w-full">
          <div className="mb-8">
            {/* PERSONAL INFORMATION SECTION */}
            <h2
              className="classic-form-section-title mb-6 text-xl font-semibold"
              data-translate="form.personalInfo"
            >
              {getTranslation("form.personalInfo", currentLang)}
            </h2>
            
            <div className="space-y-4">
              {/* FULL NAME INPUT FIELD */}
              <div className="classic-form-group">
                <input
                  type="text"
                  id="form-fullName"
                  value={fullNameField.value}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm ${
                    fullNameField.touched && fullNameField.errorMessage ? 'classic-form-input-invalid' : 
                    fullNameField.touched && fullNameField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-fullName-error"
                  required
                />
                <label
                  htmlFor="form-fullName"
                  className="classic-form-label"
                  data-translate="form.fullName"
                >
                  {getTranslation("form.fullName", currentLang)}
                </label>
                <span
                  id="form-fullName-error"
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: fullNameField.touched && fullNameField.errorMessage ? 'block' : 'none' }}
                >
                  {fullNameField.errorMessage}
                </span>
              </div>
              
              {/* PHONE NUMBER INPUT FIELD */}
              <div className="classic-form-group">
                <input
                  type="tel"
                  id="form-phone"
                  value={phoneField.value}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm ${
                    phoneField.touched && phoneField.errorMessage ? 'classic-form-input-invalid' : 
                    phoneField.touched && phoneField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-phone-error"
                  required
                />
                <label
                  htmlFor="form-phone"
                  className="classic-form-label"
                  data-translate="form.phoneNumber"
                >
                  {getTranslation("form.phoneNumber", currentLang)}
                </label>
                <span
                  id="form-phone-error"
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: phoneField.touched && phoneField.errorMessage ? 'block' : 'none' }}
                >
                  {phoneField.errorMessage}
                </span>
              </div>
              
              {/* EMAIL INPUT FIELD */}
              <div className="classic-form-group">
                <input
                  type="email"
                  id="form-email"
                  value={emailField.value}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm ${
                    emailField.touched && emailField.errorMessage ? 'classic-form-input-invalid' : 
                    emailField.touched && emailField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-email-error"
                  required
                />
                <label
                  htmlFor="form-email"
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.email"
                >
                  {getTranslation("form.email", currentLang)}
                </label>
                <span
                  id="form-email-error"
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: emailField.touched && emailField.errorMessage ? 'block' : 'none' }}
                >
                  {emailField.errorMessage}
                </span>
              </div>
              
              {/* ADDRESS TEXTAREA FIELD */}
              <div className="classic-form-group">
                <textarea
                  id="form-address"
                  value={addressField.value}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} min-h-[80px] resize-y text-sm ${
                    addressField.touched && addressField.errorMessage ? 'classic-form-input-invalid' : 
                    addressField.touched && addressField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-address-error"
                  required
                />
                <label
                  htmlFor="form-address"
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.address"
                >
                  {getTranslation("form.address", currentLang)}
                </label>
                <span
                  id="form-address-error"
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: addressField.touched && addressField.errorMessage ? 'block' : 'none' }}
                >
                  {addressField.errorMessage}
                </span>
              </div>
              
              {/* CITY SELECTION DROPDOWN */}
              <div>
                <label
                  htmlFor="form-city"
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.city"
                >
                  {getTranslation("form.city", currentLang)}
                </label>
                <select 
                  id="form-city"
                  value={cityField.value}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} text-sm ${
                    cityField.touched && cityField.errorMessage ? 'classic-form-input-invalid' : 
                    cityField.touched && cityField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-city-error"
                  required
                >
                  <option value="" data-translate="form.selectCity">
                    {getTranslation("form.selectCity", currentLang)}
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
                  style={{ display: cityField.touched && cityField.errorMessage ? 'block' : 'none' }}
                >
                  {cityField.errorMessage}
                </span>
              </div>
              
              {/* PAYMENT OPTIONS SECTION */}
              {paymentOptions.length > 0 && (
                <div>
                  <label
                    className="classic-form-label block mb-2 text-sm font-medium"
                    data-translate="form.paymentOptions"
                  >
                    {getTranslation("form.paymentOptions", currentLang)}
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
                        <label key={option.id} className="classic-form-payment-option flex items-start gap-2" htmlFor={id}>
                          <input
                            type="radio"
                            id={id}
                            name="payment-option"
                            value={value}
                            className="classic-form-radio w-4 h-4"
                            defaultChecked={isChecked}
                            onChange={() => handlePaymentChange(id, value)}
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

                                {/* Payment method images */}
                                {option.images && option.images.length > 0 && (
                                  <div className="flex justify-start items-center flex-wrap gap-4">
                                    {option.images.map((imageSrc) => (
                                      <div key={imageSrc} className="w-8 h-8 flex justify-center items-center">
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
                  />
                </div>
              )}
              
              {/* DELIVERY OPTIONS SECTION */}
              {deliveryOptions.length > 0 && (
                <div>
                  <label
                    className="classic-form-label block mb-2 text-sm font-medium"
                    data-translate="form.deliveryOptions"
                  >
                    {getTranslation("form.deliveryOptions", currentLang)}
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
                        <label key={option.id} className="classic-form-payment-option flex items-start gap-2" htmlFor={id}>
                          <input
                            type="radio"
                            id={id}
                            name="delivery-option"
                            value={value}
                            className="classic-form-radio w-4 h-4"
                            defaultChecked={isChecked}
                            onChange={() => handleDeliveryChange(id, value)}
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
                  />
                </div>
              )}
              
              {/* NOTES TEXTAREA FIELD */}
              <div className="classic-form-group">
                <textarea
                  id="form-notes"
                  value={notesField.value}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  onBlur={() => handleBlur('notes')}
                  placeholder=""
                  className={`classic-form-input ${isArabic ? "text-right" : "text-left"} min-h-[100px] resize-y text-sm ${
                    notesField.touched && notesField.errorMessage ? 'classic-form-input-invalid' : 
                    notesField.touched && notesField.isValid ? 'classic-form-input-valid' : ''
                  }`}
                  aria-describedby="form-notes-error"
                />
                <label
                  htmlFor="form-notes"
                  className="classic-form-label block mb-2 text-sm font-medium"
                  data-translate="form.notes"
                >
                  {getTranslation("form.notes", currentLang)}
                </label>
                <span
                  id="form-notes-error"
                  className="classic-form-error text-xs"
                  role="alert"
                  style={{ display: notesField.touched && notesField.errorMessage ? 'block' : 'none' }}
                >
                  {notesField.errorMessage}
                </span>
              </div>
            </div>
          </div>
          
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
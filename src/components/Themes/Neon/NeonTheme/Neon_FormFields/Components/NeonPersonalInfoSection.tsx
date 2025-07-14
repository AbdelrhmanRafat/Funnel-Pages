import React from 'react';
import { getTranslation, type Language } from "../../../../../../lib/utils/i18n/translations";
import {
  useFormStore,
  useFormField,
  type FormState
} from "../../../../../../lib/stores/formStore";
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidAddress,
} from '../../../../../../lib/utils/validation';

interface NeonPersonalInfoSectionProps {
  cities: string[];
  currentLang: Language;
}

const NeonPersonalInfoSection: React.FC<NeonPersonalInfoSectionProps> = ({
  cities,
  currentLang,
}) => {
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

  // Validation maps with proper typing
  type FormFieldName = keyof FormState;
  
  const validationMap: Record<FormFieldName, (val: string) => boolean> = {
    fullName: isValidFullName,
    phone: isValidPhoneNumber,
    email: isValidEmail,
    address: isValidAddress,
    city: isValidCity,
    notes: function (val: string): boolean {
      throw new Error('Function not implemented.');
    }
  };

  const errorMessageMap: Record<FormFieldName, string> = {
    fullName: 'form.validation.invalidFullName',
    phone: 'form.validation.invalidPhone',
    email: 'form.validation.invalidEmail',
    address: 'form.validation.invalidAddress',
    city: 'form.validation.invalidCity',
    notes: ''
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

  const isArabic = currentLang === "ar";

  return (
    <>
      {/* MAIN FORM */}
      <div className="w-full">
        <div className='mb-3'>
          {/* PERSONAL INFORMATION SECTION */}
          <h2
            className="neon-form-h2-title mb-6 text-xl font-semibold md:text-2xl"
            data-translate="form.personalInfo"
          >
            {getTranslation("form.personalInfo", currentLang)}
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            {/* FULL NAME INPUT FIELD */}
            <div className="neon-form-div-group">
              <input
                type="text"
                id="form-fullName"
                value={fullNameField.value}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`neon-form-input-base neon-form-input-responsive ${isArabic ? "text-right" : "text-left"} text-sm md:text-base ${
                  fullNameField.touched && fullNameField.errorMessage ? 'neon-form-input-error' : 
                  fullNameField.touched && fullNameField.isValid ? 'neon-form-input-success' : ''
                }`}
                aria-describedby="form-fullName-error"
                required
              />
              <label
                htmlFor="form-fullName"
                className="neon-form-label-floating"
                data-translate="form.fullName"
              >
                {getTranslation("form.fullName", currentLang)}
              </label>
              <span
                id="form-fullName-error"
                className="neon-form-span-error text-xs md:text-sm"
                role="alert"
                style={{ display: fullNameField.touched && fullNameField.errorMessage ? 'block' : 'none' }}
              >
                {fullNameField.errorMessage}
              </span>
            </div>
            
            {/* PHONE NUMBER INPUT FIELD */}
            <div className="neon-form-div-group">
              <input
                type="tel"
                id="form-phone"
                value={phoneField.value}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`neon-form-input-base neon-form-input-responsive ${isArabic ? "text-right" : "text-left"} text-sm md:text-base ${
                  phoneField.touched && phoneField.errorMessage ? 'neon-form-input-error' : 
                  phoneField.touched && phoneField.isValid ? 'neon-form-input-success' : ''
                }`}
                aria-describedby="form-phone-error"
                required
              />
              <label
                htmlFor="form-phone"
                className="neon-form-label-floating"
                data-translate="form.phoneNumber"
              >
                {getTranslation("form.phoneNumber", currentLang)}
              </label>
              <span
                id="form-phone-error"
                className="neon-form-span-error text-xs md:text-sm"
                role="alert"
                style={{ display: phoneField.touched && phoneField.errorMessage ? 'block' : 'none' }}
              >
                {phoneField.errorMessage}
              </span>
            </div>
            
            {/* EMAIL INPUT FIELD */}
            <div className="neon-form-div-group">
              <input
                type="email"
                id="form-email"
                value={emailField.value}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`neon-form-input-base neon-form-input-responsive ${isArabic ? "text-right" : "text-left"} text-sm md:text-base ${
                  emailField.touched && emailField.errorMessage ? 'neon-form-input-error' : 
                  emailField.touched && emailField.isValid ? 'neon-form-input-success' : ''
                }`}
                aria-describedby="form-email-error"
                required
              />
              <label
                htmlFor="form-email"
                className="neon-form-label-floating"
                data-translate="form.email"
              >
                {getTranslation("form.email", currentLang)}
              </label>
              <span
                id="form-email-error"
                className="neon-form-span-error text-xs md:text-sm"
                role="alert"
                style={{ display: emailField.touched && emailField.errorMessage ? 'block' : 'none' }}
              >
                {emailField.errorMessage}
              </span>
            </div>
            
            {/* ADDRESS TEXTAREA FIELD */}
            <div className="neon-form-div-group">
              <textarea
                id="form-address"
                value={addressField.value}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                className={`neon-form-input-base neon-form-textarea-responsive ${isArabic ? "text-right" : "text-left"} min-h-[80px] md:min-h-[100px] resize-y text-sm md:text-base ${
                  addressField.touched && addressField.errorMessage ? 'neon-form-input-error' : 
                  addressField.touched && addressField.isValid ? 'neon-form-input-success' : ''
                }`}
                aria-describedby="form-address-error"
                required
              />
              <label
                htmlFor="form-address"
                className="neon-form-label-floating"
                data-translate="form.address"
              >
                {getTranslation("form.address", currentLang)}
              </label>
              <span
                id="form-address-error"
                className="neon-form-span-error text-xs md:text-sm"
                role="alert"
                style={{ display: addressField.touched && addressField.errorMessage ? 'block' : 'none' }}
              >
                {addressField.errorMessage}
              </span>
            </div>
            
            {/* CITY SELECTION DROPDOWN */}
            <div className="neon-form-div-group">
              <select 
                id="form-city"
                value={cityField.value}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                className={`neon-form-select-base neon-form-select-responsive ${isArabic ? "text-right" : "text-left"} text-sm md:text-base ${
                  cityField.touched && cityField.errorMessage ? 'neon-form-input-error' : 
                  cityField.touched && cityField.isValid ? 'neon-form-input-success' : ''
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
                className="neon-form-span-error text-xs md:text-sm"
                role="alert"
                style={{ display: cityField.touched && cityField.errorMessage ? 'block' : 'none' }}
              >
                {cityField.errorMessage}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeonPersonalInfoSection;
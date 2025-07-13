import { useState } from 'react';
import { getTranslation, type Language } from "../../../../../../../lib/utils/i18n/translations";
import { useFormStore } from "../../../../../../../lib/stores/formStore";
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../../../lib/utils/validation';

interface UseFormValidationReturn {
  isValidating: boolean;
  areAllFieldsValid: boolean;
  forceAllTouchedAndValidate: (currentLang: Language) => Promise<void>;
}

export const useFormValidation = (): UseFormValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);

  const {
    setFieldTouched,
    updateField,
    areAllFieldsValid
  } = useFormStore();

  const forceAllTouchedAndValidate = async (currentLang: Language) => {
    setIsValidating(true);

    const fields = ['fullName', 'phone', 'email', 'address', 'city', 'notes'] as const;

    const validators = {
      fullName: isValidFullName,
      phone: isValidPhoneNumber,
      email: isValidEmail,
      address: isValidAddress,
      city: isValidCity,
      notes: isValidNotes,
    };

    const errorMessageKeys = {
      fullName: 'form.validation.invalidFullName',
      phone: 'form.validation.invalidPhone',
      email: 'form.validation.invalidEmail',
      address: 'form.validation.invalidAddress',
      city: 'form.validation.invalidCity',
      notes: 'form.validation.invalidNotes',
    };

    fields.forEach(fieldName => {
      setFieldTouched(fieldName, true);
      const currentValue = useFormStore.getState()[fieldName].value;
      const validator = validators[fieldName];
      const isValid = validator(currentValue);
      updateField(fieldName, {
        isValid,
        errorMessage: isValid ? '' : getTranslation(errorMessageKeys[fieldName], currentLang)
      });
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    setIsValidating(false);
  };

  return {
    isValidating,
    areAllFieldsValid: areAllFieldsValid(),
    forceAllTouchedAndValidate,
  };
};
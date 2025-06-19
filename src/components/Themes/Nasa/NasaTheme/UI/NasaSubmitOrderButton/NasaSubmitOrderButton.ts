import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import { 
  ColorSizeOptionsSubject,
  FormFieldsSubject 
} from '../../../../../../lib/patterns/Observer';

// Configuration for form fields
const FORM_FIELD_CONFIG = {
  FIELD_IDS: [
    'form-fullName',
    'form-phone',
    'form-email',
    'form-address',
    'form-city',
    'form-notes'
  ] as const,
  ERROR_CLASSES: {
    INVALID: 'nasa-border-error',
    VALID: 'nasa-border-success',
    ERROR_CONTAINER: 'nasa-error-container',
    ERROR_MESSAGE: 'nasa-error-message'
  }
} as const;

const submitOrderButton = document.getElementById("SubmitOrderButton");
let formFieldsSubject: FormFieldsSubject;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize form fields subject
  formFieldsSubject = FormFieldsSubject.getInstance();
  formFieldsSubject.initializeFields(FORM_FIELD_CONFIG.FIELD_IDS);
  
  // Set up initial field values and attach input listeners
  setupFormFieldListeners();
  
  // Set up the click event handler for the submit button
  submitOrderButton?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    
    // Validate the form
    const isFormValid = validateForm();
    
    // Only open the modal if validation passes
    if (isFormValid) {
      // Create and dispatch a custom event to open the modal
      const openModalEvent = new CustomEvent('openPurchaseModal');
      document.dispatchEvent(openModalEvent);
    }
  });
});

/**
 * Set up listeners for form field inputs
 */
function setupFormFieldListeners(): void {
  // Set up listeners for regular form fields
  FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (input) {
      // Set initial value in the observer without showing validation messages
      updateFieldState(fieldId, input.value, false);
      
      // Add input event listener
      input.addEventListener('input', () => {
        updateFieldState(fieldId, input.value, true);
      });
      
      // Also mark as touched on blur (when user leaves the field)
      input.addEventListener('blur', () => {
        updateFieldState(fieldId, input.value, true);
      });
    }
  });
  
  // Set up listeners for payment option radio buttons
  const paymentRadios = document.querySelectorAll('input[name="payment-option"]');
  paymentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if ((radio as HTMLInputElement).checked) {
        formFieldsSubject.updateField('payment-option', {
          value: (radio as HTMLInputElement).value,
          isValid: true,
          errorMessage: ''
        });
      }
    });
  });
}

/**
 * Update field state in the observer
 */
function updateFieldState(fieldId: string, value: string, touched: boolean = false): void {
  const isValid = validateField(fieldId, value);
  const errorMessage = getErrorMessage(fieldId, isValid);
  
  // Update state in observer
  formFieldsSubject.updateField(fieldId, {
    value,
    isValid,
    errorMessage,
    touched
  });
  
  // Only update UI if the field has been touched
  if (touched) {
    displayValidationMessage(fieldId, errorMessage, isValid);
  }
}

/**
 * Validate the entire form
 * @returns boolean indicating if the form is valid
 */
function validateForm(): boolean {
  const areFieldsValid = validateAllFields();
  const areOptionsValid = validateColorSizeOptions();
  return areFieldsValid && areOptionsValid;
}

/**
 * Detect current language from cookies
 */
function detectLanguage(): Language {
  const langCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('lang='))
    ?.split('=')[1];

  return (langCookie || 'en') as Language;
}

/**
 * Validate a specific field based on its type
 * @param fieldId - The ID of the field to validate
 * @param value - The value to validate
 * @returns boolean indicating if the field is valid
 */
function validateField(fieldId: string, value: string): boolean {
  const validationMap: Record<string, (val: string) => boolean> = {
    'form-fullName': isValidFullName,
    'form-phone': isValidPhoneNumber,
    'form-email': isValidEmail,
    'form-address': isValidAddress,
    'form-city': isValidCity,
    'form-notes': isValidNotes,
  };

  const validator = validationMap[fieldId];
  return validator ? validator(value) : false;
}

/**
 * Get appropriate error message for a field
 * @param fieldId - The ID of the field
 * @param isValid - Whether the field is valid
 * @returns Localized error message
 */
function getErrorMessage(fieldId: string, isValid: boolean): string {
  const currentLang = detectLanguage();
  
  if (isValid) {
    return getTranslation('form.validation.valid', currentLang);
  }

  const errorMessageMap: Record<string, string> = {
    'form-fullName': 'form.validation.invalidFullName',
    'form-phone': 'form.validation.invalidPhone',
    'form-email': 'form.validation.invalidEmail',
    'form-address': 'form.validation.invalidAddress',
    'form-city': 'form.validation.invalidCity',
    'form-delivery': 'form.validation.invalidDelivery',
    'form-notes': 'form.validation.invalidNotes',
  };

  const messageKey = errorMessageMap[fieldId] || 'form.validation.invalidInput';
  return getTranslation(messageKey, currentLang);
}

/**
 * Validate all form fields
 * @returns boolean indicating if all fields are valid
 */
function validateAllFields(): boolean {
  let isFormValid = true;

  FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (input) {
      const isValid = validateField(fieldId, input.value);
      const message = getErrorMessage(fieldId, isValid);
      // Force display validation messages when validating all fields (on submit)
      displayValidationMessage(fieldId, message, isValid);
      updateFieldState(fieldId, input.value, true); // Mark as touched

      if (!isValid) {
        isFormValid = false;
      }
    }
  });

  return isFormValid;
}

/**
 * Display validation message for a specific field
 * @param fieldId - The ID of the field
 * @param message - The message to display
 * @param isValid - Whether the field is valid
 */
function displayValidationMessage(fieldId: string, message: string, isValid: boolean): void {
  updateErrorElement(fieldId, message, isValid);
  updateInputStyling(fieldId, isValid);
}

/**
 * Update the error element for a field
 * @param fieldId - The ID of the field
 * @param message - The message to display
 * @param isValid - Whether the field is valid
 */
function updateErrorElement(fieldId: string, message: string, isValid: boolean): void {
  const errorElement = document.getElementById(`${fieldId}-error`);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
    errorElement.classList.remove('nasa-text-success', 'nasa-text-error');
    errorElement.classList.add(isValid ? 'nasa-text-success' : 'nasa-text-error');
  }
}

/**
 * Update input field styling based on validation state
 * @param fieldId - The ID of the field
 * @param isValid - Whether the field is valid
 */
function updateInputStyling(fieldId: string, isValid: boolean): void {
  const inputElement = document.getElementById(fieldId);

  if (inputElement) {
    const { INVALID, VALID } = FORM_FIELD_CONFIG.ERROR_CLASSES;

    if (isValid) {
      inputElement.classList.remove(INVALID);
      inputElement.classList.add(VALID);
    } else {
      inputElement.classList.remove(VALID);
      inputElement.classList.add(INVALID);
    }
  }
}

/**
 * Validate color and size options
 * @returns boolean indicating if all options are valid
 */
function validateColorSizeOptions(): boolean {
  const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
  const colorSizeState = colorSizeSubject.getState();

  if (!colorSizeState.options || colorSizeState.options.length === 0) {
    return true; // No options to validate
  }

  let isOptionsValid = true;
  const errorMessages: string[] = [];

  for (const option of colorSizeState.options) {
    if (!option.color) {
      errorMessages.push(`من فضلك اختر اللون للخيار رقم ${option.panelIndex}`);
      isOptionsValid = false;
    }
    if (!option.size) {
      errorMessages.push(`من فضلك اختر المقاس للخيار رقم ${option.panelIndex}`);
      isOptionsValid = false;
    }
  }

  // فقط أنشئ الكونتينر لو فيه أخطاء فعلاً
  if (!isOptionsValid) {
    const optionsErrorContainer = getOrCreateOptionsErrorContainer();
    optionsErrorContainer.innerHTML = '';
    errorMessages.forEach(msg => addOptionsError(optionsErrorContainer, msg));
  } else {
    // لو مفيش أخطاء، احذف الكونتينر لو موجود
    const existing = document.getElementById('options-error-container');
    if (existing) existing.remove();
  }

  return isOptionsValid;
}

/**
 * Get or create the options error container
 * @returns HTMLElement for displaying option errors
 */
function getOrCreateOptionsErrorContainer(): HTMLElement {
  let container = document.getElementById('options-error-container');

  if (!container) {
    container = createOptionsErrorContainer();
  }

  return container;
}

/**
 * Create error container for color/size options
 * @returns HTMLElement for the error container
 */
function createOptionsErrorContainer(): HTMLElement {
  const container = document.createElement('div');
  container.id = 'options-error-container';
  container.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_CONTAINER;

  insertErrorContainer(container);
  return container;
}

/**
 * Insert error container in appropriate position in the form
 * @param container - The container element to insert
 */
function insertErrorContainer(container: HTMLElement): void {
  const form = document.querySelector('form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton && submitButton.parentNode) {
    submitButton.parentNode.insertBefore(container, submitButton);
  } else {
    form.appendChild(container);
  }
}

/**
 * Add error message to the options error container
 * @param container - The container to add the error to
 * @param message - The error message
 */
function addOptionsError(container: HTMLElement, message: string): void {
  const errorElement = document.createElement('p');
  errorElement.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_MESSAGE;
  errorElement.textContent = message;
  container.appendChild(errorElement);
}
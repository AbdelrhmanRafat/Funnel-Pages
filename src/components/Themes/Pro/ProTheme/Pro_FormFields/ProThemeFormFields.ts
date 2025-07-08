import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';
import { FORM_FIELD_CONFIG } from '../../../../../lib/constants/formConfig';
import type { FormField } from '../../../../../lib/Interfaces/FormField';
import { PaymentOptionsSubject } from '../../../../../lib/patterns/Observers/payment-observer';
import { DeliveryOptionsSubject } from '../../../../../lib/patterns/Observers/delivery-observer';

/**
 * Main class for handling form field validation and state management
 * Manages all form interactions, validation, and UI updates
 */
class ProFormFieldsHandler {
  private form: HTMLFormElement | null;
  private fields = new Map<string, FormField>();
  private currentLang: Language;
  
  // Maps field IDs to their validation functions
  private readonly validationMap: Record<string, (val: string) => boolean> = {
    'form-fullName': isValidFullName,
    'form-phone': isValidPhoneNumber,
    'form-email': isValidEmail,
    'form-address': isValidAddress,
    'form-city': isValidCity,
    'form-notes': isValidNotes,
  };

  // Maps field IDs to their error message translation keys
  private readonly errorMessageMap: Record<string, string> = {
    'form-fullName': 'form.validation.invalidFullName',
    'form-phone': 'form.validation.invalidPhone',
    'form-email': 'form.validation.invalidEmail',
    'form-address': 'form.validation.invalidAddress',
    'form-city': 'form.validation.invalidCity',
    'form-delivery': 'form.validation.invalidDelivery',
    'form-notes': 'form.validation.invalidNotes',
  };

  constructor() {
    this.form = document.querySelector('[form-personal-payment-data]');
    this.currentLang = this.detectLanguage();
    this.initialize();
  }

  /**
   * Initialize the form handler by setting up fields and event listeners
   */
  private initialize(): void {
    this.initializeFields();
    this.setupEventListeners();
  }

  /**
   * Detect current language from browser cookie
   * Falls back to 'en' if no cookie found
   */
  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
    return (langCookie || 'en') as Language;
  }

  /**
   * Initialize all form fields and set up their initial state
   * Creates FormField objects for each configured field ID
   */
  private initializeFields(): void {
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        this.fields.set(id, {
          id,
          value: input.value,
          isValid: false,
          errorMessage: '',
          touched: false
        });
      }
    });
  }

  /**
   * Validate a single field using its corresponding validation function
   * @param fieldId - The ID of the field to validate
   * @param value - The current value of the field
   * @returns true if valid, false otherwise
   */
  private validateField(fieldId: string, value: string): boolean {
    const validator = this.validationMap[fieldId];
    return validator ? validator(value) : false;
  }

  /**
   * Get appropriate error message for a field based on validation result
   * Only returns error messages for invalid fields
   * @param fieldId - The ID of the field
   * @param isValid - Whether the field is valid
   * @returns Error message string or empty string if valid
   */
  private getErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) return '';
    
    const messageKey = this.errorMessageMap[fieldId] || 'form.validation.invalidInput';
    return getTranslation(messageKey, this.currentLang);
  }

  /**
   * Update field validation state and refresh UI if needed
   * @param fieldId - The ID of the field to update
   * @param value - The current value of the field
   * @param forceDisplay - Whether to show validation state regardless of touched status
   * @returns true if field is valid, false otherwise
   */
  private updateFieldValidation(fieldId: string, value: string, forceDisplay = false): boolean {
    const isValid = this.validateField(fieldId, value);
    const message = this.getErrorMessage(fieldId, isValid);
    const field = this.fields.get(fieldId);
    
    if (field) {
      field.isValid = isValid;
      field.errorMessage = message;
      field.value = value;

      // Only show validation feedback if field has been touched or forced
      if (field.touched || forceDisplay) {
        this.updateUI(fieldId, message, isValid);
      }
    }
    
    return isValid;
  }

  /**
   * Update the visual state of form elements (error messages and input styling)
   * @param fieldId - The ID of the field to update
   * @param message - The error message to display
   * @param isValid - Whether the field is valid
   */
  private updateUI(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    // Update error message display
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.className = `pro-form-error ${isValid ? 'pro-text-success' : 'pro-text-error'}`;
    }

    // Update input visual state
    if (inputElement) {
      const { INVALID, VALID } = FORM_FIELD_CONFIG.ERROR_CLASSES;
      inputElement.classList.toggle(VALID, isValid);
      inputElement.classList.toggle(INVALID, !isValid);
    }
  }

  /**
   * Mark a field as touched (user has interacted with it)
   * @param fieldId - The ID of the field to mark as touched
   */
  private markFieldTouched(fieldId: string): void {
    const field = this.fields.get(fieldId);
    if (field) field.touched = true;
  }

  /**
   * Handle input value changes with real-time validation
   * @param fieldId - The ID of the field that changed
   * @param value - The new value of the field
   */
  private handleInputChange(fieldId: string, value: string): void {
    this.updateFieldValidation(fieldId, value);
  }

  /**
   * Validate all form fields at once (typically on form submission)
   * Forces validation display for all fields regardless of touched status
   * @returns true if all fields are valid, false if any field is invalid
   */
  private validateAllFields(): boolean {
    let allValid = true;
    
    this.fields.forEach((field, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        const isValid = this.updateFieldValidation(fieldId, input.value, true);
        if (!isValid) allValid = false;
      }
    });
    
    return allValid;
  }

  /**
   * Set up all event listeners for form interactions
   * Handles input changes, blur events, and form submission
   */
  private setupEventListeners(): void {
    // Setup input field listeners
    this.fields.forEach((_, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      // Real-time validation on input
      input.addEventListener('input', () => {
        this.markFieldTouched(fieldId);
        this.handleInputChange(fieldId, input.value);
      });

      // Validation feedback on blur for better UX
      input.addEventListener('blur', () => {
        this.markFieldTouched(fieldId);
        this.handleInputChange(fieldId, input.value);
      });
    });

    // Handle form submission with validation
    this.form?.addEventListener('submit', (e) => {
      if (!this.validateAllFields()) {
        e.preventDefault();
      }
    });
  }
}

/**
 * Set up radio button observers for payment and delivery options
 * Connects radio button changes to the observer pattern for cross-component state sharing
 * @param selector - CSS selector for radio buttons
 * @param subject - The observer subject to notify
 * @param setterMethod - The method name to call on the subject
 */
function setupRadioObserver(
  selector: string, 
  subject: any, 
  setterMethod: string
): void {
  const radios = document.querySelectorAll<HTMLInputElement>(selector);
  
  radios.forEach(radio => {
    // Handle radio button changes
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        subject.getInstance()[setterMethod](target.id, target.value);
      }
    });

    // Set initial state for pre-selected radio buttons
    if (radio.checked) {
      subject.getInstance()[setterMethod](radio.id, radio.value);
    }
  });
}

/**
 * Initialize all form functionality when DOM is ready
 * Sets up form validation and observer pattern for state management
 */
document.addEventListener('DOMContentLoaded', () => {
  new ProFormFieldsHandler();
  
  // Setup observers for cross-component state sharing
  setupRadioObserver(
    'input[name="delivery-option"]', 
    DeliveryOptionsSubject, 
    'setDeliveryOption'
  );
  
  setupRadioObserver(
    'input[name="payment-option"]', 
    PaymentOptionsSubject, 
    'setPaymentOption'
  );
});
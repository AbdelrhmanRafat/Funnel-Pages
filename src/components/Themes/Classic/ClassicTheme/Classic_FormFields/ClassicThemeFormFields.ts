import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';

/**
 * Interface representing a form field with validation state
 */
interface FormField {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  touched: boolean; // Add a flag to track if field has been interacted with
}

/**
 * Configuration for form fields
 */
const FORM_FIELD_CONFIG = {
  FIELD_IDS: [
    'form-fullName',
    'form-phone',
    'form-email',
    'form-address',
    'form-city',
    'form-delivery',
    'form-notes'
  ] as const,
  ERROR_CLASSES: {
    INVALID: 'classic-border-error',
    VALID: 'classic-border-success',
    ERROR_CONTAINER: 'classic-error-container',
    ERROR_MESSAGE: 'classic-error-message'
  }
} as const;

/**
 * ClassicFormFieldsHandler - Handles form field input events for real-time validation feedback
 */
class ClassicFormFieldsHandler {
  private form: HTMLFormElement | null;
  private fields: Map<string, FormField>;
  private currentLang: Language;

  constructor() {
    this.form = this.getFormElement();
    this.fields = new Map();
    this.currentLang = this.detectLanguage();
    this.initialize();
  }

  // ===== INITIALIZATION METHODS =====

  /**
   * Initialize the form fields handler
   */
  private initialize(): void {
    this.initializeFields();
    this.setupInputEventListeners();
  }

  /**
   * Get the form element from DOM
   */
  private getFormElement(): HTMLFormElement | null {
    return document.querySelector('form');
  }

  /**
   * Detect current language from cookies
   */
  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];

    return (langCookie || 'en') as Language;
  }

  /**
   * Initialize form fields in the fields Map
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
          touched: false // Initialize as untouched
        });
      }
    });
  }

  // ===== VALIDATION METHODS =====

  /**
   * Validate a specific field based on its type
   * @param fieldId - The ID of the field to validate
   * @param value - The value to validate
   * @returns boolean indicating if the field is valid
   */
  private validateField(fieldId: string, value: string): boolean {
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
  private getErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) {
      return getTranslation('form.validation.valid', this.currentLang);
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
    return getTranslation(messageKey, this.currentLang);
  }

  // ===== UI UPDATE METHODS =====

  /**
   * Display validation message for a specific field
   * @param fieldId - The ID of the field
   * @param message - The message to display
   * @param isValid - Whether the field is valid
   * @param forceDisplay - Whether to force display the message regardless of touched state
   */
  private displayValidationMessage(fieldId: string, message: string, isValid: boolean, forceDisplay: boolean = false): void {
    const field = this.fields.get(fieldId);
    
    // Only show validation messages if the field has been touched or if forced
    if (field && (field.touched || forceDisplay)) {
      this.updateErrorElement(fieldId, message, isValid);
      this.updateInputStyling(fieldId, isValid);
    }
    
    this.updateFieldState(fieldId, message, isValid);
  }

  /**
   * Update the error element for a field
   * @param fieldId - The ID of the field
   * @param message - The message to display
   * @param isValid - Whether the field is valid
   */
  private updateErrorElement(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.classList.remove('classic-text-success', 'classic-text-error');
      errorElement.classList.add(isValid ? 'classic-text-success' : 'classic-text-error');
    }
  }

  /**
   * Update input field styling based on validation state
   * @param fieldId - The ID of the field
   * @param isValid - Whether the field is valid
   */
  private updateInputStyling(fieldId: string, isValid: boolean): void {
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
   * Update field state in the fields Map
   * @param fieldId - The ID of the field
   * @param message - The error message
   * @param isValid - Whether the field is valid
   */
  private updateFieldState(fieldId: string, message: string, isValid: boolean): void {
    const field = this.fields.get(fieldId);
    if (field) {
      field.isValid = isValid;
      field.errorMessage = message;
    }
  }

  // ===== EVENT HANDLING =====

  /**
   * Set up event listeners for input fields
   */
  private setupInputEventListeners(): void {
    this.fields.forEach((field, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        // Add input event listener
        input.addEventListener('input', () => {
          // Mark the field as touched on first interaction
          const fieldData = this.fields.get(fieldId);
          if (fieldData) {
            fieldData.touched = true;
          }
          this.handleInputChange(fieldId, input.value);
        });
        
        // Also mark as touched on blur (when user leaves the field)
        input.addEventListener('blur', () => {
          const fieldData = this.fields.get(fieldId);
          if (fieldData) {
            fieldData.touched = true;
            this.handleInputChange(fieldId, input.value);
          }
        });
      }
    });
    
    // Add form submit event listener to validate all fields
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        // Validate all fields and force display of error messages
        let isValid = true;
        this.fields.forEach((field, fieldId) => {
          const input = document.getElementById(fieldId) as HTMLInputElement;
          if (input) {
            const fieldIsValid = this.validateField(fieldId, input.value);
            const message = this.getErrorMessage(fieldId, fieldIsValid);
            // Force display of validation messages on submit
            this.displayValidationMessage(fieldId, message, fieldIsValid, true);
            if (!fieldIsValid) {
              isValid = false;
            }
          }
        });
        
        // Prevent form submission if validation fails
        if (!isValid) {
          e.preventDefault();
        }
      });
    }
  }

  /**
   * Handle input change event
   * @param fieldId - The ID of the field that changed
   * @param value - The new value of the field
   */
  private handleInputChange(fieldId: string, value: string): void {
    const isValid = this.validateField(fieldId, value);
    const message = this.getErrorMessage(fieldId, isValid);
    this.displayValidationMessage(fieldId, message, isValid);
  }
}

// ===== INITIALIZATION =====

/**
 * Initialize the form fields handler when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  new ClassicFormFieldsHandler();
});
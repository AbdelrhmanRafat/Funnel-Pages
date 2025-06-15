import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidDeliveryOption,
} from '../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';
import { QuantityOptionsSubject } from '../../../../../lib/patterns/Observer';
import { ColorSizeOptionsSubject } from '../../../../../lib/patterns/Observer';

/**
 * Interface representing a form field with validation state
 */
interface FormField {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
}

/**
 * Interface for color/size option validation
 */
interface ColorSizeOption {
  panelIndex: number;
  color?: string;
  size?: string;
}

/**
 * Configuration for form fields
 */
const FORM_FIELD_CONFIG = {
  FIELD_IDS: [
    'form-fullName',
    'form-phone',
    'form-email',
    'form-city',
    'form-delivery',
    'form-notes'
  ] as const,
  ERROR_CLASSES: {
    INVALID: 'border-red-500',
    VALID: 'border-green-500',
    ERROR_CONTAINER: 'my-4 p-3 bg-red-100 text-red-700 rounded',
    ERROR_MESSAGE: 'text-red-600 text-sm mb-1'
  }
} as const;

/**
 * ClassicFormValidator - Handles form validation with real-time feedback
 * Supports multilingual validation messages and color/size option validation
 */
class ClassicFormValidator {
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
   * Initialize the form validator
   */
  private initialize(): void {
    this.initializeFields();
    this.setupEventListeners();
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
          errorMessage: ''
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
      'form-city': isValidCity,
      'form-delivery': isValidDeliveryOption,
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
      'form-city': 'form.validation.invalidCity',
      'form-delivery': 'form.validation.invalidDelivery',
      'form-notes': 'form.validation.invalidNotes',
    };

    const messageKey = errorMessageMap[fieldId] || 'form.validation.invalidInput';
    return getTranslation(messageKey, this.currentLang);
  }

  /**
   * Validate all form fields
   * @returns boolean indicating if all fields are valid
   */
  private validateAllFields(): boolean {
    let isFormValid = true;

    this.fields.forEach((field, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        const isValid = this.validateField(fieldId, input.value);
        const message = this.getErrorMessage(fieldId, isValid);
        this.displayValidationMessage(fieldId, message, isValid);
        
        if (!isValid) {
          isFormValid = false;
        }
      }
    });

    return isFormValid;
  }

  /**
   * Validate color and size options
   * @returns boolean indicating if all options are valid
   */
  private validateColorSizeOptions(): boolean {
    const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    const colorSizeState = colorSizeSubject.getState();
    const optionsErrorContainer = this.getOrCreateOptionsErrorContainer();
    
    // Clear previous errors
    optionsErrorContainer.innerHTML = '';
    
    if (!colorSizeState.options || colorSizeState.options.length === 0) {
      return true; // No options to validate
    }

    let isOptionsValid = true;

    for (const option of colorSizeState.options) {
      if (!option.color) {
        const errorMessage = `من فضلك اختر اللون للخيار رقم ${option.panelIndex}`;
        this.addOptionsError(optionsErrorContainer, errorMessage);
        isOptionsValid = false;
      }

      if (!option.size) {
        const errorMessage = `من فضلك اختر المقاس للخيار رقم ${option.panelIndex}`;
        this.addOptionsError(optionsErrorContainer, errorMessage);
        isOptionsValid = false;
      }
    }

    return isOptionsValid;
  }

  // ===== UI UPDATE METHODS =====

  /**
   * Display validation message for a specific field
   * @param fieldId - The ID of the field
   * @param message - The message to display
   * @param isValid - Whether the field is valid
   */
  private displayValidationMessage(fieldId: string, message: string, isValid: boolean): void {
    this.updateErrorElement(fieldId, message, isValid);
    this.updateInputStyling(fieldId, isValid);
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
      errorElement.style.color = isValid ? 'green' : 'red';
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

  // ===== OPTIONS ERROR HANDLING =====

  /**
   * Get or create the options error container
   * @returns HTMLElement for displaying option errors
   */
  private getOrCreateOptionsErrorContainer(): HTMLElement {
    let container = document.getElementById('options-error-container');
    
    if (!container) {
      container = this.createOptionsErrorContainer();
    }
    
    return container;
  }

  /**
   * Create error container for color/size options
   * @returns HTMLElement for the error container
   */
  private createOptionsErrorContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'options-error-container';
    container.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_CONTAINER;

    this.insertErrorContainer(container);
    return container;
  }

  /**
   * Insert error container in appropriate position in the form
   * @param container - The container element to insert
   */
  private insertErrorContainer(container: HTMLElement): void {
    if (!this.form) return;

    const submitButton = this.form.querySelector('button[type="submit"]');
    
    if (submitButton && submitButton.parentNode) {
      submitButton.parentNode.insertBefore(container, submitButton);
    } else {
      this.form.appendChild(container);
    }
  }

  /**
   * Add error message to the options error container
   * @param container - The container to add the error to
   * @param message - The error message
   */
  private addOptionsError(container: HTMLElement, message: string): void {
    const errorElement = document.createElement('p');
    errorElement.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_MESSAGE;
    errorElement.textContent = message;
    container.appendChild(errorElement);
  }

  // ===== EVENT HANDLING =====

  /**
   * Set up all event listeners for the form
   */
  private setupEventListeners(): void {
    if (!this.form) return;

    this.setupInputEventListeners();
    this.setupSubmitEventListener();
  }

  /**
   * Set up event listeners for input fields
   */
  private setupInputEventListeners(): void {
    this.fields.forEach((field, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        input.addEventListener('input', () => {
          this.handleInputChange(fieldId, input.value);
        });
      }
    });
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

  /**
   * Set up submit event listener
   */
  private setupSubmitEventListener(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', (e: Event) => {
      this.handleFormSubmit(e);
    });
  }

  /**
   * Handle form submission
   * @param e - The submit event
   */
  private handleFormSubmit(e: Event): void {
    e.preventDefault();

    // Log current state for debugging
    this.logCurrentState();

    // Validate all fields and options
    const isFieldsValid = this.validateAllFields();
    const isOptionsValid = this.validateColorSizeOptions();
    const isFormValid = isFieldsValid && isOptionsValid;

    // Submit form if all validations pass
    if (isFormValid && this.form) {
      this.form.submit();
    }
  }

  /**
   * Log current state for debugging purposes
   */
  private logCurrentState(): void {
    const quantitySubject = QuantityOptionsSubject.getInstance();
    const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    const quantityState = quantitySubject.getState();
    const colorSizeState = colorSizeSubject.getState();

    console.log('Selected Item:', quantityState.selectedItem);
    console.log('Color/Size Options:', colorSizeState.options);
  }
}

// ===== INITIALIZATION =====

/**
 * Initialize the form validator when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  new ClassicFormValidator();
});
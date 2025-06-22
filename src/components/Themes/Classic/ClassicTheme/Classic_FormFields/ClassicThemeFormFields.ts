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
import {DeliveryOptionsSubject} from '../../../../../lib/patterns/Observers/delivery-observer';

class ClassicFormFieldsHandler {
  private form: HTMLFormElement | null;
  private fields = new Map<string, FormField>();
  private currentLang: Language;
  
  // Validation mapping for cleaner field validation
  private readonly validationMap: Record<string, (val: string) => boolean> = {
    'form-fullName': isValidFullName,
    'form-phone': isValidPhoneNumber,
    'form-email': isValidEmail,
    'form-address': isValidAddress,
    'form-city': isValidCity,
    'form-notes': isValidNotes,
  };

  // Error message mapping for consistent error handling
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

  private initialize(): void {
    this.initializeFields();
    this.setupEventListeners();
  }

  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
    return (langCookie || 'en') as Language;
  }

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

  private validateField(fieldId: string, value: string): boolean {
    const validator = this.validationMap[fieldId];
    return validator ? validator(value) : false;
  }

  private getErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) return getTranslation('form.validation.valid', this.currentLang);
    
    const messageKey = this.errorMessageMap[fieldId] || 'form.validation.invalidInput';
    return getTranslation(messageKey, this.currentLang);
  }

  // Update field validation state and UI
  private updateFieldValidation(fieldId: string, value: string, forceDisplay = false): boolean {
    const isValid = this.validateField(fieldId, value);
    const message = this.getErrorMessage(fieldId, isValid);
    const field = this.fields.get(fieldId);
    
    if (field) {
      field.isValid = isValid;
      field.errorMessage = message;
      field.value = value;

      // Show validation only if touched or forced
      if (field.touched || forceDisplay) {
        this.updateUI(fieldId, message, isValid);
      }
    }
    
    return isValid;
  }

  // Update both error element and input styling
  private updateUI(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    // Update error message
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.className = `classic-text-${isValid ? 'success' : 'error'}`;
    }

    // Update input styling
    if (inputElement) {
      const { INVALID, VALID } = FORM_FIELD_CONFIG.ERROR_CLASSES;
      inputElement.classList.toggle(VALID, isValid);
      inputElement.classList.toggle(INVALID, !isValid);
    }
  }

  private markFieldTouched(fieldId: string): void {
    const field = this.fields.get(fieldId);
    if (field) field.touched = true;
  }

  private handleInputChange(fieldId: string, value: string): void {
    this.updateFieldValidation(fieldId, value);
  }

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

  private setupEventListeners(): void {
    // Setup input field listeners
    this.fields.forEach((_, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      // Handle input changes with real-time validation
      input.addEventListener('input', () => {
        this.markFieldTouched(fieldId);
        this.handleInputChange(fieldId, input.value);
      });

      // Mark touched on blur for better UX
      input.addEventListener('blur', () => {
        this.markFieldTouched(fieldId);
        this.handleInputChange(fieldId, input.value);
      });
    });

    // Handle form submission
    this.form?.addEventListener('submit', (e) => {
      if (!this.validateAllFields()) {
        e.preventDefault();
      }
    });
  }
}

// Utility function to setup radio button observers
function setupRadioObserver(
  selector: string, 
  subject: any, 
  setterMethod: string
): void {
  const radios = document.querySelectorAll<HTMLInputElement>(selector);
  
  radios.forEach(radio => {
    // Handle changes
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        subject.getInstance()[setterMethod](target.id, target.value);
      }
    });

    // Set initial state
    if (radio.checked) {
      subject.getInstance()[setterMethod](radio.id, radio.value);
    }
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ClassicFormFieldsHandler();
  
  // Setup observers for delivery and payment options
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
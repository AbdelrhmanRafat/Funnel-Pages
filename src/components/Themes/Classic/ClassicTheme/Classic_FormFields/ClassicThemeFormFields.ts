import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
} from '../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';

interface FormField {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
}

class ClassicFormValidator {
  private form: HTMLFormElement | null;
  private fields: Map<string, FormField>;
  private currentLang: Language;

  constructor() {
    this.form = document.querySelector('form');
    this.fields = new Map();
    // Get initial language from cookie or default to 'en'
    this.currentLang = (document.cookie.split('; ').find(row => row.startsWith('lang='))?.split('=')[1] || 'en') as Language;
    this.initializeFields();
    this.setupEventListeners();
  }

  private initializeFields(): void {
    const fieldIds = ['form-fullName', 'form-phone', 'form-email'];
    
    fieldIds.forEach(id => {
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

  private displayValidationMessage(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.style.color = isValid ? 'green' : 'red';
    }

    if (inputElement) {
      if (isValid) {
        inputElement.classList.remove('border-red-500');
        inputElement.classList.add('border-green-500');
      } else {
        inputElement.classList.remove('border-green-500');
        inputElement.classList.add('border-red-500');
      }
    }

    // Update field state
    const field = this.fields.get(fieldId);
    if (field) {
      field.isValid = isValid;
      field.errorMessage = message;
    }
  }

  private validateField(fieldId: string, value: string): boolean {
    switch (fieldId) {
      case 'form-fullName':
        return isValidFullName(value);
      case 'form-phone':
        return isValidPhoneNumber(value);
      case 'form-email':
        return isValidEmail(value);
      default:
        return false;
    }
  }

  private getErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) return getTranslation('form.validation.valid', this.currentLang);
    switch (fieldId) {
      case 'form-fullName':
        return getTranslation('form.validation.invalidFullName', this.currentLang);
      case 'form-phone':
        return getTranslation('form.validation.invalidPhone', this.currentLang);
      case 'form-email':
        return getTranslation('form.validation.invalidEmail', this.currentLang);
      default:
        return getTranslation('form.validation.invalidInput', this.currentLang);
    }
  }

  private setupEventListeners(): void {
    if (!this.form) return;

    // Add input event listeners for real-time validation
    this.fields.forEach((field, fieldId) => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        input.addEventListener('input', () => {
          const isValid = this.validateField(fieldId, input.value);
          const message = this.getErrorMessage(fieldId, isValid);
          this.displayValidationMessage(fieldId, message, isValid);
        });
      }
    });

    // Add form submission handler
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      
      let isFormValid = true;

      // Validate all fields
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

      // Submit form if all fields are valid
      if (isFormValid && this.form) {
        this.form.submit();
      }
    });
  }
}
// Initialize the form validator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ClassicFormValidator();
});

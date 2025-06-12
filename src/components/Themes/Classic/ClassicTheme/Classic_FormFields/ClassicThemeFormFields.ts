import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
} from '../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';
import { QuantityOptionsSubject } from '../../../../../lib/patterns/Observer';
import { ColorSizeOptionsSubject } from '../../../../../lib/patterns/Observer';

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

    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
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

      // Get the currently selected item and color/size options
      const quantitySubject = QuantityOptionsSubject.getInstance();
      const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
      const quantityState = quantitySubject.getState();
      const colorSizeState = colorSizeSubject.getState();

      console.log('Selected Item:', quantityState.selectedItem);
      console.log('Color/Size Options:', colorSizeState.options);

      // Validate color and size options
      const optionsErrorContainer = document.getElementById('options-error-container') || this.createOptionsErrorContainer();
      optionsErrorContainer.innerHTML = '';

      if (colorSizeState.options && colorSizeState.options.length > 0) {
        for (const option of colorSizeState.options) {
          // Check for missing color
          if (!option.color) {
            const errorMessage = `من فضلك اختر اللون للخيار رقم ${option.panelIndex}`;
            this.addOptionsError(optionsErrorContainer, errorMessage);
            isFormValid = false;
          }

          // Check for missing size
          if (!option.size) {
            const errorMessage = `من فضلك اختر المقاس للخيار رقم ${option.panelIndex}`;
            this.addOptionsError(optionsErrorContainer, errorMessage);
            isFormValid = false;
          }
        }
      }

      if (isFormValid && this.form) {
        this.form.submit();
      }
    });
  }

  // Helper method to create error container if it doesn't exist
  private createOptionsErrorContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'options-error-container';
    container.className = 'my-4 p-3 bg-red-100 text-red-700 rounded';

    // Insert before the submit button or at the end of the form
    const submitButton = this.form?.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.parentNode?.insertBefore(container, submitButton);
    } else if (this.form) {
      this.form.appendChild(container);
    }

    return container;
  }

  // Helper method to add error messages to the container
  private addOptionsError(container: HTMLElement, message: string): void {
    const errorElement = document.createElement('p');
    errorElement.className = 'text-red-600 text-sm mb-1';
    errorElement.textContent = message;
    container.appendChild(errorElement);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ClassicFormValidator();
});

// troySubmitOrderButton.ts - Web Component for Submit Order with Validation
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
import { FORM_FIELD_CONFIG } from '../../../../../../lib/constants/formConfig';

interface SubmitOrderElements {
  submitButton: HTMLButtonElement | null;
}
class troySubmitOrder extends HTMLElement {
  private elements: SubmitOrderElements = {
    submitButton: null
  };
  private formFieldsSubject: FormFieldsSubject;
  private colorSizeSubject: ColorSizeOptionsSubject;
  private validateOnSubmit: boolean = true;
  private showValidationMessages: boolean = true;
  private autoFocusFirstError: boolean = true;
  private enableColorSizeValidation: boolean = true;

  constructor() {
    super();
    this.formFieldsSubject = FormFieldsSubject.getInstance();
    this.colorSizeSubject = ColorSizeOptionsSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.initializeFormFieldsSubject();
    this.setupFormFieldListeners();
    this.setupSubmitButton();
  }

  private initializeSettings(): void {
    this.validateOnSubmit = this.getAttribute('data-submit-validate-on-submit') !== 'false';
    this.showValidationMessages = this.getAttribute('data-submit-show-validation-messages') !== 'false';
    this.autoFocusFirstError = this.getAttribute('data-submit-auto-focus-first-error') !== 'false';
    this.enableColorSizeValidation = this.getAttribute('data-submit-enable-color-size-validation') !== 'false';
  }

  private initializeElements(): void {
    this.elements = {
      submitButton: this.querySelector('[data-submit-order-button]') as HTMLButtonElement
    };

    if (!this.elements.submitButton) {
      console.warn('Submit Order: Submit button not found');
      return;
    }
  }

  private initializeFormFieldsSubject(): void {
    this.formFieldsSubject.initializeFields(FORM_FIELD_CONFIG.FIELD_IDS);
  }

  private setupFormFieldListeners(): void {
    // Set up listeners for regular form fields
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        // Set initial value in the observer without showing validation messages
        this.updateFieldState(fieldId, input.value, false);
        
        // Add input event listener
        input.addEventListener('input', () => {
          this.updateFieldState(fieldId, input.value, true);
        });
        
        // Also mark as touched on blur (when user leaves the field)
        input.addEventListener('blur', () => {
          this.updateFieldState(fieldId, input.value, true);
        });
      }
    });
    
    
  }

  private setupSubmitButton(): void {
    if (!this.elements.submitButton) return;

    this.elements.submitButton.addEventListener("click", (e: Event) => {
      this.handleSubmit(e);
    });
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    // Dispatch event before validation
    this.dispatchEvent(new CustomEvent('submit-validation-start', {
      detail: { 
        validateOnSubmit: this.validateOnSubmit,
        enableColorSizeValidation: this.enableColorSizeValidation 
      }
    }));

    let isFormValid = true;

    if (this.validateOnSubmit) {
      // Validate the form
      isFormValid = this.validateForm();
    }

    // Dispatch validation result event
    this.dispatchEvent(new CustomEvent('submit-validation-complete', {
      detail: { 
        isValid: isFormValid,
        formState: this.getFormState(),
        colorSizeState: this.getColorSizeState()
      }
    }));

    // Only open the modal if validation passes
    if (isFormValid) {
      this.openPurchaseModal();
    } else if (this.autoFocusFirstError) {
      this.focusFirstErrorField();
    }
  }

  private validateForm(): boolean {
    const areFieldsValid = this.validateAllFields();
    const areOptionsValid = this.enableColorSizeValidation ? this.validateColorSizeOptions() : true;
    return areFieldsValid && areOptionsValid;
  }

  private updateFieldState(fieldId: string, value: string, touched: boolean = false): void {
    const isValid = this.validateField(fieldId, value);
    const errorMessage = this.getErrorMessage(fieldId, isValid);
    
    // Update state in observer
    this.formFieldsSubject.updateField(fieldId, {
      value,
      isValid,
      errorMessage,
      touched
    });
    
    // Only update UI if the field has been touched and validation messages are enabled
    if (touched && this.showValidationMessages) {
      this.displayValidationMessage(fieldId, errorMessage, isValid);
    }
  }

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

  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];

    return (langCookie || 'en') as Language;
  }

  private getErrorMessage(fieldId: string, isValid: boolean): string {
    const currentLang = this.detectLanguage();
    
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

  private validateAllFields(): boolean {
    let isFormValid = true;

    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        const isValid = this.validateField(fieldId, input.value);
        const message = this.getErrorMessage(fieldId, isValid);
        
        // Force display validation messages when validating all fields (on submit)
        if (this.showValidationMessages) {
          this.displayValidationMessage(fieldId, message, isValid);
        }
        this.updateFieldState(fieldId, input.value, true); // Mark as touched

        if (!isValid) {
          isFormValid = false;
        }
      }
    });

    return isFormValid;
  }

  private displayValidationMessage(fieldId: string, message: string, isValid: boolean): void {
    this.updateErrorElement(fieldId, message, isValid);
    this.updateInputStyling(fieldId, isValid);
  }

  private updateErrorElement(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
      errorElement.classList.remove('troy-text-success', 'troy-text-error');
      errorElement.classList.add(isValid ? 'troy-text-success' : 'troy-text-error');
    }
  }

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

  private validateColorSizeOptions(): boolean {
    const colorSizeState = this.colorSizeSubject.getState();

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

    // Only create container if there are actual errors
    if (!isOptionsValid && this.showValidationMessages) {
      const optionsErrorContainer = this.getOrCreateOptionsErrorContainer();
      optionsErrorContainer.innerHTML = '';
      errorMessages.forEach(msg => this.addOptionsError(optionsErrorContainer, msg));
    } else {
      // If no errors, remove container if it exists
      const existing = document.getElementById('options-error-container');
      if (existing) existing.remove();
    }

    return isOptionsValid;
  }

  private getOrCreateOptionsErrorContainer(): HTMLElement {
    let container = document.getElementById('options-error-container');

    if (!container) {
      container = this.createOptionsErrorContainer();
    }

    return container;
  }

  private createOptionsErrorContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'options-error-container';
    container.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_CONTAINER;

    this.insertErrorContainer(container);
    return container;
  }

  private insertErrorContainer(container: HTMLElement): void {
    const form = document.querySelector('form');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]') || this.elements.submitButton;

    if (submitButton && submitButton.parentNode) {
      submitButton.parentNode.insertBefore(container, submitButton);
    } else {
      form.appendChild(container);
    }
  }

  private addOptionsError(container: HTMLElement, message: string): void {
    const errorElement = document.createElement('p');
    errorElement.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_MESSAGE;
    errorElement.textContent = message;
    container.appendChild(errorElement);
  }

  private openPurchaseModal(): void {
    // Dispatch event before opening modal
    this.dispatchEvent(new CustomEvent('submit-modal-opening', {
      detail: { 
        formState: this.getFormState(),
        colorSizeState: this.getColorSizeState()
      }
    }));

    // Create and dispatch a custom event to open the modal
    const openModalEvent = new CustomEvent('openPurchaseModal');
    document.dispatchEvent(openModalEvent);

    // Dispatch event after modal opened
    this.dispatchEvent(new CustomEvent('submit-modal-opened'));
  }

  private focusFirstErrorField(): void {
    // Find first invalid field and focus it
    for (const fieldId of FORM_FIELD_CONFIG.FIELD_IDS) {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input && !this.validateField(fieldId, input.value)) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }

  // Public API methods
  public validateFormManually(): boolean {
    return this.validateForm();
  }

  public getFormState(): any {
    return this.formFieldsSubject.getState();
  }

  public getColorSizeState(): any {
    return this.colorSizeSubject.getState();
  }

  public triggerSubmit(): void {
    if (this.elements.submitButton) {
      this.elements.submitButton.click();
    }
  }

  public enableValidation(enable: boolean): void {
    this.validateOnSubmit = enable;
    this.setAttribute('data-submit-validate-on-submit', enable.toString());
  }

  public enableValidationMessages(enable: boolean): void {
    this.showValidationMessages = enable;
    this.setAttribute('data-submit-show-validation-messages', enable.toString());
  }

  public enableColorSizeValidationFeature(enable: boolean): void {
    this.enableColorSizeValidation = enable;
    this.setAttribute('data-submit-enable-color-size-validation', enable.toString());
  }

  public clearAllValidationMessages(): void {
    // Clear field validation messages
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      this.updateErrorElement(fieldId, '', true);
      this.updateInputStyling(fieldId, true);
    });

    // Clear options validation messages
    const existing = document.getElementById('options-error-container');
    if (existing) existing.remove();
  }

  public getFormFieldsSubject(): FormFieldsSubject {
    return this.formFieldsSubject;
  }

  public getColorSizeSubject(): ColorSizeOptionsSubject {
    return this.colorSizeSubject;
  }
}
// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('troy-submit-order')) {
    customElements.define('troy-submit-order', troySubmitOrder);
  }
});
// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const submitOrders = document.querySelectorAll('troy-submit-order:not(:defined)');
  submitOrders.forEach(submitOrder => {
    if (submitOrder instanceof troySubmitOrder) {
      submitOrder.connectedCallback();
    }
  });
});

export { troySubmitOrder };
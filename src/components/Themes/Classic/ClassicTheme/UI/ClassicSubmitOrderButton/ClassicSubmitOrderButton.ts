// ClassicSubmitOrderButton.ts - Simplified Web Component for Submit Order with Validation
import {
  isValidFullName,
  isValidPhoneNumber,
  isValidEmail,
  isValidCity,
  isValidNotes,
  isValidAddress,
} from '../../../../../../lib/utils/validation';
import { getTranslation, type Language } from '../../../../../../lib/utils/i18n/translations';
import { FORM_FIELD_CONFIG } from '../../../../../../lib/constants/formConfig';
import { CustomOptionSubject } from '../../../../../../lib/patterns/Observers/custom-option-observer';
import { FormFieldsSubject } from '../../../../../../lib/patterns/Observers/form-fields-observer';
import { CustomOptionsNonBundleSubject } from '../../../../../../lib/patterns/Observers/custom-options-non-bundle';

interface ValidationState {
  isValid: boolean;
  errorMessage: string;
}

class ClassicSubmitOrder extends HTMLElement {
  // Core elements
  private submitButton: HTMLButtonElement | null = null;
  
  // Observers - initialized in constructor
  private readonly formFieldsSubject: FormFieldsSubject;
  private readonly customOptionSubject: CustomOptionSubject;
  private readonly customOptionsNonBundleSubject: CustomOptionsNonBundleSubject;
  
  // Configuration
  private config = {
    validateOnSubmit: true,
    showValidationMessages: true,
    autoFocusFirstError: true,
    enableColorSizeValidation: true,
    isHaveVariant: "true",
    isHaveBundles: "false"
  };
  
  private currentLang: Language;

  // Validation mapping
  private readonly validationMap: Record<string, (val: string) => boolean> = {
    'form-fullName': isValidFullName,
    'form-phone': isValidPhoneNumber,
    'form-email': isValidEmail,
    'form-address': isValidAddress,
    'form-city': isValidCity,
    'form-notes': isValidNotes,
  };

  constructor() {
    super();
    this.currentLang = this.detectLanguage();
    
    // Initialize observers in constructor
    this.formFieldsSubject = FormFieldsSubject.getInstance();
    this.customOptionSubject = CustomOptionSubject.getInstance();
    this.customOptionsNonBundleSubject = CustomOptionsNonBundleSubject.getInstance();
  }

  connectedCallback() {
    this.loadConfiguration();
    this.initializeElements();
    this.setupEventListeners();
  }

  // ===== INITIALIZATION =====
  private loadConfiguration(): void {
    this.config = {
      validateOnSubmit: this.getAttribute('data-submit-validate-on-submit') !== 'false',
      showValidationMessages: this.getAttribute('data-submit-show-validation-messages') !== 'false',
      autoFocusFirstError: this.getAttribute('data-submit-auto-focus-first-error') !== 'false',
      enableColorSizeValidation: this.getAttribute('data-submit-enable-color-size-validation') !== 'false',
      isHaveVariant: this.getAttribute('is-Have-Variant') || "true",
      isHaveBundles: this.getAttribute('is-Have-Bundles') || "false"
    };
  }

  private initializeElements(): void {
    this.submitButton = this.querySelector('[data-submit-order-button]');
    if (!this.submitButton) {
      console.warn('Submit Order: Submit button not found');
      return;
    }
    this.formFieldsSubject.initializeFields(FORM_FIELD_CONFIG.FIELD_IDS);
  }

  private setupEventListeners(): void {
    this.setupFormFieldListeners();
    this.setupSubmitButton();
  }

  private setupFormFieldListeners(): void {
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      // Initialize field state
      this.updateFieldState(fieldId, input.value, false);

      // Add event listeners
      input.addEventListener('input', () => this.updateFieldState(fieldId, input.value, true));
      input.addEventListener('blur', () => this.updateFieldState(fieldId, input.value, true));
    });
  }

  private setupSubmitButton(): void {
    if (!this.submitButton) return;
    this.submitButton.addEventListener("click", (e: Event) => this.handleSubmit(e));
  }

  // ===== FORM SUBMISSION =====
  private handleSubmit(e: Event): void {
    e.preventDefault();

    this.dispatchValidationStartEvent();
    
    const isFormValid = this.config.validateOnSubmit ? this.validateForm() : true;
    
    this.dispatchValidationCompleteEvent(isFormValid);

    if (isFormValid) {
      this.openPurchaseModal();
    } else if (this.config.autoFocusFirstError) {
      this.focusFirstErrorField();
    }
  }

  private validateForm(): boolean {
    const areFieldsValid = this.validateAllFields();
    const areOptionsValid = this.config.enableColorSizeValidation ? this.validateColorSizeOptions() : true;
    return areFieldsValid && areOptionsValid;
  }

  // ===== FIELD VALIDATION =====
  private updateFieldState(fieldId: string, value: string, touched: boolean = false): void {
    const validationState = this.getFieldValidationState(fieldId, value);

    this.formFieldsSubject.updateField(fieldId, {
      value,
      isValid: validationState.isValid,
      errorMessage: validationState.errorMessage,
      touched
    });

    if (touched && this.config.showValidationMessages) {
      this.displayValidationMessage(fieldId, validationState);
    }
  }

  private getFieldValidationState(fieldId: string, value: string): ValidationState {
    const validator = this.validationMap[fieldId];
    const isValid = validator ? validator(value) : false;
    const errorMessage = this.getErrorMessage(fieldId, isValid);
    
    return { isValid, errorMessage };
  }

  private validateAllFields(): boolean {
    let isFormValid = true;

    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      const validationState = this.getFieldValidationState(fieldId, input.value);

      if (this.config.showValidationMessages) {
        this.displayValidationMessage(fieldId, validationState);
      }

      this.updateFieldState(fieldId, input.value, true);

      if (!validationState.isValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  private displayValidationMessage(fieldId: string, state: ValidationState): void {
    this.updateErrorElement(fieldId, state.errorMessage, state.isValid);
    this.updateInputStyling(fieldId, state.isValid);
  }

  private updateErrorElement(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
    errorElement.classList.remove('classic-text-success', 'classic-text-error');
    errorElement.classList.add(isValid ? 'classic-text-success' : 'classic-text-error');
  }

  private updateInputStyling(fieldId: string, isValid: boolean): void {
    const inputElement = document.getElementById(fieldId);
    if (!inputElement) return;

    const { INVALID, VALID } = FORM_FIELD_CONFIG.ERROR_CLASSES;
    inputElement.classList.remove(INVALID, VALID);
    inputElement.classList.add(isValid ? VALID : INVALID);
  }

  // ===== OPTIONS VALIDATION =====
  private validateColorSizeOptions(): boolean {
    if (this.config.isHaveVariant === "false") return true;

    const validationResult = this.config.isHaveBundles === "false" 
      ? this.validateSingleOption() 
      : this.validateBundleOptions();

    this.handleOptionsValidationUI(validationResult);
    return validationResult.isValid;
  }

  private validateSingleOption(): { isValid: boolean; errors: string[] } {
    const state = this.customOptionsNonBundleSubject.getState();
    const option = state?.option;
    const errors: string[] = [];

    if (!option) {
      errors.push(this.getTranslatedMessage('optionNotFound'));
      return { isValid: false, errors };
    }

    if (!option.firstOption) {
      errors.push(this.getTranslatedMessage('selectFirstOption'));
    }

    if (!option.secondOption && state.availableSecondOptions.length > 0) {
      errors.push(this.getTranslatedMessage('selectSecondOption'));
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateBundleOptions(): { isValid: boolean; errors: string[] } {
    const state = this.customOptionSubject.getState();
    const options = state?.options;
    const errors: string[] = [];

    if (!Array.isArray(options) || options.length === 0) {
      errors.push(this.getTranslatedMessage('noOptionsFound'));
      return { isValid: false, errors };
    }

    const numberOfOptions = options[0]?.numberOfOptions ?? 0;

    options.forEach(option => {
      if (!option.firstOption) {
        errors.push(this.getTranslatedMessage('selectFirstOptionForItem', option.panelIndex));
      }

      if (numberOfOptions > 1 && !option.secondOption) {
        errors.push(this.getTranslatedMessage('selectSecondOptionForItem', option.panelIndex));
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  private handleOptionsValidationUI(result: { isValid: boolean; errors: string[] }): void {
    const existingContainer = document.getElementById('options-error-container');
    if (existingContainer) existingContainer.remove();

    if (!result.isValid && this.config.showValidationMessages) {
      const container = this.createOptionsErrorContainer();
      result.errors.forEach(error => this.addOptionsError(container, error));
    }
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

    const submitButton = form.querySelector('button[type="submit"]') || this.submitButton;
    if (submitButton?.parentNode) {
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

  // ===== UTILITY METHODS =====
  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
    return (langCookie || 'en') as Language;
  }

  private getErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) return getTranslation('form.validation.valid', this.currentLang);

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

  private getTranslatedMessage(key: string, param?: any): string {
    const messages: Record<string, Record<Language, string>> = {
      optionNotFound: {
        ar: 'الخيار غير موجود للتحقق منه.',
        en: 'Option not found to validate.'
      },
      selectFirstOption: {
        ar: 'برجاء اختيار الخيار الأول.',
        en: 'Please select the first option.'
      },
      selectSecondOption: {
        ar: 'برجاء اختيار الخيار الثاني.',
        en: 'Please select the second option.'
      },
      noOptionsFound: {
        ar: 'لم يتم العثور على خيارات للتحقق منها.',
        en: 'No options found to validate.'
      },
      selectFirstOptionForItem: {
        ar: `برجاء اختيار الخيار الأول للخيار رقم ${param}`,
        en: `Please select the first option for item ${param}`
      },
      selectSecondOptionForItem: {
        ar: `برجاء اختيار الخيار الثاني للخيار رقم ${param}`,
        en: `Please select the second option for item ${param}`
      }
    };

    return messages[key]?.[this.currentLang] || messages[key]?.['en'] || '';
  }

  private openPurchaseModal(): void {
    this.dispatchEvent(new CustomEvent('submit-modal-opening', {
      detail: { formState: this.getFormState(), colorSizeState: this.getColorSizeState() }
    }));

    document.dispatchEvent(new CustomEvent('openPurchaseModal'));
    
    this.dispatchEvent(new CustomEvent('submit-modal-opened'));
  }

  private focusFirstErrorField(): void {
    for (const fieldId of FORM_FIELD_CONFIG.FIELD_IDS) {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input && !this.getFieldValidationState(fieldId, input.value).isValid) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }

  // ===== EVENT DISPATCHERS =====
  private dispatchValidationStartEvent(): void {
    this.dispatchEvent(new CustomEvent('submit-validation-start', {
      detail: {
        validateOnSubmit: this.config.validateOnSubmit,
        enableColorSizeValidation: this.config.enableColorSizeValidation
      }
    }));
  }

  private dispatchValidationCompleteEvent(isValid: boolean): void {
    this.dispatchEvent(new CustomEvent('submit-validation-complete', {
      detail: {
        isValid,
        formState: this.getFormState(),
        colorSizeState: this.getColorSizeState()
      }
    }));
  }

  // ===== PUBLIC API =====
  public validateFormManually(): boolean {
    return this.validateForm();
  }

  public getFormState(): any {
    return this.formFieldsSubject.getState();
  }

  public getColorSizeState(): any {
    return this.customOptionSubject.getState();
  }

  public triggerSubmit(): void {
    this.submitButton?.click();
  }

  public updateConfiguration(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
    Object.entries(config).forEach(([key, value]) => {
      this.setAttribute(`data-submit-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value.toString());
    });
  }

  public clearAllValidationMessages(): void {
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      this.updateErrorElement(fieldId, '', true);
      this.updateInputStyling(fieldId, true);
    });

    const existingContainer = document.getElementById('options-error-container');
    if (existingContainer) existingContainer.remove();
  }

  public getFormFieldsSubject(): FormFieldsSubject {
    return this.formFieldsSubject;
  }

  public getColorSizeSubject(): CustomOptionSubject {
    return this.customOptionSubject;
  }
}

// Registration and lifecycle management
const initializeSubmitOrder = () => {
  if (!customElements.get('classic-submit-order')) {
    customElements.define('classic-submit-order', ClassicSubmitOrder);
  }
};

// Handle different loading scenarios
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSubmitOrder);
} else {
  initializeSubmitOrder();
}

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const submitOrders = document.querySelectorAll('classic-submit-order:not(:defined)');
  submitOrders.forEach(submitOrder => {
    if (submitOrder instanceof ClassicSubmitOrder) {
      submitOrder.connectedCallback();
    }
  });
});

export { ClassicSubmitOrder };
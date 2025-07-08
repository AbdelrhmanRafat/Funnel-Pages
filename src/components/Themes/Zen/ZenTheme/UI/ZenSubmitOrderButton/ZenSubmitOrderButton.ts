// ZenSubmitOrderButton.ts - Simplified Web Component for Submit Order with Validation

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
import { FormFieldsSubject } from '../../../../../../lib/patterns/Observers/form-fields-observer';
import { CustomOptionsNonBundleSubject } from '../../../../../../lib/patterns/Observers/custom-options-non-bundle';
import { CustomOptionBundlesSubject } from '../../../../../../lib/patterns/Observers/custom-option-observer-bundles';

// Types
interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

interface SubmitConfig {
  validateOnSubmit: boolean;
  showValidationMessages: boolean;
  autoFocusFirstError: boolean;
  enableOptionsValidation: boolean;
  isHaveVariant: boolean;
  isHaveBundles: boolean;
}

// Constants
const DEFAULT_CONFIG: SubmitConfig = {
  validateOnSubmit: true,
  showValidationMessages: true,
  autoFocusFirstError: true,
  enableOptionsValidation: true,
  isHaveVariant: true,
  isHaveBundles: false
};

const VALIDATION_FUNCTIONS = {
  'form-fullName': isValidFullName,
  'form-phone': isValidPhoneNumber,
  'form-email': isValidEmail,
  'form-address': isValidAddress,
  'form-city': isValidCity,
  'form-notes': isValidNotes,
};

const ERROR_MESSAGES = {
  optionNotFound: { ar: 'الخيار غير موجود للتحقق منه.', en: 'Option not found to validate.' },
  selectFirstOption: { ar: 'برجاء اختيار الخيار الأول.', en: 'Please select the first option.' },
  selectSecondOption: { ar: 'برجاء اختيار الخيار الثاني.', en: 'Please select the second option.' },
  noOptionsFound: { ar: 'لم يتم العثور على خيارات للتحقق منها.', en: 'No options found to validate.' },
  selectFirstOptionForItem: { ar: 'برجاء اختيار الخيار الأول للخيار رقم', en: 'Please select the first option for item' },
  selectSecondOptionForItem: { ar: 'برجاء اختيار الخيار الثاني للخيار رقم', en: 'Please select the second option for item' }
};

class ZenSubmitOrder extends HTMLElement {
  private submitButton: HTMLButtonElement | null = null;
  private config: SubmitConfig = { ...DEFAULT_CONFIG };
  private currentLang: Language = 'en';
  
  // Observers
  private readonly formFieldsSubject = FormFieldsSubject.getInstance();
  private readonly customOptionBundlesSubject = CustomOptionBundlesSubject.getInstance();
  private readonly customOptionsNonBundleSubject = CustomOptionsNonBundleSubject.getInstance();

  constructor() {
    super();
    this.currentLang = this.detectLanguage();
  }

  connectedCallback() {
    this.loadConfig();
    this.initializeElements();
    this.setupEventListeners();
  }

  // === INITIALIZATION ===
  private loadConfig(): void {
    this.config = {
      validateOnSubmit: this.getAttribute('data-submit-validate-on-submit') !== 'false',
      showValidationMessages: this.getAttribute('data-submit-show-validation-messages') !== 'false',
      autoFocusFirstError: this.getAttribute('data-submit-auto-focus-first-error') !== 'false',
      enableOptionsValidation: this.getAttribute('data-submit-enable-color-size-validation') !== 'false',
      isHaveVariant: this.getAttribute('is-Have-Variant') !== 'false',
      isHaveBundles: this.getAttribute('is-Have-Bundles') === 'true'
    };
  }

  private initializeElements(): void {
    this.submitButton = this.querySelector('[data-submit-order-button]');
    this.formFieldsSubject.initializeFields(FORM_FIELD_CONFIG.FIELD_IDS);
  }

  private setupEventListeners(): void {
    this.setupFormListeners();
    this.setupSubmitListener();
  }

  private setupFormListeners(): void {
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      this.updateFieldState(fieldId, input.value, false);
      input.addEventListener('input', () => this.updateFieldState(fieldId, input.value, true));
      input.addEventListener('blur', () => this.updateFieldState(fieldId, input.value, true));
    });
  }

  private setupSubmitListener(): void {
    this.submitButton?.addEventListener('click', (e) => this.handleSubmit(e));
  }

  // === FORM SUBMISSION ===
  private handleSubmit(e: Event): void {
    e.preventDefault();
    
    this.dispatchEvent(new CustomEvent('submit-validation-start'));
    
    const isValid = this.config.validateOnSubmit ? this.validateAll() : true;
    
    this.dispatchEvent(new CustomEvent('submit-validation-complete', { 
      detail: { isValid, formState: this.getFormState(), optionsState: this.getOptionsState() }
    }));

    if (isValid) {
      this.openModal();
    } else if (this.config.autoFocusFirstError) {
      this.focusFirstError();
    }
  }

  private validateAll(): boolean {
    const fieldsValid = this.validateFields();
    const optionsValid = this.config.enableOptionsValidation ? this.validateOptions() : true;
    return fieldsValid && optionsValid;
  }

  // === FIELD VALIDATION ===
  private validateFields(): boolean {
    let allValid = true;

    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      const result = this.validateField(fieldId, input.value);
      this.updateFieldState(fieldId, input.value, true);
      
      if (this.config.showValidationMessages) {
        this.showFieldError(fieldId, result);
      }
      
      if (!result.isValid) allValid = false;
    });

    return allValid;
  }

  private validateField(fieldId: string, value: string): ValidationResult {
    const validator = VALIDATION_FUNCTIONS[fieldId as keyof typeof VALIDATION_FUNCTIONS];
    const isValid = validator ? validator(value) : false;
    const errorMessage = this.getFieldErrorMessage(fieldId, isValid);
    
    return { isValid, errorMessage };
  }

  private updateFieldState(fieldId: string, value: string, touched: boolean): void {
    const result = this.validateField(fieldId, value);
    
    this.formFieldsSubject.updateField(fieldId, {
      value,
      isValid: result.isValid,
      errorMessage: result.errorMessage,
      touched
    });

    if (touched && this.config.showValidationMessages) {
      this.showFieldError(fieldId, result);
    }
  }

  private showFieldError(fieldId: string, result: ValidationResult): void {
    this.updateErrorElement(fieldId, result.errorMessage, result.isValid);
    this.updateInputStyle(fieldId, result.isValid);
  }

  private updateErrorElement(fieldId: string, message: string, isValid: boolean): void {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (!errorElement) return;

    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
    errorElement.className = `zen-text-${isValid ? 'success' : 'error'}`;
  }

  private updateInputStyle(fieldId: string, isValid: boolean): void {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const { INVALID, VALID } = FORM_FIELD_CONFIG.ERROR_CLASSES;
    input.classList.remove(INVALID, VALID);
    input.classList.add(isValid ? VALID : INVALID);
  }

  // === OPTIONS VALIDATION ===
  private validateOptions(): boolean {
    if (!this.config.isHaveVariant) return true;

    const result = this.config.isHaveBundles 
      ? this.validateBundleOptions() 
      : this.validateSingleOptions();

    this.showOptionsErrors(result.errors);
    return result.isValid;
  }

  private validateSingleOptions(): { isValid: boolean; errors: string[] } {
    const state = this.customOptionsNonBundleSubject.getState();
    const option = state?.option;
    const errors: string[] = [];

    if (!option) {
      errors.push(this.getErrorMessage('optionNotFound'));
      return { isValid: false, errors };
    }

    if (!option.firstOption) {
      errors.push(this.getErrorMessage('selectFirstOption'));
    }

    if (!option.secondOption && state.availableSecondOptions?.length > 0) {
      errors.push(this.getErrorMessage('selectSecondOption'));
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateBundleOptions(): { isValid: boolean; errors: string[] } {
    const state = this.customOptionBundlesSubject.getState();
    const options = state?.options;
    const errors: string[] = [];

    if (!Array.isArray(options) || options.length === 0) {
      errors.push(this.getErrorMessage('noOptionsFound'));
      return { isValid: false, errors };
    }

    const numberOfOptions = options[0]?.numberOfOptions ?? 0;

    options.forEach(option => {
      if (!option.firstOption) {
        errors.push(`${this.getErrorMessage('selectFirstOptionForItem')} ${option.panelIndex}`);
      }

      if (numberOfOptions > 1 && !option.secondOption) {
        errors.push(`${this.getErrorMessage('selectSecondOptionForItem')} ${option.panelIndex}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  private showOptionsErrors(errors: string[]): void {
    this.clearOptionsErrors();

    if (errors.length === 0 || !this.config.showValidationMessages) return;

    const container = this.createErrorContainer();
    errors.forEach(error => this.addErrorToContainer(container, error));
  }

  private clearOptionsErrors(): void {
    const container = document.getElementById('options-error-container');
    container?.remove();
  }

  private createErrorContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'options-error-container';
    container.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_CONTAINER;
    
    const form = document.querySelector('form');
    const submitButton = form?.querySelector('button[type="submit"]') || this.submitButton;
    
    if (submitButton?.parentNode) {
      submitButton.parentNode.insertBefore(container, submitButton);
    } else {
      form?.appendChild(container);
    }
    
    return container;
  }

  private addErrorToContainer(container: HTMLElement, message: string): void {
    const errorElement = document.createElement('p');
    errorElement.className = FORM_FIELD_CONFIG.ERROR_CLASSES.ERROR_MESSAGE;
    errorElement.textContent = message;
    container.appendChild(errorElement);
  }

  // === UTILITY METHODS ===
  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
    return (langCookie || 'en') as Language;
  }

  private getFieldErrorMessage(fieldId: string, isValid: boolean): string {
    if (isValid) return getTranslation('form.validation.valid', this.currentLang);

    const errorKeys: Record<string, string> = {
      'form-fullName': 'form.validation.invalidFullName',
      'form-phone': 'form.validation.invalidPhone',
      'form-email': 'form.validation.invalidEmail',
      'form-address': 'form.validation.invalidAddress',
      'form-city': 'form.validation.invalidCity',
      'form-delivery': 'form.validation.invalidDelivery',
      'form-notes': 'form.validation.invalidNotes',
    };

    const messageKey = errorKeys[fieldId] || 'form.validation.invalidInput';
    return getTranslation(messageKey, this.currentLang);
  }

  private getErrorMessage(key: string): string {
    const message = ERROR_MESSAGES[key as keyof typeof ERROR_MESSAGES];
    return message?.[this.currentLang] || message?.['en'] || '';
  }

  private openModal(): void {
    this.dispatchEvent(new CustomEvent('submit-modal-opening', {
      detail: { formState: this.getFormState(), optionsState: this.getOptionsState() }
    }));

    document.dispatchEvent(new CustomEvent('openPurchaseModal'));
    
    this.dispatchEvent(new CustomEvent('submit-modal-opened'));
  }

  private focusFirstError(): void {
    for (const fieldId of FORM_FIELD_CONFIG.FIELD_IDS) {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input && !this.validateField(fieldId, input.value).isValid) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }

  // === PUBLIC API ===
  public validateFormManually(): boolean {
    return this.validateAll();
  }

  public getFormState(): any {
    return this.formFieldsSubject.getState();
  }

  public getOptionsState(): any {
    return this.config.isHaveBundles 
      ? this.customOptionBundlesSubject.getState()
      : this.customOptionsNonBundleSubject.getState();
  }

  public triggerSubmit(): void {
    this.submitButton?.click();
  }

  public updateConfig(newConfig: Partial<SubmitConfig>): void {
    this.config = { ...this.config, ...newConfig };
    Object.entries(newConfig).forEach(([key, value]) => {
      this.setAttribute(`data-submit-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value.toString());
    });
  }

  public clearValidationMessages(): void {
    FORM_FIELD_CONFIG.FIELD_IDS.forEach(fieldId => {
      this.updateErrorElement(fieldId, '', true);
      this.updateInputStyle(fieldId, true);
    });
    this.clearOptionsErrors();
  }

  public getFormFieldsSubject(): FormFieldsSubject {
    return this.formFieldsSubject;
  }

  public getCustomOptionSubject(): CustomOptionBundlesSubject {
    return this.customOptionBundlesSubject;
  }

  public getCustomOptionsNonBundleSubject(): CustomOptionsNonBundleSubject {
    return this.customOptionsNonBundleSubject;
  }
}

// Component Registration
class SubmitOrderManager {
  private static readonly COMPONENT_NAME = 'zen-submit-order';

  public static initialize(): void {
    if (!customElements.get(this.COMPONENT_NAME)) {
      customElements.define(this.COMPONENT_NAME, ZenSubmitOrder);
    }
  }

  public static handlePageLoad(): void {
    const elements = document.querySelectorAll(`${this.COMPONENT_NAME}:not(:defined)`);
    elements.forEach(element => {
      if (element instanceof ZenSubmitOrder) {
        element.connectedCallback();
      }
    });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SubmitOrderManager.initialize);
} else {
  SubmitOrderManager.initialize();
}

document.addEventListener('astro:page-load', SubmitOrderManager.handlePageLoad);

export { ZenSubmitOrder };
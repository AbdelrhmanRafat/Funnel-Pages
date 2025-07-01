// ClassicSelectionOptionsWithoutBundles.ts - Production Ready Component

import type { Observer, Subject } from "../../../../../../lib/patterns/Observers/base-observer";
import { 
  CustomOptionsNonBundleSubject, 
  type CustomOptionsNonBundleState,
  type YourOptionData 
} from "../../../../../../lib/patterns/Observers/custom-options-non-bundle";

interface SelectedOptions {
  first?: string;
  second?: string;
}

const CSS_CLASSES = {
  SELECTED_COLOR: 'classic-selection-options-without-bundles-color-option--selected',
  SELECTED_SIZE: 'classic-selection-options-without-bundles-size-option--selected',
  COLOR_OPTION: 'classic-selection-options-without-bundles-color-option',
  SIZE_OPTION: 'classic-selection-options-without-bundles-size-option',
  OPTION_AVAILABLE: 'classic-selection-options-without-bundles-option-available',
  OPTION_DISABLED: 'classic-selection-options-without-bundles-option-disabled'
} as const;

class ClassicSelectOptions extends HTMLElement implements Observer<CustomOptionsNonBundleState> {
  // Configuration Properties
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: YourOptionData | null = null;
  private skuNoVariant: string = "";
  
  // Base Properties
  private basePrice: number | null = null;
  private basePriceAfterDiscount: number | null = null;
  private baseImage: string | null = null;
  private qtyNonVariant: number = 1;
  
  // State Management
  private selectedOptions: SelectedOptions = {};
  private isUpdatingFromObserver: boolean = false;
  private hasSecondOption: boolean = false;
  
  // Observer Integration
  private customOptionsSubject: CustomOptionsNonBundleSubject;
  
  // DOM Elements - Options
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;
  
  // DOM Elements - Quantity
  private qtyInput: HTMLInputElement | null = null;
  private qtyDecreaseBtn: HTMLElement | null = null;
  private qtyIncreaseBtn: HTMLElement | null = null;
  private maxQtyDisplay: HTMLElement | null = null;
  private maxQtyValue: HTMLElement | null = null;

  constructor() {
    super();
    this.customOptionsSubject = CustomOptionsNonBundleSubject.getInstance();
  }

  // Lifecycle Methods
  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
    this.attachToObservers();
    this.initializeState();
    this.initializeSecondOptionsState();
  }

  disconnectedCallback() {
    this.detachFromObservers();
    this.removeEventListeners();
  }

  // Initialization Methods
  private initializeSettings(): void {
    try {
      this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
      this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
      this.skuNoVariant = this.getAttribute('data-sku-no-variant') || '';
      
      this.basePrice = parseFloat(this.getAttribute('data-base-price') || '0') || null;
      this.basePriceAfterDiscount = parseFloat(this.getAttribute('data-base-price-discount') || '0') || null;
      this.baseImage = this.getAttribute('data-base-image') || null;
      this.qtyNonVariant = parseInt(this.getAttribute('data-qty-non-variant') || '1') || 1;
      
      const optionDataAttr = this.getAttribute('data-option-data');
      if (optionDataAttr && this.isVariant) {
        this.optionData = JSON.parse(optionDataAttr);
        
        if (this.optionData) {
          
          this.hasSecondOption = !!(this.optionData.secondOption && this.optionData.secondOption.values && this.optionData.secondOption.values.length > 0);
        }
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to initialize settings:', error);
    }
  }

  private initializeElements(): void {
    this.firstOptionElements = this.querySelectorAll('[data-option-type="first"]');
    this.secondOptionElements = this.querySelectorAll('[data-option-type="second"]');
    this.firstOptionDisplay = this.querySelector('[data-selected-first-option]');
    this.secondOptionDisplay = this.querySelector('[data-selected-second-option]');
    
    this.qtyInput = this.querySelector('[data-qty-input]');
    this.qtyDecreaseBtn = this.querySelector('[data-qty-action="decrease"]');
    this.qtyIncreaseBtn = this.querySelector('[data-qty-action="increase"]');
    this.maxQtyDisplay = this.querySelector('[data-max-qty-display]');
    this.maxQtyValue = this.querySelector('[data-max-qty-value]');
  }

  private setupEventListeners(): void {
    this.firstOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    if (this.hasSecondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        element.addEventListener('click', () => this.handleSecondOptionClick(element));
      });
    }
    
    this.qtyDecreaseBtn?.addEventListener('click', () => this.handleQuantityDecrease());
    this.qtyIncreaseBtn?.addEventListener('click', () => this.handleQuantityIncrease());
    
    if (this.qtyInput) {
      this.qtyInput.addEventListener('input', () => this.handleQuantityInput());
      this.qtyInput.addEventListener('blur', () => this.validateQuantityInput());
    }
  }

  private removeEventListeners(): void {
    this.firstOptionElements?.forEach(element => {
      element.removeEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    this.secondOptionElements?.forEach(element => {
      element.removeEventListener('click', () => this.handleSecondOptionClick(element));
    });
    
    this.qtyDecreaseBtn?.removeEventListener('click', () => this.handleQuantityDecrease());
    this.qtyIncreaseBtn?.removeEventListener('click', () => this.handleQuantityIncrease());
    
    if (this.qtyInput) {
      this.qtyInput.removeEventListener('input', () => this.handleQuantityInput());
      this.qtyInput.removeEventListener('blur', () => this.validateQuantityInput());
    }
  }

  private attachToObservers(): void {
    this.customOptionsSubject.attach(this);
  }

  private detachFromObservers(): void {
    this.customOptionsSubject.detach(this);
  }

  private initializeState(): void {
    this.customOptionsSubject.initialize(
      this.optionData,
      this.isVariant,
      this.qtyNonVariant,
      this.skuNoVariant,
    );
  }

  private initializeSecondOptionsState(): void {
    if (this.hasSecondOption && this.secondOptionElements) {
      if (this.isVariant && this.optionData?.firstOption) {
        this.secondOptionElements.forEach(element => {
          this.toggleElementAvailability(element, false);
        });
      }
    }
  }

  // Observer Implementation
  public update(subject: Subject<CustomOptionsNonBundleState>): void {
    try {
      const state = subject.getState();
      this.isUpdatingFromObserver = true;
      this.syncUIWithObserverState(state);
      this.isUpdatingFromObserver = false;
    } catch (error) {
      console.error('ClassicSelectOptions: Observer update failed:', error);
    }
  }

  private syncUIWithObserverState(state: CustomOptionsNonBundleState): void {
    const { option, maxQuantity, isSelectionComplete } = state;
    
    this.selectedOptions = {
      first: option.firstOption || undefined,
      second: option.secondOption || undefined
    };
    
    this.updateSelectionDisplays(option);
    this.updateVisualSelections(option);
    this.updateAvailableOptions(state);
    this.updateQuantityControls(option.qty || 1, maxQuantity);
    this.updateMaxQuantityDisplay(maxQuantity, isSelectionComplete);
  }

  // Event Handlers
  private handleFirstOptionClick(element: HTMLElement): void {
    if (this.isUpdatingFromObserver) return;

    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains(CSS_CLASSES.OPTION_DISABLED)) return;

    try {
      this.clearFirstOptionSelections();
      this.applySelectionStyle(element);
      this.selectedOptions.first = value;
      this.updateOptionDisplay(this.firstOptionDisplay, value);
      
      if (this.hasSecondOption) {
        this.clearSecondOptionSelections();
        this.safeFilterSecondOptions(value);
      }
      
      this.customOptionsSubject.updateFirstOption(value);
      
      this.dispatchEvent(new CustomEvent('first-option-selected', {
        detail: { 
          panelIndex: this.panelIndex,
          value,
          selectedOptions: { ...this.selectedOptions },
          observerState: this.customOptionsSubject.getState()
        },
        bubbles: true
      }));
    } catch (error) {
      console.error('ClassicSelectOptions: First option selection failed:', error);
    }
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    if (this.isUpdatingFromObserver || !this.hasSecondOption) return;

    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains(CSS_CLASSES.OPTION_DISABLED)) return;

    try {
      this.clearSecondOptionSelections();
      this.applySelectionStyle(element);
      this.selectedOptions.second = value;
      this.updateOptionDisplay(this.secondOptionDisplay, value);
      
      this.customOptionsSubject.updateSecondOption(value);
      
      this.dispatchEvent(new CustomEvent('second-option-selected', {
        detail: { 
          panelIndex: this.panelIndex,
          value,
          selectedOptions: { ...this.selectedOptions },
          observerState: this.customOptionsSubject.getState()
        },
        bubbles: true
      }));
    } catch (error) {
      console.error('ClassicSelectOptions: Second option selection failed:', error);
    }
  }

  private handleQuantityDecrease(): void {
    try {
      const currentState = this.customOptionsSubject.getState();
      const currentQty = currentState.option.qty || 1;
      
      if (currentQty > 1) {
        this.customOptionsSubject.updateQuantity(currentQty - 1);
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Quantity decrease failed:', error);
    }
  }

  private handleQuantityIncrease(): void {
    try {
      const currentState = this.customOptionsSubject.getState();
      const currentQty = currentState.option.qty || 1;
      const maxQty = currentState.maxQuantity;
      
      if (currentQty < maxQty) {
        this.customOptionsSubject.updateQuantity(currentQty + 1);
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Quantity increase failed:', error);
    }
  }

  private handleQuantityInput(): void {
    if (!this.qtyInput) return;
    
    try {
      const value = parseInt(this.qtyInput.value) || 1;
      this.customOptionsSubject.updateQuantity(value);
    } catch (error) {
      console.error('ClassicSelectOptions: Quantity input failed:', error);
    }
  }

  private validateQuantityInput(): void {
    if (!this.qtyInput) return;
    
    try {
      const currentState = this.customOptionsSubject.getState();
      const currentQty = currentState.option.qty || 1;
      
      this.qtyInput.value = currentQty.toString();
    } catch (error) {
      console.error('ClassicSelectOptions: Quantity validation failed:', error);
    }
  }

  // UI State Management
  private clearFirstOptionSelections(): void {
    this.firstOptionElements?.forEach(el => {
      el.classList.remove(
        CSS_CLASSES.SELECTED_COLOR, 
        CSS_CLASSES.SELECTED_SIZE, 
      );
    });
  }

  private clearSecondOptionSelections(): void {
    if (this.hasSecondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(el => {
        el.classList.remove(
          CSS_CLASSES.SELECTED_COLOR, 
          CSS_CLASSES.SELECTED_SIZE, 
        );
      });
    }
    
    this.selectedOptions.second = undefined;
    this.updateOptionDisplay(this.secondOptionDisplay, '');
  }

  private applySelectionStyle(element: HTMLElement): void {
    try {
      element.classList.remove(CSS_CLASSES.SELECTED_COLOR, CSS_CLASSES.SELECTED_SIZE);
      if (element.classList.contains(CSS_CLASSES.COLOR_OPTION)) {
        element.classList.add(CSS_CLASSES.SELECTED_COLOR);
      } else if (element.classList.contains(CSS_CLASSES.SIZE_OPTION)) {
        element.classList.add(CSS_CLASSES.SELECTED_SIZE);
      }
      
      element.offsetHeight;
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to apply selection style:', error);
    }
  }

  private updateOptionDisplay(displayElement: HTMLElement | null, value: string): void {
    if (displayElement) {
      displayElement.textContent = value;
    }
  }

  private safeFilterSecondOptions(firstValue: string): void {
    if (!this.hasSecondOption || !this.optionData?.associations || !this.secondOptionElements) {
      return;
    }

    try {
      const availableSecondOptions = this.optionData.associations[firstValue] || [];
      const availableValues = new Set(availableSecondOptions.map(opt => opt.value));

      this.secondOptionElements.forEach(element => {
        const value = element.getAttribute('data-option-value');
        const isAvailable = availableValues.has(value || '');
        this.toggleElementAvailability(element, isAvailable);
      });
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to filter second options:', error);
    }
  }

  private toggleElementAvailability(element: HTMLElement, isAvailable: boolean): void {
    try {
      if (isAvailable) {
        element.classList.remove(CSS_CLASSES.OPTION_DISABLED);
        element.classList.add(CSS_CLASSES.OPTION_AVAILABLE);
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
      } else {
        element.classList.add(CSS_CLASSES.OPTION_DISABLED);
        element.classList.remove(CSS_CLASSES.OPTION_AVAILABLE);
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.3';
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to toggle element availability:', error);
    }
  }

  // UI Update Methods
  private updateSelectionDisplays(option: any): void {
    this.updateOptionDisplay(this.firstOptionDisplay, option.firstOption || '');
    
    if (this.hasSecondOption) {
      this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption || '');
    }
  }

  private updateVisualSelections(option: any): void {
    try {
      this.clearAllSelections();

      if (option.firstOption && this.firstOptionElements) {
        const firstElement = this.findElementByValue(this.firstOptionElements, option.firstOption);
        if (firstElement) {
          this.applySelectionStyle(firstElement);
          
          if (this.hasSecondOption) {
            this.safeFilterSecondOptions(option.firstOption);
          }
        }
      }

      if (this.hasSecondOption && option.secondOption && this.secondOptionElements) {
        const secondElement = this.findElementByValue(this.secondOptionElements, option.secondOption);
        if (secondElement && !secondElement.classList.contains(CSS_CLASSES.OPTION_DISABLED)) {
          this.applySelectionStyle(secondElement);
          this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption);
        }
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to update visual selections:', error);
    }
  }

  private updateAvailableOptions(state: CustomOptionsNonBundleState): void {
    const { availableSecondOptions } = state;
    
    if (!this.hasSecondOption || !this.secondOptionElements) return;

    try {
      this.secondOptionElements.forEach(element => {
        const value = element.getAttribute('data-option-value');
        const isAvailable = availableSecondOptions.some(opt => opt.value === value && !opt.disabled);
        
        this.toggleElementAvailability(element, isAvailable);
      });
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to update available options:', error);
    }
  }

  private updateQuantityControls(currentQty: number, maxQty: number): void {
    try {
      if (this.qtyInput) {
        this.qtyInput.value = currentQty.toString();
        this.qtyInput.setAttribute('max', maxQty.toString());
      }
      
      if (this.qtyDecreaseBtn) {
        const isDisabled = currentQty <= 1;
        this.qtyDecreaseBtn.style.opacity = isDisabled ? '0.5' : '1';
        this.qtyDecreaseBtn.style.pointerEvents = isDisabled ? 'none' : 'auto';
      }
      
      if (this.qtyIncreaseBtn) {
        const isDisabled = currentQty >= maxQty;
        this.qtyIncreaseBtn.style.opacity = isDisabled ? '0.5' : '1';
        this.qtyIncreaseBtn.style.pointerEvents = isDisabled ? 'none' : 'auto';
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to update quantity controls:', error);
    }
  }

  private updateMaxQuantityDisplay(maxQty: number, isSelectionComplete: boolean): void {
    try {
      if (this.isVariant && this.maxQtyDisplay && this.maxQtyValue) {
        if (isSelectionComplete) {
          this.maxQtyDisplay.style.display = 'block';
          this.maxQtyValue.textContent = maxQty.toString();
        } else {
          this.maxQtyDisplay.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to update max quantity display:', error);
    }
  }

  // Utility Methods
  private findElementByValue(elements: NodeListOf<HTMLElement>, value: string): HTMLElement | undefined {
    return Array.from(elements).find(element => 
      element.getAttribute('data-option-value') === value
    );
  }

  private clearAllSelections(): void {
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();
  }

  // Public API Methods
  public getSelectedOptions(): { first: string | null; second: string | null } {
    try {
      const option = this.customOptionsSubject.getOption();
      return {
        first: option.firstOption,
        second: option.secondOption
      };
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to get selected options:', error);
      return { first: null, second: null };
    }
  }

  public isSelectionComplete(): boolean {
    try {
      return this.customOptionsSubject.isSelectionComplete();
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to check selection completion:', error);
      return false;
    }
  }

  public clearSelections(): void {
    try {
      this.clearAllSelections();
      this.selectedOptions = {};
      
      this.updateOptionDisplay(this.firstOptionDisplay, '');
      if (this.hasSecondOption) {
        this.updateOptionDisplay(this.secondOptionDisplay, '');
      }
      
      this.resetSecondOptionsState();
      this.customOptionsSubject.clearOptions();
      
      this.dispatchEvent(new CustomEvent('selections-cleared', {
        detail: { panelIndex: this.panelIndex },
        bubbles: true
      }));
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to clear selections:', error);
    }
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  public getCurrentObserverState(): CustomOptionsNonBundleState {
    return this.customOptionsSubject.getState();
  }

  public hasSecondOptions(): boolean {
    return this.hasSecondOption;
  }

  // Private Helper Methods
  private resetSecondOptionsState(): void {
    if (!this.hasSecondOption || !this.secondOptionElements) return;
    
    try {
      if (this.isVariant && this.optionData?.firstOption) {
        this.secondOptionElements.forEach(element => {
          this.toggleElementAvailability(element, false);
        });
      } else {
        this.secondOptionElements.forEach(element => {
          this.toggleElementAvailability(element, true);
        });
      }
    } catch (error) {
      console.error('ClassicSelectOptions: Failed to reset second options state:', error);
    }
  }
}

// Component Registration
class ClassicSelectOptionsManager {
  private static readonly COMPONENT_NAME = 'classic-select-options';

  public static initialize(): void {
    this.registerComponent();
    this.setupEventListeners();
  }

  private static registerComponent(): void {
    if (!customElements.get(this.COMPONENT_NAME)) {
      customElements.define(this.COMPONENT_NAME, ClassicSelectOptions);
    }
  }

  private static setupEventListeners(): void {
    document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
    document.addEventListener('astro:page-load', this.handleAstroPageLoad.bind(this));
  }

  private static handleDOMContentLoaded(): void {
    // Component registration is handled in registerComponent
  }

  private static handleAstroPageLoad(): void {
    const undefinedComponents = document.querySelectorAll(`${this.COMPONENT_NAME}:not(:defined)`);
    undefinedComponents.forEach(component => {
      if (component instanceof ClassicSelectOptions) {
        component.connectedCallback();
      }
    });
  }
}

ClassicSelectOptionsManager.initialize();

export { ClassicSelectOptions };
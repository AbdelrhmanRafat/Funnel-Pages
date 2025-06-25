// ClassicSelectionOptionsWithoutBundles.ts - Enhanced with Selection Logic

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

class ClassicSelectOptions extends HTMLElement implements Observer<CustomOptionsNonBundleState> {
  // === Configuration Properties ===
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: YourOptionData | null = null;
  private skuNoVariant: string = "";
  
  // === Base Properties ===
  private basePrice: number | null = null;
  private basePriceAfterDiscount: number | null = null;
  private baseImage: string | null = null;
  private qtyNonVariant: number = 1;
  
  // === State Management ===
  private selectedOptions: SelectedOptions = {};
  
  // === Observer Integration ===
  private customOptionsSubject: CustomOptionsNonBundleSubject;
  
  // === DOM Elements - Options ===
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;
  
  // === DOM Elements - Quantity ===
  private qtyInput: HTMLInputElement | null = null;
  private qtyDecreaseBtn: HTMLElement | null = null;
  private qtyIncreaseBtn: HTMLElement | null = null;
  private maxQtyDisplay: HTMLElement | null = null;
  private maxQtyValue: HTMLElement | null = null;

  constructor() {
    super();
    this.customOptionsSubject = CustomOptionsNonBundleSubject.getInstance();
  }

  // === Lifecycle Methods ===
  
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
  }

  // === Initialization Methods ===
  
  private initializeSettings(): void {
    this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
    this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
    this.skuNoVariant = this.getAttribute('data-sku-no-variant') || '';
    
    this.basePrice = parseFloat(this.getAttribute('data-base-price') || '0') || null;
    this.basePriceAfterDiscount = parseFloat(this.getAttribute('data-base-price-discount') || '0') || null;
    this.baseImage = this.getAttribute('data-base-image') || null;
    this.qtyNonVariant = parseInt(this.getAttribute('data-qty-non-variant') || '1') || 1;
    
    const optionDataAttr = this.getAttribute('data-option-data');
    if (optionDataAttr && this.isVariant) {
      try {
        this.optionData = JSON.parse(optionDataAttr);
        
        if (this.optionData) {
          this.optionData.basePrice = this.basePrice;
          this.optionData.basePriceAfterDiscount = this.basePriceAfterDiscount;
          this.optionData.baseImage = this.baseImage;
        }
      } catch (e) {
        console.error('Failed to parse option data:', e);
      }
    }
  }

  private initializeElements(): void {
    // Option elements
    this.firstOptionElements = this.querySelectorAll('[data-option-type="first"]');
    this.secondOptionElements = this.querySelectorAll('[data-option-type="second"]');
    this.firstOptionDisplay = this.querySelector('[data-selected-first-option]');
    this.secondOptionDisplay = this.querySelector('[data-selected-second-option]');
    
    // Quantity elements
    this.qtyInput = this.querySelector('[data-qty-input]');
    this.qtyDecreaseBtn = this.querySelector('[data-qty-action="decrease"]');
    this.qtyIncreaseBtn = this.querySelector('[data-qty-action="increase"]');
    this.maxQtyDisplay = this.querySelector('[data-max-qty-display]');
    this.maxQtyValue = this.querySelector('[data-max-qty-value]');
  }

  private setupEventListeners(): void {
    // Option listeners
    this.firstOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    this.secondOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleSecondOptionClick(element));
    });
    
    // Quantity listeners
    this.qtyDecreaseBtn?.addEventListener('click', () => this.handleQuantityDecrease());
    this.qtyIncreaseBtn?.addEventListener('click', () => this.handleQuantityIncrease());
    
    if (this.qtyInput) {
      this.qtyInput.addEventListener('input', () => this.handleQuantityInput());
      this.qtyInput.addEventListener('blur', () => this.validateQuantityInput());
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
      this.basePrice,
      this.basePriceAfterDiscount
    );
  }

  private initializeSecondOptionsState(): void {
    // Initially disable all second options if we have variant products with both options
    if (this.isVariant && this.optionData?.firstOption && this.optionData?.secondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        this.toggleElementAvailability(element, false);
      });
    }
  }

  // === Observer Implementation ===
  
  public update(subject: Subject<CustomOptionsNonBundleState>): void {
    const state = subject.getState();
    this.syncUIWithObserverState(state);
  }

  private syncUIWithObserverState(state: CustomOptionsNonBundleState): void {
    const { option, maxQuantity, isSelectionComplete } = state;
    
    // Update local state
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

  // === Event Handlers ===
  
  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    this.clearFirstOptionSelections();
    this.applySelectionStyle(element);
    this.selectedOptions.first = value;
    this.updateOptionDisplay(this.firstOptionDisplay, value);
    
    // Reset second option when first option changes
    this.clearSecondOptionSelections();
    this.customOptionsSubject.updateFirstOption(value);
    this.filterSecondOptions(value);
    
    this.dispatchEvent(new CustomEvent('first-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions },
        observerState: this.customOptionsSubject.getState()
      }
    }));
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains('classic-option-disabled')) return;

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
      }
    }));
  }

  private handleQuantityDecrease(): void {
    const currentState = this.customOptionsSubject.getState();
    const currentQty = currentState.option.qty || 1;
    
    if (currentQty > 1) {
      this.customOptionsSubject.updateQuantity(currentQty - 1);
    }
  }

  private handleQuantityIncrease(): void {
    const currentState = this.customOptionsSubject.getState();
    const currentQty = currentState.option.qty || 1;
    const maxQty = currentState.maxQuantity;
    
    if (currentQty < maxQty) {
      this.customOptionsSubject.updateQuantity(currentQty + 1);
    }
  }

  private handleQuantityInput(): void {
    if (!this.qtyInput) return;
    
    const value = parseInt(this.qtyInput.value) || 1;
    this.customOptionsSubject.updateQuantity(value);
  }

  private validateQuantityInput(): void {
    if (!this.qtyInput) return;
    
    const currentState = this.customOptionsSubject.getState();
    const currentQty = currentState.option.qty || 1;
    
    this.qtyInput.value = currentQty.toString();
  }

  // === UI State Management ===
  
  private clearFirstOptionSelections(): void {
    this.firstOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option', 'classic-selected');
    });
  }

  private clearSecondOptionSelections(): void {
    this.secondOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option', 'classic-selected');
    });
    
    this.selectedOptions.second = undefined;
    this.updateOptionDisplay(this.secondOptionDisplay, '');
  }

  private applySelectionStyle(element: HTMLElement): void {
    if (element.classList.contains('classic-color-option')) {
      element.classList.add('classic-selected-color-option');
    } else {
      element.classList.add('classic-selected-size-option');
    }
    
    // Also add the generic selected class for this component
    element.classList.add('classic-selected');
  }

  private updateOptionDisplay(displayElement: HTMLElement | null, value: string): void {
    if (displayElement) {
      displayElement.textContent = value;
    }
  }

  private filterSecondOptions(firstValue: string): void {
    if (!this.optionData?.associations || !this.secondOptionElements) return;

    const availableSecondOptions = this.optionData.associations[firstValue] || [];
    const availableValues = availableSecondOptions.map(opt => opt.value);

    this.secondOptionElements.forEach(element => {
      const value = element.getAttribute('data-option-value');
      const isAvailable = availableValues.includes(value || '');
      this.toggleElementAvailability(element, isAvailable);
    });
  }

  private toggleElementAvailability(element: HTMLElement, isAvailable: boolean): void {
    if (isAvailable) {
      element.classList.remove('classic-option-disabled');
      element.classList.add('classic-option-available');
      element.style.pointerEvents = 'auto';
      element.style.opacity = '1';
    } else {
      element.classList.add('classic-option-disabled');
      element.classList.remove('classic-option-available');
      element.style.pointerEvents = 'none';
      element.style.opacity = '0.3';
    }
  }

  // === UI Update Methods ===
  
  private updateSelectionDisplays(option: any): void {
    this.updateOptionDisplay(this.firstOptionDisplay, option.firstOption || '');
    this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption || '');
  }

  private updateVisualSelections(option: any): void {
    this.clearAllSelections();

    if (option.firstOption && this.firstOptionElements) {
      const firstElement = this.findElementByValue(this.firstOptionElements, option.firstOption);
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        this.filterSecondOptions(option.firstOption);
      }
    }

    if (option.secondOption && this.secondOptionElements) {
      const secondElement = this.findElementByValue(this.secondOptionElements, option.secondOption);
      if (secondElement) {
        this.applySelectionStyle(secondElement);
        this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption);
      }
    }
  }

  private updateAvailableOptions(state: CustomOptionsNonBundleState): void {
    const { availableSecondOptions } = state;
    
    if (!this.secondOptionElements) return;

    this.secondOptionElements.forEach(element => {
      const value = element.getAttribute('data-option-value');
      const isAvailable = availableSecondOptions.some(opt => opt.value === value && !opt.disabled);
      
      this.toggleElementAvailability(element, isAvailable);
    });
  }

  private updateQuantityControls(currentQty: number, maxQty: number): void {
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
  }

  private updateMaxQuantityDisplay(maxQty: number, isSelectionComplete: boolean): void {
    if (this.isVariant && this.maxQtyDisplay && this.maxQtyValue) {
      if (isSelectionComplete) {
        this.maxQtyDisplay.style.display = 'block';
        this.maxQtyValue.textContent = maxQty.toString();
      } else {
        this.maxQtyDisplay.style.display = 'none';
      }
    }
  }

  // === Utility Methods ===
  
  private findElementByValue(elements: NodeListOf<HTMLElement>, value: string): HTMLElement | undefined {
    return Array.from(elements).find(element => 
      element.getAttribute('data-option-value') === value
    );
  }

  private clearAllSelections(): void {
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();
  }

  // === Public API Methods ===
  
  public getSelectedOptions(): { first: string | null; second: string | null } {
    const option = this.customOptionsSubject.getOption();
    return {
      first: option.firstOption,
      second: option.secondOption
    };
  }

  public isSelectionComplete(): boolean {
    return this.customOptionsSubject.isSelectionComplete();
  }

  public clearSelections(): void {
    this.clearAllSelections();
    this.selectedOptions = {};
    
    this.updateOptionDisplay(this.firstOptionDisplay, '');
    this.updateOptionDisplay(this.secondOptionDisplay, '');
    
    this.resetSecondOptionsState();
    this.customOptionsSubject.clearOptions();
    
    this.dispatchEvent(new CustomEvent('selections-cleared', {
      detail: { panelIndex: this.panelIndex }
    }));
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  public getCurrentObserverState(): CustomOptionsNonBundleState {
    return this.customOptionsSubject.getState();
  }

  public getCompleteState(): any {
    const observerState = this.getCurrentObserverState();
    return {
      panelIndex: this.panelIndex,
      selectedOptions: this.getSelectedOptions(),
      isComplete: this.isSelectionComplete(),
      currentQuantity: observerState.option.qty || 1,
      maxQuantity: observerState.maxQuantity,
      observerState
    };
  }

  public getOptionDataForChildren(): {
    firstOptions: Array<{ value: string; hex?: string; disabled: boolean }>;
    secondOptions: Array<{ value: string; hex?: string; disabled: boolean }>;
  } {
    return this.customOptionsSubject.getOptionValuesForUI();
  }

  public isOptionAvailable(optionType: 'first' | 'second', value: string): boolean {
    const availableOptions = this.customOptionsSubject.getAvailableOptions();
    
    if (optionType === 'first') {
      return availableOptions.firstOptions.some(opt => opt.value === value && !opt.disabled);
    } else {
      return availableOptions.secondOptions.some(opt => opt.value === value && !opt.disabled);
    }
  }

  public getCurrentPriceInfo(): {
    price: number | null;
    priceAfterDiscount: number | null;
    hasDiscount: boolean;
  } {
    const option = this.customOptionsSubject.getOption();
    return {
      price: option.price,
      priceAfterDiscount: option.price_after_discount,
      hasDiscount: !!(option.price && option.price_after_discount && option.price > option.price_after_discount)
    };
  }

  public getCurrentProductInfo(): {
    skuId: number | null;
    image: string | null;
    hex: string | null;
    maxQuantity: number;
  } {
    const state = this.customOptionsSubject.getState();
    const option = state.option;
    
    return {
      skuId: option.sku_id,
      image: option.image,
      hex: option.hex,
      maxQuantity: state.maxQuantity
    };
  }

  // === Private Helper Methods ===
  
  private resetSecondOptionsState(): void {
    if (this.isVariant && this.optionData?.firstOption && this.optionData?.secondOption) {
      this.secondOptionElements?.forEach(element => {
        this.toggleElementAvailability(element, false);
      });
    } else {
      this.secondOptionElements?.forEach(element => {
        this.toggleElementAvailability(element, true);
      });
    }
  }
}

// === Component Registration ===

document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-select-options')) {
    customElements.define('classic-select-options', ClassicSelectOptions);
  }
});

document.addEventListener('astro:page-load', () => {
  const selectOptions = document.querySelectorAll('classic-select-options:not(:defined)');
  selectOptions.forEach(option => {
    if (option instanceof ClassicSelectOptions) {
      option.connectedCallback();
    }
  });
});

export { ClassicSelectOptions };
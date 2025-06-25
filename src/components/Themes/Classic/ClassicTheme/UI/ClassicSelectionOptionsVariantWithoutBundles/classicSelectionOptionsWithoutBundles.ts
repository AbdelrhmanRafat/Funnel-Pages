// ClassicSelectionOptionsWithoutBundles.ts - Complete Fixed Version

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
  private isUpdatingFromObserver: boolean = false;
  private hasSecondOption: boolean = false;
  
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
    console.log('🔵 ClassicSelectOptions connecting...');
    
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
    this.attachToObservers();
    this.initializeState();
    this.initializeSecondOptionsState();
    
    // Debug: Check for auto-selection after initialization
    setTimeout(() => {
      const state = this.customOptionsSubject.getState();
      if (state.option.firstOption) {
        console.log('🚨 AUTO-SELECTION DETECTED AFTER INIT:', state.option.firstOption);
      }
    }, 0);
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
          
          // Determine if we have a second option
          this.hasSecondOption = !!(this.optionData.secondOption && this.optionData.secondOption.values && this.optionData.secondOption.values.length > 0);
          
          console.log('🔧 Option structure detected:', {
            hasFirstOption: !!this.optionData.firstOption,
            hasSecondOption: this.hasSecondOption,
            firstOptionValues: this.optionData.firstOption?.values?.length || 0,
            secondOptionValues: this.optionData.secondOption?.values?.length || 0
          });
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
    
    console.log('🔧 DOM elements found:', {
      firstOptionElements: this.firstOptionElements?.length || 0,
      secondOptionElements: this.secondOptionElements?.length || 0,
      hasFirstDisplay: !!this.firstOptionDisplay,
      hasSecondDisplay: !!this.secondOptionDisplay
    });
  }

  private setupEventListeners(): void {
    // First option listeners
    this.firstOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    // Second option listeners (only if second options exist)
    if (this.hasSecondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        element.addEventListener('click', () => this.handleSecondOptionClick(element));
      });
    }
    
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
    console.log('🔵 Initializing observer state...');
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
    // Only process second options if they exist
    if (this.hasSecondOption && this.secondOptionElements) {
      console.log('🔧 Initializing second options state...');
      
      // Initially disable all second options if we have variant products with both options
      if (this.isVariant && this.optionData?.firstOption) {
        this.secondOptionElements.forEach(element => {
          this.toggleElementAvailability(element, false);
        });
      }
    } else {
      console.log('🔧 No second options to initialize');
    }
  }

  // === Observer Implementation ===
  
  public update(subject: Subject<CustomOptionsNonBundleState>): void {
    const state = subject.getState();
    console.log("📡 Observer state received:", state);
    
    // Prevent recursive calls during observer updates
    this.isUpdatingFromObserver = true;
    this.syncUIWithObserverState(state);
    this.isUpdatingFromObserver = false;
  }

  private syncUIWithObserverState(state: CustomOptionsNonBundleState): void {
    const { option, maxQuantity, isSelectionComplete } = state;
    
    console.log('🔄 Syncing UI with observer state:', {
      firstOption: option.firstOption,
      secondOption: option.secondOption,
      hasSecondOption: this.hasSecondOption,
      isComplete: isSelectionComplete
    });
    
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
    // Prevent calls during observer updates
    if (this.isUpdatingFromObserver) {
      console.log('🛑 Prevented auto-selection during observer update');
      return;
    }

    console.log('👆 User clicked first option');
    
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    this.clearFirstOptionSelections();
    this.applySelectionStyle(element);
    this.selectedOptions.first = value;
    this.updateOptionDisplay(this.firstOptionDisplay, value);
    
    // Reset second option when first option changes (only if second options exist)
    if (this.hasSecondOption) {
      this.clearSecondOptionSelections();
      this.safeFilterSecondOptions(value);
    }
    
    // Update observer
    this.customOptionsSubject.updateFirstOption(value);
    
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
    // Prevent calls during observer updates
    if (this.isUpdatingFromObserver) {
      console.log('🛑 Prevented auto-selection during observer update');
      return;
    }

    // Only allow if we actually have second options
    if (!this.hasSecondOption) {
      console.log('🛑 Second option click ignored - no second options configured');
      return;
    }

    console.log('👆 User clicked second option');

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
    // Only clear if second options exist
    if (this.hasSecondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(el => {
        el.classList.remove('classic-selected-color-option', 'classic-selected-size-option', 'classic-selected');
      });
    }
    
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

  // Safe filtering for UI updates (doesn't trigger observer)
  private safeFilterSecondOptions(firstValue: string): void {
    if (!this.hasSecondOption || !this.optionData?.associations || !this.secondOptionElements) {
      return;
    }

    console.log('🔄 Safe filtering second options for:', firstValue);

    const availableSecondOptions = this.optionData.associations[firstValue] || [];
    const availableValues = availableSecondOptions.map(opt => opt.value);

    this.secondOptionElements.forEach(element => {
      const value = element.getAttribute('data-option-value');
      const isAvailable = availableValues.includes(value || '');
      this.toggleElementAvailability(element, isAvailable);
    });
  }

  // User-triggered filtering (for backward compatibility)
  private filterSecondOptions(firstValue: string): void {
    console.log('🔄 User-triggered filtering for:', firstValue);
    this.safeFilterSecondOptions(firstValue);
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
    
    // Only update second option display if second options exist
    if (this.hasSecondOption) {
      this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption || '');
    }
  }

  private updateVisualSelections(option: any): void {
    console.log('🎨 Updating visual selections for:', {
      firstOption: option.firstOption,
      secondOption: option.secondOption,
      hasSecondOption: this.hasSecondOption
    });
    
    this.clearAllSelections();

    // Handle first option selection
    if (option.firstOption && this.firstOptionElements) {
      const firstElement = this.findElementByValue(this.firstOptionElements, option.firstOption);
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        
        // Only filter second options if they exist
        if (this.hasSecondOption) {
          this.safeFilterSecondOptions(option.firstOption);
        }
      }
    }

    // Handle second option selection (only if second options exist)
    if (this.hasSecondOption && option.secondOption && this.secondOptionElements) {
      const secondElement = this.findElementByValue(this.secondOptionElements, option.secondOption);
      if (secondElement) {
        this.applySelectionStyle(secondElement);
        this.updateOptionDisplay(this.secondOptionDisplay, option.secondOption);
      }
    }
  }

  private updateAvailableOptions(state: CustomOptionsNonBundleState): void {
    const { availableSecondOptions } = state;
    
    // Only update second options if they exist
    if (!this.hasSecondOption || !this.secondOptionElements) return;

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
    if (this.hasSecondOption) {
      this.updateOptionDisplay(this.secondOptionDisplay, '');
    }
    
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
      hasSecondOption: this.hasSecondOption,
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
    // Return false immediately if checking second option but no second options exist
    if (optionType === 'second' && !this.hasSecondOption) {
      return false;
    }
    
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

  // New method to check if second options are available
  public hasSecondOptions(): boolean {
    return this.hasSecondOption;
  }

  // === Private Helper Methods ===
  
  private resetSecondOptionsState(): void {
    // Only reset if second options exist
    if (!this.hasSecondOption || !this.secondOptionElements) return;
    
    if (this.isVariant && this.optionData?.firstOption) {
      this.secondOptionElements.forEach(element => {
        this.toggleElementAvailability(element, false);
      });
    } else {
      this.secondOptionElements.forEach(element => {
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
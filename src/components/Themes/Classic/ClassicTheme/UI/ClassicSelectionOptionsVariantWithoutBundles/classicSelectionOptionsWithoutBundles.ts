// ClassicDynamicPanelContainer.ts - Simplified and Organized
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
  // Configuration properties
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: YourOptionData | null = null;
  private skuNoVariant: string = "";
  
  // Base properties
  private basePrice: number | null = null;
  private basePriceAfterDiscount: number | null = null;
  private baseImage: string | null = null;
  private qtyNonVariant: number = 1;
  
  // Observer integration
  private customOptionsSubject: CustomOptionsNonBundleSubject;
  
  // DOM elements - Options
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;
  
  // DOM elements - Quantity
  private qtyInput: HTMLInputElement | null = null;
  private qtyDecreaseBtn: HTMLElement | null = null;
  private qtyIncreaseBtn: HTMLElement | null = null;
  private maxQtyDisplay: HTMLElement | null = null;
  private maxQtyValue: HTMLElement | null = null;

  constructor() {
    super();
    this.customOptionsSubject = CustomOptionsNonBundleSubject.getInstance();
  }

  // Lifecycle methods
  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
    this.attachToObservers();
    this.initializeState();
  }

  disconnectedCallback() {
    this.detachFromObservers();
  }

  // Initialization methods
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

  // Observer implementation
  public update(subject: Subject<CustomOptionsNonBundleState>): void {
    const state = subject.getState();
    this.syncUIWithObserverState(state);
  }

  private syncUIWithObserverState(state: CustomOptionsNonBundleState): void {
    const { option, maxQuantity, isSelectionComplete } = state;
    
    this.updateSelectionDisplays(option);
    this.updateVisualSelections(option);
    this.updateAvailableOptions(state);
    this.updateQuantityControls(option.qty || 1, maxQuantity);
    this.updateMaxQuantityDisplay(maxQuantity, isSelectionComplete);
  }

  // UI Update methods
  private updateSelectionDisplays(option: CustomOptionsNonBundle): void {
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = option.firstOption || 'Not selected';
    }
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = option.secondOption || 'Not selected';
    }
  }

  private updateVisualSelections(option: CustomOptionsNonBundle): void {
    this.clearAllSelections();

    if (option.firstOption && this.firstOptionElements) {
      const firstElement = Array.from(this.firstOptionElements).find(
        element => element.getAttribute('data-option-value') === option.firstOption
      );
      if (firstElement) this.applySelectionStyle(firstElement);
    }

    if (option.secondOption && this.secondOptionElements) {
      const secondElement = Array.from(this.secondOptionElements).find(
        element => element.getAttribute('data-option-value') === option.secondOption
      );
      if (secondElement) this.applySelectionStyle(secondElement);
    }
  }

  private updateAvailableOptions(state: CustomOptionsNonBundleState): void {
    const { availableSecondOptions } = state;
    
    if (!this.secondOptionElements) return;

    this.secondOptionElements.forEach(element => {
      const value = element.getAttribute('data-option-value');
      const isAvailable = availableSecondOptions.some(opt => opt.value === value && !opt.disabled);
      
      if (isAvailable) {
        element.classList.remove('classic-option-disabled');
        element.classList.add('classic-option-available');
        element.style.pointerEvents = 'auto';
      } else {
        element.classList.add('classic-option-disabled');
        element.classList.remove('classic-option-available');
        element.style.pointerEvents = 'none';
      }
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

  // Event handlers
  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    this.customOptionsSubject.updateFirstOption(value);
    
    this.dispatchEvent(new CustomEvent('first-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        observerState: this.customOptionsSubject.getState()
      }
    }));
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains('classic-option-disabled')) return;

    this.customOptionsSubject.updateSecondOption(value);
    
    this.dispatchEvent(new CustomEvent('second-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
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

  // UI Helper methods
  private clearAllSelections(): void {
    this.firstOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
    });
    
    this.secondOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
    });
  }

  private applySelectionStyle(element: HTMLElement): void {
    if (element.classList.contains('classic-color-option')) {
      element.classList.add('classic-selected-color-option');
    } else {
      element.classList.add('classic-selected-size-option');
    }
  }

  // Public API methods
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
}

// Custom element registration
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-select-options')) {
    customElements.define('classic-select-options', ClassicSelectOptions);
  }
});

// Astro page transition support
document.addEventListener('astro:page-load', () => {
  const selectOptions = document.querySelectorAll('classic-select-options:not(:defined)');
  selectOptions.forEach(option => {
    if (option instanceof ClassicSelectOptions) {
      option.connectedCallback();
    }
  });
});

export { ClassicSelectOptions };
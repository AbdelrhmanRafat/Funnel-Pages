// ClassicDynamicPannelContainer.ts - Using New CustomOptionsNonBundle Observer
import type { Observer, Subject } from "../../../../../../lib/patterns/Observers/base-observer";
import { CustomOptionsNonBundleSubject, type CustomOptionsNonBundleState } from "../../../../../../lib/patterns/Observers/custom-options-non-bundle";

interface OptionData {
  firstOption?: {
    key: string;
    title: string;
    values: any[];
    hasColors: boolean;
  };
  secondOption?: {
    key: string;
    title: string;
    values: any[];
    hasColors: boolean;
  };
  associations: { [firstValue: string]: Array<{
    value: string, 
    sku_id: number, 
    hex?: string, 
    image?: string,
    price?: number,
    price_after_discount?: number,
    qty?: number
  }> };
  firstOptionMetadata: { [value: string]: {
    hex?: string,
    price?: number,
    price_after_discount?: number,
    image?: string,
    qty?: number
  } };
  secondOptionMetadata: { [value: string]: {
    hex?: string,
    price?: number,
    price_after_discount?: number,
    image?: string,
    qty?: number
  } };
  basePrice?: number;
  basePriceAfterDiscount?: number;
  baseImage?: string;
}

interface SelectedOptions {
  first?: string;
  second?: string;
}

class ClassicSelectOptions extends HTMLElement implements Observer<CustomOptionsNonBundleState> {
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: OptionData | null = null;
  private skuNoVariant: string = "";
  private selectedOptions: SelectedOptions = {};
  
  // Enhanced base properties
  private basePrice: number | null = null;
  private basePriceAfterDiscount: number | null = null;
  private baseImage: string | null = null;
  private qtyNonVariant: number = 1;
  
  // Quantity management
  private currentQuantity: number = 1;
  private maxQuantity: number = 1;
  
  // 🆕 NEW: Simple observer integration
  private customOptionsSubject: CustomOptionsNonBundleSubject;
  
  // DOM elements
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;
  
  // Quantity DOM elements
  private qtyInput: HTMLInputElement | null = null;
  private qtyDecreaseBtn: HTMLElement | null = null;
  private qtyIncreaseBtn: HTMLElement | null = null;
  private maxQtyDisplay: HTMLElement | null = null;
  private maxQtyValue: HTMLElement | null = null;

  constructor() {
    super();
    this.customOptionsSubject = CustomOptionsNonBundleSubject.getInstance();
  }

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

  private initializeSettings(): void {
    this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
    this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
    this.skuNoVariant = this.getAttribute('data-sku-no-variant') || '';
    
    // Initialize base properties from attributes
    this.basePrice = parseFloat(this.getAttribute('data-base-price') || '0') || null;
    this.basePriceAfterDiscount = parseFloat(this.getAttribute('data-base-price-discount') || '0') || null;
    this.baseImage = this.getAttribute('data-base-image') || null;
    this.qtyNonVariant = parseInt(this.getAttribute('data-qty-non-variant') || '1') || 1;
    
    // Set initial quantity limits based on variant status
    if (this.isVariant) {
      this.maxQuantity = 1; // Will be updated when options are selected
    } else {
      this.maxQuantity = this.qtyNonVariant;
    }
    
    // Parse option data
    const optionDataAttr = this.getAttribute('data-option-data');
    if (optionDataAttr && this.isVariant) {
      try {
        this.optionData = JSON.parse(optionDataAttr);
        console.log('Parsed enhanced option data:', this.optionData);
      } catch (e) {
        console.error('Failed to parse option data:', e);
      }
    }
  }

  private initializeElements(): void {
    this.firstOptionElements = this.querySelectorAll('[data-option-type="first"]');
    this.secondOptionElements = this.querySelectorAll('[data-option-type="second"]');
    this.firstOptionDisplay = this.querySelector('[data-selected-first-option]');
    this.secondOptionDisplay = this.querySelector('[data-selected-second-option]');
    
    // Initialize quantity elements
    this.qtyInput = this.querySelector('[data-qty-input]');
    this.qtyDecreaseBtn = this.querySelector('[data-qty-action="decrease"]');
    this.qtyIncreaseBtn = this.querySelector('[data-qty-action="increase"]');
    this.maxQtyDisplay = this.querySelector('[data-max-qty-display]');
    this.maxQtyValue = this.querySelector('[data-max-qty-value]');
    
    // 🆕 Simple initialization - no panel index complexity
    console.log('🔍 Found elements:', {
      firstOptions: this.firstOptionElements?.length || 0,
      secondOptions: this.secondOptionElements?.length || 0,
      firstDisplay: !!this.firstOptionDisplay,
      secondDisplay: !!this.secondOptionDisplay,
      qtyInput: !!this.qtyInput,
      qtyButtons: !!(this.qtyDecreaseBtn && this.qtyIncreaseBtn)
    });
  }

  private setupEventListeners(): void {
    // First option listeners
    if (this.firstOptionElements) {
      this.firstOptionElements.forEach(element => {
        element.addEventListener('click', () => this.handleFirstOptionClick(element));
      });
    }
    
    // Second option listeners  
    if (this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        element.addEventListener('click', () => this.handleSecondOptionClick(element));
      });
    }
    
    // Quantity control listeners
    if (this.qtyDecreaseBtn) {
      this.qtyDecreaseBtn.addEventListener('click', () => this.handleQuantityDecrease());
    }
    
    if (this.qtyIncreaseBtn) {
      this.qtyIncreaseBtn.addEventListener('click', () => this.handleQuantityIncrease());
    }
    
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
    // 🆕 Initialize the simple observer
    this.customOptionsSubject.initialize();
    
    if (!this.isVariant && this.skuNoVariant) {
      // For non-variant products, set all available properties
      this.customOptionsSubject.updateOption({
        sku_id: parseInt(this.skuNoVariant),
        price: this.basePrice,
        price_after_discount: this.basePriceAfterDiscount,
        image: this.baseImage,
        qty: this.currentQuantity
      });
      console.log('🔧 Initialized non-variant state');
    }
    
    // Initialize quantity display
    this.updateQuantityDisplay();
  }

  // Observer implementation
  public update(subject: Subject<CustomOptionsNonBundleState>): void {
    console.log(subject.getState());
      this.handleCustomOptionUpdate(subject.getState());
    
  }



  private handleCustomOptionUpdate(state: CustomOptionsNonBundleState): void {
    // Sync UI with observer state changes
    const option = this.customOptionsSubject.getOption();
    if (option) {
      this.syncUIWithObserver(option);
    }
  }

  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    console.log('🎯 First option selected:', value);

    // Clear previous first option selection
    this.clearFirstOptionSelections();
    
    // Apply selection
    this.applySelectionStyle(element);
    
    // Update state
    this.selectedOptions.first = value;
    
    // Update display
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = value;
      console.log('✅ Updated first option display:', value);
    }
    
    // Clear second options first
    this.clearSecondOptionSelections();
    
    // Build comprehensive update object for first option only
    const updateData = this.buildFirstOptionUpdate(value);
    
    // Update observer
    this.customOptionsSubject.updateOption(updateData);
    
    // Then filter second options
    this.filterSecondOptions(value);
    
    // Update quantity limits and display
    this.updateMaxQuantityFromSelection();
    this.updateQuantityDisplay();
    
    console.log('🔄 First option updated with complete data:', updateData);
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('first-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions },
        updateData
      }
    }));
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains('classic-option-disabled')) return;

    console.log('🎯 Second option selected:', value);

    // Clear previous second option selection
    this.clearSecondOptionSelections();
    
    // Apply selection
    this.applySelectionStyle(element);
    
    // Update state
    this.selectedOptions.second = value;
    
    // Update display
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = value;
      console.log('✅ Updated second option display:', value);
    }
    
    // Build comprehensive update object for both options
    const updateData = this.buildCompleteUpdate();
    
    // Update observer
    this.customOptionsSubject.updateOption(updateData);
    
    // Update quantity limits and display
    this.updateMaxQuantityFromSelection();
    this.updateQuantityDisplay();
    
    console.log('🔄 Complete selection updated with all data:', updateData);
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('second-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions },
        updateData
      }
    }));
  }

  // Quantity Management Methods
  private handleQuantityDecrease(): void {
    if (this.currentQuantity > 1) {
      this.currentQuantity--;
      this.updateQuantityDisplay();
      this.updateQuantityInObserver();
    }
  }

  private handleQuantityIncrease(): void {
    if (this.currentQuantity < this.maxQuantity) {
      this.currentQuantity++;
      this.updateQuantityDisplay();
      this.updateQuantityInObserver();
    }
  }

  private handleQuantityInput(): void {
    if (!this.qtyInput) return;
    
    const value = parseInt(this.qtyInput.value) || 1;
    this.currentQuantity = Math.max(1, Math.min(value, this.maxQuantity));
    this.updateQuantityInObserver();
  }

  private validateQuantityInput(): void {
    if (!this.qtyInput) return;
    
    // Ensure the input shows the corrected value
    this.qtyInput.value = this.currentQuantity.toString();
  }

  private updateQuantityDisplay(): void {
    if (this.qtyInput) {
      this.qtyInput.value = this.currentQuantity.toString();
      this.qtyInput.setAttribute('max', this.maxQuantity.toString());
    }
    
    // Update button states
    if (this.qtyDecreaseBtn) {
      this.qtyDecreaseBtn.style.opacity = this.currentQuantity <= 1 ? '0.5' : '1';
      this.qtyDecreaseBtn.style.pointerEvents = this.currentQuantity <= 1 ? 'none' : 'auto';
    }
    
    if (this.qtyIncreaseBtn) {
      this.qtyIncreaseBtn.style.opacity = this.currentQuantity >= this.maxQuantity ? '0.5' : '1';
      this.qtyIncreaseBtn.style.pointerEvents = this.currentQuantity >= this.maxQuantity ? 'none' : 'auto';
    }
    
    // Update max quantity display for variants
    if (this.isVariant && this.maxQtyDisplay && this.maxQtyValue) {
      if (this.selectedOptions.first || this.selectedOptions.second) {
        this.maxQtyDisplay.style.display = 'block';
        this.maxQtyValue.textContent = this.maxQuantity.toString();
      } else {
        this.maxQtyDisplay.style.display = 'none';
      }
    }
    
    console.log(`📊 Quantity updated: ${this.currentQuantity}/${this.maxQuantity}`);
  }

  private updateQuantityInObserver(): void {
    this.customOptionsSubject.updateQuantity(this.currentQuantity);
    console.log('📊 Updated quantity in observer:', this.currentQuantity);
  }

  private updateMaxQuantityFromSelection(): void {
    if (!this.isVariant) {
      // For non-variants, max quantity is always the product quantity
      this.maxQuantity = this.qtyNonVariant;
      return;
    }

    // For variants, get quantity from selected combination
    const combinationData = this.findCombinationData();
    if (combinationData && combinationData.qty !== undefined) {
      this.maxQuantity = combinationData.qty;
    } else {
      // Fallback to checking individual option quantities
      let maxFromOptions = 1;
      
      if (this.selectedOptions.second && this.optionData?.secondOptionMetadata?.[this.selectedOptions.second]) {
        const secondMetadata = this.optionData.secondOptionMetadata[this.selectedOptions.second];
        if (secondMetadata.qty !== undefined) {
          maxFromOptions = secondMetadata.qty;
        }
      } else if (this.selectedOptions.first && this.optionData?.firstOptionMetadata?.[this.selectedOptions.first]) {
        const firstMetadata = this.optionData.firstOptionMetadata[this.selectedOptions.first];
        if (firstMetadata.qty !== undefined) {
          maxFromOptions = firstMetadata.qty;
        }
      }
      
      this.maxQuantity = maxFromOptions;
    }
    
    // Ensure current quantity doesn't exceed new max
    if (this.currentQuantity > this.maxQuantity) {
      this.currentQuantity = this.maxQuantity;
    }
    
    console.log(`📈 Max quantity updated to: ${this.maxQuantity}`);
  }

  // Build update data for first option selection only
  private buildFirstOptionUpdate(firstValue: string): any {
    const updateData: any = {
      firstOption: firstValue,
      secondOption: null,
      sku_id: null,
      image: null,
      hex: null,
      price: null,
      price_after_discount: null,
      qty: this.currentQuantity
    };

    // Get first option metadata if available
    if (this.optionData?.firstOptionMetadata?.[firstValue]) {
      const metadata = this.optionData.firstOptionMetadata[firstValue];
      
      // Only set properties from first option if they exist
      if (metadata.hex !== undefined) updateData.hex = metadata.hex;
      if (metadata.price !== undefined) updateData.price = metadata.price;
      if (metadata.price_after_discount !== undefined) updateData.price_after_discount = metadata.price_after_discount;
      if (metadata.image !== undefined) updateData.image = metadata.image;
      if (metadata.qty !== undefined) updateData.qty = metadata.qty;
    }

    // Fallback to base values if not set by first option
    if (updateData.price === null) updateData.price = this.basePrice;
    if (updateData.price_after_discount === null) updateData.price_after_discount = this.basePriceAfterDiscount;
    if (updateData.image === null) updateData.image = this.baseImage;
    if (updateData.qty === null) updateData.qty = this.currentQuantity;

    return updateData;
  }

  // Build complete update data when both options are selected
  private buildCompleteUpdate(): any {
    if (!this.selectedOptions.first || !this.selectedOptions.second) {
      return this.buildFirstOptionUpdate(this.selectedOptions.first || '');
    }

    const updateData: any = {
      firstOption: this.selectedOptions.first,
      secondOption: this.selectedOptions.second,
      sku_id: null,
      image: null,
      hex: null,
      price: null,
      price_after_discount: null,
      qty: this.currentQuantity
    };

    // Find the matching combination data
    const combinationData = this.findCombinationData();
    if (combinationData) {
      updateData.sku_id = combinationData.sku_id;
      if (combinationData.hex !== undefined) updateData.hex = combinationData.hex;
      if (combinationData.price !== undefined) updateData.price = combinationData.price;
      if (combinationData.price_after_discount !== undefined) updateData.price_after_discount = combinationData.price_after_discount;
      if (combinationData.image !== undefined) updateData.image = combinationData.image;
      if (combinationData.qty !== undefined) updateData.qty = combinationData.qty;
    }

    // Fallback to second option metadata if combination doesn't have the data
    if (this.optionData?.secondOptionMetadata?.[this.selectedOptions.second]) {
      const secondMetadata = this.optionData.secondOptionMetadata[this.selectedOptions.second];
      
      if (updateData.hex === null && secondMetadata.hex !== undefined) updateData.hex = secondMetadata.hex;
      if (updateData.price === null && secondMetadata.price !== undefined) updateData.price = secondMetadata.price;
      if (updateData.price_after_discount === null && secondMetadata.price_after_discount !== undefined) updateData.price_after_discount = secondMetadata.price_after_discount;
      if (updateData.image === null && secondMetadata.image !== undefined) updateData.image = secondMetadata.image;
      if (updateData.qty === null && secondMetadata.qty !== undefined) updateData.qty = secondMetadata.qty;
    }

    // Fallback to first option metadata
    if (this.optionData?.firstOptionMetadata?.[this.selectedOptions.first]) {
      const firstMetadata = this.optionData.firstOptionMetadata[this.selectedOptions.first];
      
      if (updateData.hex === null && firstMetadata.hex !== undefined) updateData.hex = firstMetadata.hex;
      if (updateData.price === null && firstMetadata.price !== undefined) updateData.price = firstMetadata.price;
      if (updateData.price_after_discount === null && firstMetadata.price_after_discount !== undefined) updateData.price_after_discount = firstMetadata.price_after_discount;
      if (updateData.image === null && firstMetadata.image !== undefined) updateData.image = firstMetadata.image;
      if (updateData.qty === null && firstMetadata.qty !== undefined) updateData.qty = firstMetadata.qty;
    }

    // Final fallback to base values
    if (updateData.price === null) updateData.price = this.basePrice;
    if (updateData.price_after_discount === null) updateData.price_after_discount = this.basePriceAfterDiscount;
    if (updateData.image === null) updateData.image = this.baseImage;
    if (updateData.qty === null) updateData.qty = this.currentQuantity;

    return updateData;
  }

  // Find combination data from associations
  private findCombinationData(): any {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    const availableOptions = this.optionData.associations[this.selectedOptions.first];
    return availableOptions?.find(opt => opt.value === this.selectedOptions.second) || null;
  }

  private clearFirstOptionSelections(): void {
    if (this.firstOptionElements) {
      this.firstOptionElements.forEach(el => {
        el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
      });
    }
  }

  private clearSecondOptionSelections(): void {
    if (this.secondOptionElements) {
      this.secondOptionElements.forEach(el => {
        el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
      });
    }
    
    // Clear internal state
    this.selectedOptions.second = undefined;
    
    // Clear display
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = '';
    }
    
    console.log('🧹 Cleared second option UI and internal state');
  }

  private applySelectionStyle(element: HTMLElement): void {
    // Apply appropriate selection class based on element type
    if (element.classList.contains('classic-color-option')) {
      element.classList.add('classic-selected-color-option');
    } else {
      element.classList.add('classic-selected-size-option');
    }
  }

  private filterSecondOptions(firstValue: string): void {
    if (!this.optionData?.associations || !this.secondOptionElements) return;

    const availableSecondOptions = this.optionData.associations[firstValue] || [];
    const availableValues = availableSecondOptions.map(opt => opt.value);

    this.secondOptionElements.forEach(element => {
      const value = element.getAttribute('data-option-value');
      const isAvailable = availableValues.includes(value || '');
      
      if (isAvailable) {
        element.classList.remove('classic-option-disabled');
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
      } else {
        element.classList.add('classic-option-disabled');
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.3';
      }
    });

    console.log(`🔍 Filtered second options for "${firstValue}":`, availableValues);
  }

  private syncUIWithObserver(option: any): void {
    // Sync selections from observer state
    console.log('🔄 Syncing UI with observer:', option);
    
    // Update internal state from observer
    this.selectedOptions = {
      first: option.firstOption,
      second: option.secondOption
    };
    
    // Update displays
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = option.firstOption || '';
      console.log('🔄 Synced first option display:', option.firstOption);
    }
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = option.secondOption || '';
      console.log('🔄 Synced second option display:', option.secondOption);
    }
    
    // Update visual selections
    this.updateVisualSelections(option);
  }

  private updateVisualSelections(option: any): void {
    // Clear all selections first
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();

    // Apply first option selection
    if (option.firstOption && this.firstOptionElements) {
      const firstElement = Array.from(this.firstOptionElements).find(
        element => element.getAttribute('data-option-value') === option.firstOption
      );
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        // Filter second options based on first selection
        this.filterSecondOptions(option.firstOption);
      }
    }

    // Apply second option selection
    if (option.secondOption && this.secondOptionElements) {
      const secondElement = Array.from(this.secondOptionElements).find(
        element => element.getAttribute('data-option-value') === option.secondOption
      );
      if (secondElement) {
        this.applySelectionStyle(secondElement);
      }
    }
  }

  // Public API
  public getSelectedOptions(): SelectedOptions {
    return { ...this.selectedOptions };
  }

  public isSelectionComplete(): boolean {
    if (!this.isVariant) return true;
    
    const hasFirst = !this.optionData?.firstOption || this.selectedOptions.first !== undefined;
    const hasSecond = !this.optionData?.secondOption || this.selectedOptions.second !== undefined;
    
    return hasFirst && hasSecond;
  }

  public clearSelections(): void {
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();
    
    this.selectedOptions = {};
    
    // Clear displays
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = '';
    }
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = '';
    }
    
    // Show all second options as available
    if (this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        element.classList.remove('classic-option-disabled');
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
      });
    }
    
    // Reset quantity to 1
    this.currentQuantity = 1;
    this.updateQuantityDisplay();
    
    // Clear observer state with all properties reset
    this.customOptionsSubject.clearOption();
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  // Additional public methods for getting current state
  public getCurrentObserverState(): any {
    return this.customOptionsSubject.getOption();
  }

  public getCompleteState(): any {
    const observerState = this.getCurrentObserverState();
    return {
      panelIndex: this.panelIndex,
      selectedOptions: this.selectedOptions,
      isComplete: this.isSelectionComplete(),
      currentQuantity: this.currentQuantity,
      maxQuantity: this.maxQuantity,
      observerState
    };
  }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-select-options')) {
    customElements.define('classic-select-options', ClassicSelectOptions);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const selectOptions = document.querySelectorAll('classic-select-options:not(:defined)');
  selectOptions.forEach(option => {
    if (option instanceof ClassicSelectOptions) {
      option.connectedCallback();
    }
  });
});

export { ClassicSelectOptions };
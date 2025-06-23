// ClassicDynamicPannelContainer.ts - Clean Generic Implementation

import { QuantityOptionsSubject } from "../../../../../../lib/patterns/Observers/quantity-observer";
import type { QuantityState } from "../../../../../../lib/patterns/Observers/quantity-observer";

import { CustomOptionSubject } from "../../../../../../lib/patterns/Observers/custom-option-observer";
import type { CustomOptionState } from "../../../../../../lib/patterns/Observers/custom-option-observer";

import type { Observer, Subject } from "../../../../../../lib/patterns/Observers/base-observer";

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
  associations: { [firstValue: string]: Array<{value: string, sku_id: number, hex?: string, image?: string}> };
}

interface SelectedOptions {
  first?: string;
  second?: string;
}

class ClassicSelectOptions extends HTMLElement implements Observer<QuantityState>, Observer<CustomOptionState> {
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: OptionData | null = null;
  private skuNoVariant: string = "";
  private selectedOptions: SelectedOptions = {};
  
  // Observer integration
  private quantitySubject: QuantityOptionsSubject;
  private customOptionSubject: CustomOptionSubject;
  
  // DOM elements
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.customOptionSubject = CustomOptionSubject.getInstance();
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
    
    // Parse option data
    const optionDataAttr = this.getAttribute('data-option-data');
    if (optionDataAttr && this.isVariant) {
      try {
        this.optionData = JSON.parse(optionDataAttr);
        console.log('Parsed option data:', this.optionData);
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
    
    console.log('🔍 Found elements:', {
      firstOptions: this.firstOptionElements?.length || 0,
      secondOptions: this.secondOptionElements?.length || 0,
      firstDisplay: !!this.firstOptionDisplay,
      secondDisplay: !!this.secondOptionDisplay
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
  }

  private attachToObservers(): void {
    this.quantitySubject.attach(this);
    this.customOptionSubject.attach(this);
  }

  private detachFromObservers(): void {
    this.quantitySubject.detach(this);
    this.customOptionSubject.detach(this);
  }

  private initializeState(): void {
    if (!this.isVariant && this.skuNoVariant) {
      // For non-variant products, set SKU immediately
      this.customOptionSubject.updatePanelOption(this.panelIndex, {
        sku_id: parseInt(this.skuNoVariant)
      });
    }
  }

  // Observer implementation
  public update(subject: Subject<QuantityState | CustomOptionState>): void {
    if (subject instanceof QuantityOptionsSubject) {
      this.handleQuantityUpdate(subject.getState());
    } else if (subject instanceof CustomOptionSubject) {
      this.handleCustomOptionUpdate(subject.getState());
    }
  }

  private handleQuantityUpdate(state: QuantityState): void {
    this.dispatchEvent(new CustomEvent('quantity-updated', {
      detail: { panelIndex: this.panelIndex, quantityState: state }
    }));
  }

  private handleCustomOptionUpdate(state: CustomOptionState): void {
    // Sync UI with observer state changes
    const panelOption = this.customOptionSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.syncUIWithObserver(panelOption);
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
    
    // Update display - with debug logging
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = value;
      console.log('✅ Updated first option display:', value);
    } else {
      console.warn('❌ First option display element not found');
    }
    
    // 🆕 First option drives filtering - clear and filter second options
    this.clearSecondOptionSelections();
    this.filterSecondOptions(value);
    
    // Update observer
    this.updateObserver();
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('first-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions }
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
    
    // Update display - with debug logging
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = value;
      console.log('✅ Updated second option display:', value);
    } else {
      console.warn('❌ Second option display element not found');
    }
    
    // Update observer with SKU
    this.updateObserver();
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('second-option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions }
      }
    }));
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
    
    this.selectedOptions.second = undefined;
    
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = '';
    }
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

  private findSkuId(): number | null {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    const availableOptions = this.optionData.associations[this.selectedOptions.first];
    const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
    
    return matchingOption?.sku_id || null;
  }

  private updateObserver(): void {
    const updateData: any = {};
    
    // Use the observer's expected field names
    if (this.selectedOptions.first) {
      updateData.firstOption = this.selectedOptions.first;
    }
    
    if (this.selectedOptions.second) {
      updateData.secondOption = this.selectedOptions.second;
    }
    
    // Add SKU if both options are selected
    const skuId = this.findSkuId();
    if (skuId) {
      updateData.sku_id = skuId;
      console.log(`🆔 SKU ID found: ${skuId}`);
    }
    
    // Find image from the matching option
    const imageUrl = this.findImageUrl();
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    
    this.customOptionSubject.updatePanelOption(this.panelIndex, updateData);
  }

  private findImageUrl(): string | null {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    const availableOptions = this.optionData.associations[this.selectedOptions.first];
    const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
    
    return matchingOption?.image || null;
  }

  private syncUIWithObserver(panelOption: any): void {
    // Sync selections from observer state
    console.log('🔄 Syncing UI with observer:', panelOption);
    
    // Update internal state from observer
    this.selectedOptions = {
      first: panelOption.firstOption,
      second: panelOption.secondOption
    };
    
    // Update displays - with debug logging
    if (this.firstOptionDisplay) {
      this.firstOptionDisplay.textContent = panelOption.firstOption || '';
      console.log('🔄 Synced first option display:', panelOption.firstOption);
    }
    if (this.secondOptionDisplay) {
      this.secondOptionDisplay.textContent = panelOption.secondOption || '';
      console.log('🔄 Synced second option display:', panelOption.secondOption);
    }
    
    // Update visual selections
    this.updateVisualSelections(panelOption);
  }

  private updateVisualSelections(panelOption: any): void {
    // Clear all selections first
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();

    // Apply first option selection
    if (panelOption.firstOption && this.firstOptionElements) {
      const firstElement = Array.from(this.firstOptionElements).find(
        element => element.getAttribute('data-option-value') === panelOption.firstOption
      );
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        // Filter second options based on first selection
        this.filterSecondOptions(panelOption.firstOption);
      }
    }

    // Apply second option selection
    if (panelOption.secondOption && this.secondOptionElements) {
      const secondElement = Array.from(this.secondOptionElements).find(
        element => element.getAttribute('data-option-value') === panelOption.secondOption
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
    
    // Clear observer state using the correct field names
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      firstOption: null,
      secondOption: null,
      sku_id: null,
      image: null
    });
  }

  public getPanelIndex(): number {
    return this.panelIndex;
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
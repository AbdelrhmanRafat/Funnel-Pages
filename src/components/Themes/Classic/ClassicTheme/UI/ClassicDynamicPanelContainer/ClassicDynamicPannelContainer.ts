// ClassicSelectOptions.ts - Simplified and Organized

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
  // Configuration
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: OptionData | null = null;
  private skuNoVariant: string = "";
  private nOfOptions: number = 0;
  
  // State
  private selectedOptions: SelectedOptions = {};
  
  // Observers
  private quantitySubject: QuantityOptionsSubject;
  private customOptionSubject: CustomOptionSubject;
  
  // DOM Elements
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.customOptionSubject = CustomOptionSubject.getInstance();
  }

  // Lifecycle Methods
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

  // Initialization Methods
  private initializeSettings(): void {
    this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
    this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
    this.skuNoVariant = this.getAttribute('data-sku-no-variant') || '';
    this.nOfOptions = parseInt(this.getAttribute('data-no-of-options') || '0');
    
    const optionDataAttr = this.getAttribute('data-option-data');
    if (optionDataAttr && this.isVariant) {
      try {
        this.optionData = JSON.parse(optionDataAttr);
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
  }

  private setupEventListeners(): void {
    this.firstOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    this.secondOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleSecondOptionClick(element));
    });
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
    // Always set the number of options for this panel
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      numberOfOptions: this.nOfOptions
    });

    // For non-variant products, also set the SKU
    if (!this.isVariant && this.skuNoVariant) {
      this.customOptionSubject.updatePanelOption(this.panelIndex, {
        sku_id: parseInt(this.skuNoVariant),
        numberOfOptions: this.nOfOptions
      });
    }
  }

  // Observer Implementation
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
    const panelOption = this.customOptionSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.syncUIWithObserver(panelOption);
    }
  }

  // Event Handlers
  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    this.clearFirstOptionSelections();
    this.applySelectionStyle(element);
    this.selectedOptions.first = value;
    this.updateOptionDisplay(this.firstOptionDisplay, value);
    
    // Reset second option when first option changes
    this.clearSecondOptionSelections();
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      firstOption: value,
      secondOption: null,
      sku_id: null,
      image: null,
      numberOfOptions: this.nOfOptions
    });
    
    this.filterSecondOptions(value);
    this.dispatchSelectionEvent('first-option-selected', value);
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains('classic-option-disabled')) return;

    this.clearSecondOptionSelections();
    this.applySelectionStyle(element);
    this.selectedOptions.second = value;
    this.updateOptionDisplay(this.secondOptionDisplay, value);
    this.updateObserver();
    this.dispatchSelectionEvent('second-option-selected', value);
  }

  // UI Update Methods
  private clearFirstOptionSelections(): void {
    this.firstOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
    });
  }

  private clearSecondOptionSelections(): void {
    this.secondOptionElements?.forEach(el => {
      el.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
    });
    
    this.selectedOptions.second = undefined;
    this.updateOptionDisplay(this.secondOptionDisplay, '');
  }

  private applySelectionStyle(element: HTMLElement): void {
    const styleClass = element.classList.contains('classic-color-option') 
      ? 'classic-selected-color-option' 
      : 'classic-selected-size-option';
    element.classList.add(styleClass);
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
      element.style.pointerEvents = 'auto';
      element.style.opacity = '1';
    } else {
      element.classList.add('classic-option-disabled');
      element.style.pointerEvents = 'none';
      element.style.opacity = '0.3';
    }
  }

  private syncUIWithObserver(panelOption: any): void {
    this.selectedOptions = {
      first: panelOption.firstOption,
      second: panelOption.secondOption
    };
    
    this.updateOptionDisplay(this.firstOptionDisplay, panelOption.firstOption || '');
    this.updateOptionDisplay(this.secondOptionDisplay, panelOption.secondOption || '');
    this.updateVisualSelections(panelOption);
  }

  private updateVisualSelections(panelOption: any): void {
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();

    if (panelOption.firstOption && this.firstOptionElements) {
      const firstElement = this.findElementByValue(this.firstOptionElements, panelOption.firstOption);
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        this.filterSecondOptions(panelOption.firstOption);
      }
    }

    if (panelOption.secondOption && this.secondOptionElements) {
      const secondElement = this.findElementByValue(this.secondOptionElements, panelOption.secondOption);
      if (secondElement) {
        this.applySelectionStyle(secondElement);
      }
    }
  }

  // Utility Methods
  private findElementByValue(elements: NodeListOf<HTMLElement>, value: string): HTMLElement | undefined {
    return Array.from(elements).find(element => 
      element.getAttribute('data-option-value') === value
    );
  }

  private findSkuId(): number | null {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    const availableOptions = this.optionData.associations[this.selectedOptions.first];
    const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
    return matchingOption?.sku_id || null;
  }

  private findImageUrl(): string | null {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    const availableOptions = this.optionData.associations[this.selectedOptions.first];
    const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
    return matchingOption?.image || null;
  }

  private updateObserver(): void {
    const updateData: any = {
      firstOption: this.selectedOptions.first || null,
      secondOption: this.selectedOptions.second || null,
      numberOfOptions: this.nOfOptions,
      sku_id: null,
      image: null
    };
    
    if (this.selectedOptions.second) {
      const skuId = this.findSkuId();
      const imageUrl = this.findImageUrl();
      
      if (skuId) updateData.sku_id = skuId;
      if (imageUrl) updateData.image = imageUrl;
    }
    
    this.customOptionSubject.updatePanelOption(this.panelIndex, updateData);
  }

  private dispatchSelectionEvent(eventName: string, value: string): void {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions }
      }
    }));
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
    
    this.updateOptionDisplay(this.firstOptionDisplay, '');
    this.updateOptionDisplay(this.secondOptionDisplay, '');
    
    this.secondOptionElements?.forEach(element => {
      this.toggleElementAvailability(element, true);
    });
    
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      firstOption: null,
      secondOption: null,
      numberOfOptions: this.nOfOptions,
      sku_id: null,
      image: null
    });
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }
}

// Registration
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
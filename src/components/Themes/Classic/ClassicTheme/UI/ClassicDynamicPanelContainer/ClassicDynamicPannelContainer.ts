// ClassicSelectOptions.ts - Enhanced with Fixed Selection States

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

class ClassicSelectOptionsBundles extends HTMLElement implements Observer<QuantityState>, Observer<CustomOptionState> {
  // === Configuration Properties ===
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: OptionData | null = null;
  private skuNoVariant: string = "";
  private nOfOptions: number = 0;
  
  // === State Management ===
  private selectedOptions: SelectedOptions = {};
  
  // === Observer Instances ===
  private quantitySubject: QuantityOptionsSubject;
  private customOptionSubject: CustomOptionSubject;
  
  // === DOM Element References ===
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.customOptionSubject = CustomOptionSubject.getInstance();
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
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      numberOfOptions: this.nOfOptions
    });

    if (!this.isVariant && this.skuNoVariant) {
      this.customOptionSubject.updatePanelOption(this.panelIndex, {
        sku_id: parseInt(this.skuNoVariant),
        numberOfOptions: this.nOfOptions
      });
    }
  }

  private initializeSecondOptionsState(): void {
    if (this.isVariant && this.optionData?.firstOption && this.optionData?.secondOption && this.secondOptionElements) {
      this.secondOptionElements.forEach(element => {
        this.toggleElementAvailability(element, false);
      });
    }
  }

  // === Observer Implementation ===
  
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

  // === Event Handlers ===
  
  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value) return;

    // Clear all first option selections first
    this.clearFirstOptionSelections();
    
    // Apply selection style immediately
    this.applySelectionStyle(element);
    
    // Update internal state
    this.selectedOptions.first = value;
    this.updateOptionDisplay(this.firstOptionDisplay, value);
    
    // Clear second options and reset their state
    this.clearSecondOptionSelections();
    
    // Update observer state
    this.updateObserverForFirstOption(value);
    
    // Filter and enable available second options
    this.filterSecondOptions(value);
    
    // Dispatch event
    this.dispatchSelectionEvent('first-option-selected', value);
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains('classic-option-disabled')) return;

    // Clear all second option selections first
    this.clearSecondOptionSelections();
    
    // Apply selection style immediately
    this.applySelectionStyle(element);
    
    // Update internal state
    this.selectedOptions.second = value;
    this.updateOptionDisplay(this.secondOptionDisplay, value);
    
    // Update observer state
    this.updateObserverForSecondOption();
    
    // Dispatch event
    this.dispatchSelectionEvent('second-option-selected', value);
  }

  // === UI State Management ===
  
  private clearFirstOptionSelections(): void {
    if (!this.firstOptionElements) return;
    
    this.firstOptionElements.forEach(el => {
      // Remove all possible selection classes
      el.classList.remove(
        'classic-selected-color-option', 
        'classic-selected-size-option',
        'classic-selected'
      );
    });
  }

  private clearSecondOptionSelections(): void {
    if (!this.secondOptionElements) return;
    
    this.secondOptionElements.forEach(el => {
      // Remove all possible selection classes
      el.classList.remove(
        'classic-selected-color-option', 
        'classic-selected-size-option',
        'classic-selected'
      );
    });
    
    // Clear internal state
    this.selectedOptions.second = undefined;
    this.updateOptionDisplay(this.secondOptionDisplay, '');
  }

  private applySelectionStyle(element: HTMLElement): void {
    // Determine the correct selection class based on element type
    if (element.classList.contains('classic-color-option')) {
      element.classList.add('classic-selected-color-option');
    } else if (element.classList.contains('classic-size-option')) {
      element.classList.add('classic-selected-size-option');
    }
    
    // Also add a generic selected class for additional styling if needed
    element.classList.add('classic-selected');
    
    // Force a reflow to ensure the class is applied immediately
    element.offsetHeight;
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

  private syncUIWithObserver(panelOption: any): void {
    // Update internal state from observer
    this.selectedOptions = {
      first: panelOption.firstOption,
      second: panelOption.secondOption
    };
    
    // Update display elements
    this.updateOptionDisplay(this.firstOptionDisplay, panelOption.firstOption || '');
    this.updateOptionDisplay(this.secondOptionDisplay, panelOption.secondOption || '');
    
    // Update visual selections
    this.updateVisualSelections(panelOption);
  }

  private updateVisualSelections(panelOption: any): void {
    // Clear all current selections
    this.clearAllSelections();

    // Apply first option selection if exists
    if (panelOption.firstOption && this.firstOptionElements) {
      const firstElement = this.findElementByValue(this.firstOptionElements, panelOption.firstOption);
      if (firstElement) {
        this.applySelectionStyle(firstElement);
        // Filter second options based on first selection
        this.filterSecondOptions(panelOption.firstOption);
      }
    }

    // Apply second option selection if exists
    if (panelOption.secondOption && this.secondOptionElements) {
      const secondElement = this.findElementByValue(this.secondOptionElements, panelOption.secondOption);
      if (secondElement && !secondElement.classList.contains('classic-option-disabled')) {
        this.applySelectionStyle(secondElement);
        // Ensure display is updated
        this.updateOptionDisplay(this.secondOptionDisplay, panelOption.secondOption);
      }
    }
  }

  // === Observer Update Methods ===
  
  private updateObserverForFirstOption(value: string): void {
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      panelIndex: this.panelIndex,
      firstOption: value,
      secondOption: null,
      sku_id: null,
      image: null,
      numberOfOptions: this.nOfOptions
    });
  }

  private updateObserverForSecondOption(): void {
    const updateData: any = {
      panelIndex: this.panelIndex,
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

  // === Utility Methods ===
  
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

  private dispatchSelectionEvent(eventName: string, value: string): void {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions }
      }
    }));
  }

  private clearAllSelections(): void {
    this.clearFirstOptionSelections();
    this.clearSecondOptionSelections();
  }

  // === Public API ===
  
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
    this.clearAllSelections();
    this.selectedOptions = {};
    
    this.updateOptionDisplay(this.firstOptionDisplay, '');
    this.updateOptionDisplay(this.secondOptionDisplay, '');
    
    this.resetSecondOptionsState();
    this.updateObserverForClear();
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  // === Enhanced Selection Methods ===
  
  public forceRefreshSelections(): void {
    // Force refresh all visual selections based on current state
    const panelOption = this.customOptionSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.updateVisualSelections(panelOption);
    }
  }

  public validateSelectionStates(): boolean {
    // Validate that UI state matches internal state
    let isValid = true;
    
    if (this.selectedOptions.first && this.firstOptionElements) {
      const firstElement = this.findElementByValue(this.firstOptionElements, this.selectedOptions.first);
      if (firstElement && !firstElement.classList.contains('classic-selected-size-option') && 
          !firstElement.classList.contains('classic-selected-color-option')) {
        isValid = false;
      }
    }
    
    if (this.selectedOptions.second && this.secondOptionElements) {
      const secondElement = this.findElementByValue(this.secondOptionElements, this.selectedOptions.second);
      if (secondElement && !secondElement.classList.contains('classic-selected-size-option') && 
          !secondElement.classList.contains('classic-selected-color-option')) {
        isValid = false;
      }
    }
    
    return isValid;
  }

  public repairSelections(): void {
    // Repair any broken selection states
    if (!this.validateSelectionStates()) {
      this.forceRefreshSelections();
    }
  }

  // === Private Helper Methods for Clear ===
  
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

  private updateObserverForClear(): void {
    this.customOptionSubject.updatePanelOption(this.panelIndex, {
      panelIndex: this.panelIndex,
      firstOption: null,
      secondOption: null,
      numberOfOptions: this.nOfOptions,
      sku_id: null,
      image: null
    });
  }
}

// === Component Registration ===

document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-select-options-bundles')) {
    customElements.define('classic-select-options-bundles', ClassicSelectOptionsBundles);
  }
});

document.addEventListener('astro:page-load', () => {
  const selectOptions = document.querySelectorAll('classic-select-options-bundles:not(:defined)');
  selectOptions.forEach(option => {
    if (option instanceof ClassicSelectOptionsBundles) {
      option.connectedCallback();
    }
  });
});

export { ClassicSelectOptionsBundles };
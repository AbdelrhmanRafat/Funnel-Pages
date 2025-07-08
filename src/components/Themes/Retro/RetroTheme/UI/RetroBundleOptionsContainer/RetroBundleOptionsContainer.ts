// RetroSelectOptionsBundles.ts - Enhanced with Fixed Naming Convention

import type { Observer, Subject } from "../../../../../../lib/patterns/Observers/base-observer";
import { BundleOptionsSubject, type BundleState } from "../../../../../../lib/patterns/Observers/bundle-observer";
import { CustomOptionBundlesSubject, type CustomOptionBundlesState } from "../../../../../../lib/patterns/Observers/custom-option-observer-bundles";

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

// Updated CSS class constants with proper naming convention
const CSS_CLASSES = {
  // Selection states
  SELECTED_COLOR: 'retro-bundle-options-container-selected-color',
  SELECTED_SIZE: 'retro-bundle-options-container-selected-size',
  SELECTED_GENERIC: 'retro-selected',
  
  // Option types
  COLOR_OPTION: 'retro-bundle-options-container-color-option',
  SIZE_OPTION: 'retro-bundle-options-container-size-option',
  
  // Availability states
  OPTION_AVAILABLE: 'retro-bundle-options-container-option-available',
  OPTION_DISABLED: 'retro-bundle-options-container-option-disabled',
  OPTION_TRANSITIONING: 'retro-bundle-options-container-option-transitioning'
} as const;

class RetroSelectOptionsBundles extends HTMLElement implements Observer<BundleState>, Observer<CustomOptionBundlesState> {
  // === Configuration Properties ===
  private panelIndex: number = 1;
  private isVariant: boolean = false;
  private optionData: OptionData | null = null;
  private skuNoVariant: string = "";
  private nOfOptions: number = 0;
  
  // === State Management ===
  private selectedOptions: SelectedOptions = {};
  
  // === Observer Instances ===
  private bundleOptionsSubject: BundleOptionsSubject;
  private customOptionBundlesSubject: CustomOptionBundlesSubject;
  
  // === DOM Element References ===
  private firstOptionElements: NodeListOf<HTMLElement> | null = null;
  private secondOptionElements: NodeListOf<HTMLElement> | null = null;
  private firstOptionDisplay: HTMLElement | null = null;
  private secondOptionDisplay: HTMLElement | null = null;

  constructor() {
    super();
    this.bundleOptionsSubject = BundleOptionsSubject.getInstance();
    this.customOptionBundlesSubject = CustomOptionBundlesSubject.getInstance();
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
    this.removeEventListeners();
  }

  // === Initialization Methods ===
  
  private initializeSettings(): void {
    try {
      this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
      this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
      this.skuNoVariant = this.getAttribute('data-sku-no-variant') || '';
      this.nOfOptions = parseInt(this.getAttribute('data-no-of-options') || '0');
      
      const optionDataAttr = this.getAttribute('data-option-data');
      if (optionDataAttr && this.isVariant) {
        this.optionData = JSON.parse(optionDataAttr);
      }
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to initialize settings:', error);
    }
  }

  private initializeElements(): void {
    this.firstOptionElements = this.querySelectorAll('[data-option-type="first"]');
    this.secondOptionElements = this.querySelectorAll('[data-option-type="second"]');
    this.firstOptionDisplay = this.querySelector('[data-selected-first-option]');
    this.secondOptionDisplay = this.querySelector('[data-selected-second-option]');
    
    if (!this.firstOptionElements?.length && !this.secondOptionElements?.length) {
      console.warn('RetroSelectOptionsBundles: No option elements found');
    }
  }

  private setupEventListeners(): void {
    this.firstOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    this.secondOptionElements?.forEach(element => {
      element.addEventListener('click', () => this.handleSecondOptionClick(element));
    });
  }

  private removeEventListeners(): void {
    this.firstOptionElements?.forEach(element => {
      element.removeEventListener('click', () => this.handleFirstOptionClick(element));
    });
    
    this.secondOptionElements?.forEach(element => {
      element.removeEventListener('click', () => this.handleSecondOptionClick(element));
    });
  }

  private attachToObservers(): void {
    this.bundleOptionsSubject.attach(this);
    this.customOptionBundlesSubject.attach(this);
  }

  private detachFromObservers(): void {
    this.bundleOptionsSubject.detach(this);
    this.customOptionBundlesSubject.detach(this);
  }

  private initializeState(): void {
    this.customOptionBundlesSubject.updatePanelOption(this.panelIndex, {
      numberOfOptions: this.nOfOptions
    });

    if (!this.isVariant && this.skuNoVariant) {
      this.customOptionBundlesSubject.updatePanelOption(this.panelIndex, {
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
  
  public update(subject: Subject<BundleState | CustomOptionBundlesState>): void {
    try {
      if (subject instanceof BundleOptionsSubject) {
        this.handleBundleOptionsUpdate(subject.getState());
      } else if (subject instanceof CustomOptionBundlesSubject) {
        this.handleCustomOptionBundlesUpdate(subject.getState());
      }
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Observer update failed:', error);
    }
  }

  private handleBundleOptionsUpdate(state: BundleState): void {
    this.dispatchEvent(new CustomEvent('bundle-options-updated', {
      detail: { panelIndex: this.panelIndex, bundleState: state },
      bubbles: true
    }));
  }

  private handleCustomOptionBundlesUpdate(state: CustomOptionBundlesState): void {
    const panelOption = this.customOptionBundlesSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.syncUIWithObserver(panelOption);
    }
  }

  // === Event Handlers ===
  
  private handleFirstOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains(CSS_CLASSES.OPTION_DISABLED)) return;

    try {
      // Clear all first option selections
      this.clearFirstOptionSelections();
      
      // Apply selection style immediately
      this.applySelectionStyle(element);
      
      // Update internal state
      this.selectedOptions.first = value;
      this.updateOptionDisplay(this.firstOptionDisplay, value);
      
      // Clear and reset second options
      this.clearSecondOptionSelections();
      
      // Update observer state
      this.updateObserverForFirstOption(value);
      
      // Filter and enable available second options
      this.filterSecondOptions(value);
      
      // Dispatch event
      this.dispatchSelectionEvent('first-option-selected', value);
    } catch (error) {
      console.error('RetroSelectOptionsBundles: First option selection failed:', error);
    }
  }

  private handleSecondOptionClick(element: HTMLElement): void {
    const value = element.getAttribute('data-option-value');
    if (!value || element.classList.contains(CSS_CLASSES.OPTION_DISABLED)) return;

    try {
      // Clear all second option selections
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
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Second option selection failed:', error);
    }
  }

  // === UI State Management ===
  
  private clearFirstOptionSelections(): void {
    if (!this.firstOptionElements) return;
    
    this.firstOptionElements.forEach(el => {
      el.classList.remove(
        CSS_CLASSES.SELECTED_COLOR, 
        CSS_CLASSES.SELECTED_SIZE,
        CSS_CLASSES.SELECTED_GENERIC
      );
    });
  }

  private clearSecondOptionSelections(): void {
    if (!this.secondOptionElements) return;
    
    this.secondOptionElements.forEach(el => {
      el.classList.remove(
        CSS_CLASSES.SELECTED_COLOR, 
        CSS_CLASSES.SELECTED_SIZE,
        CSS_CLASSES.SELECTED_GENERIC
      );
    });
    
    // Clear internal state
    this.selectedOptions.second = undefined;
    this.updateOptionDisplay(this.secondOptionDisplay, '');
  }

  private applySelectionStyle(element: HTMLElement): void {
    try {
      // Remove any existing selection classes first
      element.classList.remove(CSS_CLASSES.SELECTED_COLOR, CSS_CLASSES.SELECTED_SIZE);
      
      // Determine and apply the correct selection class based on element type
      if (element.classList.contains(CSS_CLASSES.COLOR_OPTION)) {
        element.classList.add(CSS_CLASSES.SELECTED_COLOR);
      } else if (element.classList.contains(CSS_CLASSES.SIZE_OPTION)) {
        element.classList.add(CSS_CLASSES.SELECTED_SIZE);
      }
      
      // Add generic selected class for additional styling
      element.classList.add(CSS_CLASSES.SELECTED_GENERIC);
      
      // Force reflow to ensure immediate visual update
      element.offsetHeight;
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to apply selection style:', error);
    }
  }

  private updateOptionDisplay(displayElement: HTMLElement | null, value: string): void {
    if (displayElement) {
      displayElement.textContent = value;
    }
  }

  private filterSecondOptions(firstValue: string): void {
    if (!this.optionData?.associations || !this.secondOptionElements) return;

    try {
      const availableSecondOptions = this.optionData.associations[firstValue] || [];
      const availableValues = new Set(availableSecondOptions.map(opt => opt.value));

      this.secondOptionElements.forEach(element => {
        const value = element.getAttribute('data-option-value');
        const isAvailable = availableValues.has(value || '');
        this.toggleElementAvailability(element, isAvailable);
      });
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to filter second options:', error);
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
      console.error('RetroSelectOptionsBundles: Failed to toggle element availability:', error);
    }
  }

  private syncUIWithObserver(panelOption: any): void {
    try {
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
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to sync UI with observer:', error);
    }
  }

  private updateVisualSelections(panelOption: any): void {
    try {
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
        if (secondElement && !secondElement.classList.contains(CSS_CLASSES.OPTION_DISABLED)) {
          this.applySelectionStyle(secondElement);
          // Ensure display is updated
          this.updateOptionDisplay(this.secondOptionDisplay, panelOption.secondOption);
        }
      }
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to update visual selections:', error);
    }
  }

  // === Observer Update Methods ===
  
  private updateObserverForFirstOption(value: string): void {
    this.customOptionBundlesSubject.updatePanelOption(this.panelIndex, {
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
    
    this.customOptionBundlesSubject.updatePanelOption(this.panelIndex, updateData);
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

    try {
      const availableOptions = this.optionData.associations[this.selectedOptions.first];
      const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
      return matchingOption?.sku_id || null;
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to find SKU ID:', error);
      return null;
    }
  }

  private findImageUrl(): string | null {
    if (!this.selectedOptions.first || !this.selectedOptions.second || !this.optionData?.associations) {
      return null;
    }

    try {
      const availableOptions = this.optionData.associations[this.selectedOptions.first];
      const matchingOption = availableOptions?.find(opt => opt.value === this.selectedOptions.second);
      return matchingOption?.image || null;
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to find image URL:', error);
      return null;
    }
  }

  private dispatchSelectionEvent(eventName: string, value: string): void {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { 
        panelIndex: this.panelIndex,
        value,
        selectedOptions: { ...this.selectedOptions }
      },
      bubbles: true
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
    try {
      this.clearAllSelections();
      this.selectedOptions = {};
      
      this.updateOptionDisplay(this.firstOptionDisplay, '');
      this.updateOptionDisplay(this.secondOptionDisplay, '');
      
      this.resetSecondOptionsState();
      this.updateObserverForClear();
      
      this.dispatchEvent(new CustomEvent('selections-cleared', {
        detail: { panelIndex: this.panelIndex },
        bubbles: true
      }));
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to clear selections:', error);
    }
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  // === Enhanced Selection Methods ===
  
  public forceRefreshSelections(): void {
    try {
      const panelOption = this.customOptionBundlesSubject.getPanelOption(this.panelIndex);
      if (panelOption) {
        this.updateVisualSelections(panelOption);
      }
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to refresh selections:', error);
    }
  }

  public validateSelectionStates(): boolean {
    try {
      let isValid = true;
      
      if (this.selectedOptions.first && this.firstOptionElements) {
        const firstElement = this.findElementByValue(this.firstOptionElements, this.selectedOptions.first);
        if (firstElement && !firstElement.classList.contains(CSS_CLASSES.SELECTED_SIZE) && 
            !firstElement.classList.contains(CSS_CLASSES.SELECTED_COLOR)) {
          isValid = false;
        }
      }
      
      if (this.selectedOptions.second && this.secondOptionElements) {
        const secondElement = this.findElementByValue(this.secondOptionElements, this.selectedOptions.second);
        if (secondElement && !secondElement.classList.contains(CSS_CLASSES.SELECTED_SIZE) && 
            !secondElement.classList.contains(CSS_CLASSES.SELECTED_COLOR)) {
          isValid = false;
        }
      }
      
      return isValid;
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to validate selection states:', error);
      return false;
    }
  }

  public repairSelections(): void {
    try {
      if (!this.validateSelectionStates()) {
        this.forceRefreshSelections();
      }
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to repair selections:', error);
    }
  }

  // === Enhanced Error Recovery ===
  
  public resetToInitialState(): void {
    try {
      this.clearSelections();
      this.initializeSecondOptionsState();
      
      this.dispatchEvent(new CustomEvent('component-reset', {
        detail: { panelIndex: this.panelIndex },
        bubbles: true
      }));
    } catch (error) {
      console.error('RetroSelectOptionsBundles: Failed to reset to initial state:', error);
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
    this.customOptionBundlesSubject.updatePanelOption(this.panelIndex, {
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

class RetroSelectOptionsBundlesManager {
  private static readonly COMPONENT_NAME = 'retro-select-options-bundles';

  public static initialize(): void {
    this.registerComponent();
    this.setupEventListeners();
  }

  private static registerComponent(): void {
    if (!customElements.get(this.COMPONENT_NAME)) {
      customElements.define(this.COMPONENT_NAME, RetroSelectOptionsBundles);
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
      if (component instanceof RetroSelectOptionsBundles) {
        component.connectedCallback();
      }
    });
  }
}

// Initialize the component manager
RetroSelectOptionsBundlesManager.initialize();

export { RetroSelectOptionsBundles };
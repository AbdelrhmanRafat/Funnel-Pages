// OfferSelector.ts - Enhanced Web Component for Offer Selection

import { QuantityOptionsSubject } from '../../../../../../lib/patterns/Observers/quantity-observer';
import { CustomOptionSubject } from '../../../../../../lib/patterns/Observers/custom-option-observer';

// Types and Interfaces
interface OfferSelectorElements {
  radioButtons: NodeListOf<HTMLInputElement> | null;
  repeatedElements: NodeListOf<HTMLElement> | null;
}

interface OfferSelectionDetail {
  radioId: string;
  items: number;
  selectedItem: any;
  previousSelection?: any;
  updatedState?: any;
}

interface OfferSelectorConfig {
  offerName: string;
  autoSelectFirst: boolean;
  enableStorage: boolean;
  storageKey: string;
}

// Constants
const CSS_CLASSES = {
  HIDDEN: 'hidden',
  SELECTED_SIZE: 'classic-selected-size-option',
  SELECTED_COLOR: 'classic-selected-color-option'
} as const;

const DATA_ATTRIBUTES = {
  OFFER_NAME: 'data-offer-name',
  AUTO_SELECT_FIRST: 'data-offer-auto-select-first',
  ENABLE_STORAGE: 'data-offer-enable-storage',
  STORAGE_KEY: 'data-offer-storage-key',
  RADIO: 'data-offer-radio',
  ITEMS: 'data-offer-items',
  SELECTED_ITEM: 'data-offer-selected-item',
  OPTION_ID: 'data-offer-option-id',
  OPTIONS_ELEMENTS: 'data-offer-options-elements',
  SIZE_OPTION: 'data-options-size-option',
  COLOR_OPTION: 'data-options-color-option',
  SELECTED_SIZE: 'data-options-selected-size',
  SELECTED_COLOR: 'data-options-selected-color'
} as const;

const CUSTOM_EVENTS = {
  SELECTION_START: 'offer-selection-start',
  SELECTED: 'offer-selected'
} as const;

class OfferSelector extends HTMLElement {
  private elements: OfferSelectorElements = {
    radioButtons: null,
    repeatedElements: null
  };
  
  private readonly quantitySubject: QuantityOptionsSubject;
  private readonly customOptionSubject: CustomOptionSubject;
  private config: OfferSelectorConfig;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.customOptionSubject = CustomOptionSubject.getInstance();
    this.config = this.getDefaultConfig();
  }

  connectedCallback(): void {
    this.initialize();
  }

  // Configuration Methods
  private getDefaultConfig(): OfferSelectorConfig {
    return {
      offerName: 'qty',
      autoSelectFirst: true,
      enableStorage: true,
      storageKey: 'selectedItem'
    };
  }

  private loadConfigFromAttributes(): void {
    this.config = {
      offerName: this.getAttribute(DATA_ATTRIBUTES.OFFER_NAME) || this.config.offerName,
      autoSelectFirst: this.getAttribute(DATA_ATTRIBUTES.AUTO_SELECT_FIRST) !== 'false',
      enableStorage: this.getAttribute(DATA_ATTRIBUTES.ENABLE_STORAGE) !== 'false',
      storageKey: this.getAttribute(DATA_ATTRIBUTES.STORAGE_KEY) || this.config.storageKey
    };
  }

  // Initialization Methods
  private initialize(): void {
    this.loadConfigFromAttributes();
    this.initializeElements();
    this.setupEventListeners();
    this.handleInitialSelection();
  }

  private initializeElements(): void {
    this.elements = {
      radioButtons: this.querySelectorAll(`[${DATA_ATTRIBUTES.RADIO}]`) as NodeListOf<HTMLInputElement>,
      repeatedElements: this.querySelectorAll(`[${DATA_ATTRIBUTES.OPTIONS_ELEMENTS}]`) as NodeListOf<HTMLElement>
    };

    if (!this.elements.radioButtons?.length) {
      console.warn('OfferSelector: No radio buttons found');
    }
  }

  private setupEventListeners(): void {
    if (!this.elements.radioButtons) return;

    this.elements.radioButtons.forEach(radio => {
      radio.addEventListener('change', this.handleRadioChange.bind(this));
    });
  }

  private handleInitialSelection(): void {
    if (!this.config.autoSelectFirst || !this.elements.radioButtons) return;

    const initialRadio = Array.from(this.elements.radioButtons).find(radio => radio.checked);
    if (initialRadio) {
      this.processOfferSelection(initialRadio);
    }
  }

  // Event Handlers
  private handleRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.processOfferSelection(target);
    }
  }

  // Core Business Logic
  private processOfferSelection(selectedRadio: HTMLInputElement): void {
    const selectionData = this.extractSelectionData(selectedRadio);
    if (!selectionData) return;

    const { items, selectedItem } = selectionData;

    this.dispatchSelectionStartEvent(selectedRadio, items, selectedItem);
    this.updateQuantityState(items, selectedItem);
    this.saveToStorage();
    this.initializeCustomOptions(items);
    this.updateUIVisibility(selectedRadio);
    this.dispatchSelectionCompleteEvent(selectedRadio, items, selectedItem);
  }

  private extractSelectionData(selectedRadio: HTMLInputElement): { items: number; selectedItem: any } | null {
    const items = parseInt(selectedRadio.getAttribute(DATA_ATTRIBUTES.ITEMS) || '1');
    const selectedItemJson = selectedRadio.getAttribute(DATA_ATTRIBUTES.SELECTED_ITEM);
    
    if (!selectedItemJson) {
      console.warn('OfferSelector: No selected item data found');
      return null;
    }

    try {
      const selectedItem = JSON.parse(selectedItemJson);
      return { items, selectedItem };
    } catch (error) {
      console.error('OfferSelector: Invalid JSON in selected item data', error);
      return null;
    }
  }

  private updateQuantityState(items: number, selectedItem: any): void {
    this.quantitySubject.setState({
      quantity: items,
      selectedItem: selectedItem
    });
  }

  private saveToStorage(): void {
    if (!this.config.enableStorage) return;

    try {
      const updatedSelectedItem = this.quantitySubject.getState().selectedItem;
      localStorage.setItem(this.config.storageKey, JSON.stringify(updatedSelectedItem));
    } catch (error) {
      console.warn('OfferSelector: Failed to save to localStorage', error);
    }
  }

  private initializeCustomOptions(items: number): void {
    this.customOptionSubject.initializePanels(items);
  }

  // UI Update Methods
  private updateUIVisibility(selectedRadio: HTMLInputElement): void {
    this.hideAllRepeatedElements();
    this.showSelectedElements(selectedRadio);
  }

  private hideAllRepeatedElements(): void {
    if (!this.elements.repeatedElements) return;

    this.elements.repeatedElements.forEach(element => {
      element.classList.add(CSS_CLASSES.HIDDEN);
    });
  }

  private showSelectedElements(selectedRadio: HTMLInputElement): void {
    const optionId = selectedRadio.id;
    const targetElements = this.querySelector(`[${DATA_ATTRIBUTES.OPTION_ID}="${optionId}"]`) as HTMLElement;
    
    if (!targetElements) return;

    targetElements.classList.remove(CSS_CLASSES.HIDDEN);
    this.resetSelectionsInTarget(targetElements);
  }

  private resetSelectionsInTarget(targetElements: HTMLElement): void {
    const dynamicPanels = targetElements.querySelectorAll('classic-select-options');
    dynamicPanels.forEach(panel => {
      this.resetPanelSelections(panel as HTMLElement);
    });
  }

  private resetPanelSelections(panelContainer: HTMLElement): void {
    const componentWithAPI = panelContainer as any;
    
    if (componentWithAPI?.clearSelections && typeof componentWithAPI.clearSelections === 'function') {
      componentWithAPI.clearSelections();
    } else {
      this.resetSelectionsManually(panelContainer);
    }
  }

  private resetSelectionsManually(panelContainer: HTMLElement): void {
    this.resetSizeSelections(panelContainer);
    this.resetColorSelections(panelContainer);
    this.clearSelectedTexts(panelContainer);
  }

  private resetSizeSelections(container: HTMLElement): void {
    const sizeOptions = container.querySelectorAll<HTMLElement>(`[${DATA_ATTRIBUTES.SIZE_OPTION}]`);
    sizeOptions.forEach(option => {
      option.classList.remove(CSS_CLASSES.SELECTED_SIZE);
    });
  }

  private resetColorSelections(container: HTMLElement): void {
    const colorOptions = container.querySelectorAll<HTMLElement>(`[${DATA_ATTRIBUTES.COLOR_OPTION}]`);
    colorOptions.forEach(option => {
      option.classList.remove(CSS_CLASSES.SELECTED_COLOR);
    });
  }

  private clearSelectedTexts(container: HTMLElement): void {
    const selectedSizeText = container.querySelector<HTMLElement>(`[${DATA_ATTRIBUTES.SELECTED_SIZE}]`);
    const selectedColorText = container.querySelector<HTMLElement>(`[${DATA_ATTRIBUTES.SELECTED_COLOR}]`);
    
    if (selectedSizeText) selectedSizeText.textContent = '';
    if (selectedColorText) selectedColorText.textContent = '';
  }

  // Event Dispatching
  private dispatchSelectionStartEvent(radio: HTMLInputElement, items: number, selectedItem: any): void {
    this.dispatchCustomEvent(CUSTOM_EVENTS.SELECTION_START, {
      radioId: radio.id,
      items,
      selectedItem,
      previousSelection: this.quantitySubject.getState()
    });
  }

  private dispatchSelectionCompleteEvent(radio: HTMLInputElement, items: number, selectedItem: any): void {
    this.dispatchCustomEvent(CUSTOM_EVENTS.SELECTED, {
      radioId: radio.id,
      items,
      selectedItem,
      updatedState: this.quantitySubject.getState()
    });
  }

  private dispatchCustomEvent(eventName: string, detail: OfferSelectionDetail): void {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Public API
  public getCurrentSelection(): any {
    return this.quantitySubject.getState();
  }

  public selectOffer(radioId: string): boolean {
    if (!this.elements.radioButtons) return false;

    const targetRadio = Array.from(this.elements.radioButtons).find(radio => radio.id === radioId);
    
    if (targetRadio) {
      targetRadio.checked = true;
      this.processOfferSelection(targetRadio);
      return true;
    }
    return false;
  }

  public selectOfferByIndex(index: number): boolean {
    if (!this.elements.radioButtons || index < 0 || index >= this.elements.radioButtons.length) {
      return false;
    }

    const targetRadio = this.elements.radioButtons[index];
    targetRadio.checked = true;
    this.processOfferSelection(targetRadio);
    return true;
  }

  public clearStorage(): void {
    if (!this.config.enableStorage) return;

    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.warn('OfferSelector: Failed to clear localStorage', error);
    }
  }

  public setStorageEnabled(enabled: boolean): void {
    this.config.enableStorage = enabled;
    this.setAttribute(DATA_ATTRIBUTES.ENABLE_STORAGE, enabled.toString());
  }

  public getQuantitySubject(): QuantityOptionsSubject {
    return this.quantitySubject;
  }

  public getCustomOptionSubject(): CustomOptionSubject {
    return this.customOptionSubject;
  }
}

// Component Registration and Lifecycle Management
class OfferSelectorManager {
  private static readonly COMPONENT_NAME = 'offer-selector';

  public static initialize(): void {
    this.registerComponent();
    this.setupEventListeners();
  }

  private static registerComponent(): void {
    if (!customElements.get(this.COMPONENT_NAME)) {
      customElements.define(this.COMPONENT_NAME, OfferSelector);
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
    const undefinedSelectors = document.querySelectorAll(`${this.COMPONENT_NAME}:not(:defined)`);
    undefinedSelectors.forEach(selector => {
      if (selector instanceof OfferSelector) {
        selector.connectedCallback();
      }
    });
  }
}

// Initialize the component manager
OfferSelectorManager.initialize();

// Export for external use
export { OfferSelector, type OfferSelectorConfig, type OfferSelectionDetail };
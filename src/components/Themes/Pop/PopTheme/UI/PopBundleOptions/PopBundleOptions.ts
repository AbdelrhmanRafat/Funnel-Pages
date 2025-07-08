// OfferSelector.ts - Optimized Web Component for Bundle Option Selection

import { BundleOptionsSubject } from '../../../../../../lib/patterns/Observers/bundle-observer';
import { CustomOptionBundlesSubject } from '../../../../../../lib/patterns/Observers/custom-option-observer-bundles';

// Types and Interfaces
interface OfferSelectorElements {
  radioButtons: NodeListOf<HTMLInputElement> | null;
  bundleOptionsElements: NodeListOf<HTMLElement> | null;
}

interface OfferSelectionDetail {
  radioId: string;
  items: number;
  selectedOffer: any;
  previousSelection?: any;
  updatedState?: any;
}

interface OfferSelectorConfig {
  offerName: string;
  autoSelectFirst: boolean;
  enableStorage: boolean;
  storageKey: string;
}

// Constants - Removed unused constants
const CSS_CLASSES = {
  HIDDEN: 'hidden'
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
  BUNDLE_OPTIONS_ELEMENTS: 'data-offer-bundle-options-elements'
} as const;

const CUSTOM_EVENTS = {
  SELECTION_START: 'offer-selection-start',
  SELECTED: 'offer-selected'
} as const;

class OfferSelector extends HTMLElement {
  private elements: OfferSelectorElements = {
    radioButtons: null,
    bundleOptionsElements: null
  };
  
  private readonly bundleOptionsSubject: BundleOptionsSubject;
  private readonly customOptionBundlesSubject: CustomOptionBundlesSubject;
  private config: OfferSelectorConfig;

  constructor() {
    super();
    this.bundleOptionsSubject = BundleOptionsSubject.getInstance();
    this.customOptionBundlesSubject = CustomOptionBundlesSubject.getInstance();
    this.config = this.getDefaultConfig();
  }

  connectedCallback(): void {
    this.initialize();
  }

  disconnectedCallback(): void {
    this.cleanup();
  }

  // Configuration Methods
  private getDefaultConfig(): OfferSelectorConfig {
    return {
      offerName: 'qty',
      autoSelectFirst: true,
      enableStorage: true,
      storageKey: 'selectedOffer'
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
      bundleOptionsElements: this.querySelectorAll(`[${DATA_ATTRIBUTES.BUNDLE_OPTIONS_ELEMENTS}]`) as NodeListOf<HTMLElement>
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

  private cleanup(): void {
    if (!this.elements.radioButtons) return;

    this.elements.radioButtons.forEach(radio => {
      radio.removeEventListener('change', this.handleRadioChange.bind(this));
    });
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

    const { items, selectedOffer } = selectionData;

    this.dispatchSelectionStartEvent(selectedRadio, items, selectedOffer);
    this.updateBundleOptionsState(items, selectedOffer);
    this.initializeCustomOptionBundles(items);
    this.updateUIVisibility(selectedRadio);
    this.dispatchSelectionCompleteEvent(selectedRadio, items, selectedOffer);
  }

  private extractSelectionData(selectedRadio: HTMLInputElement): { items: number; selectedOffer: any } | null {
    const itemsAttr = selectedRadio.getAttribute(DATA_ATTRIBUTES.ITEMS);
    const items = itemsAttr ? parseInt(itemsAttr, 10) : 1;
    
    // Add validation
    if (isNaN(items) || items < 0) {
      console.warn('OfferSelector: Invalid items count');
      return null;
    }
    
    const selectedOfferJson = selectedRadio.getAttribute(DATA_ATTRIBUTES.SELECTED_ITEM);
    
    if (!selectedOfferJson) {
      console.warn('OfferSelector: No selected item data found');
      return null;
    }

    try {
      const selectedOffer = JSON.parse(selectedOfferJson);
      return { items, selectedOffer };
    } catch (error) {
      console.error('OfferSelector: Invalid JSON in selected item data', error);
      return null;
    }
  }

  private updateBundleOptionsState(items: number, selectedOffer: any): void {
    this.bundleOptionsSubject.setState({
      quantity: items,
      selectedOffer: selectedOffer
    });
  }

  

  private initializeCustomOptionBundles(items: number): void {
    this.customOptionBundlesSubject.initializeBundle(items);
  }

  // UI Update Methods - Simplified
  private updateUIVisibility(selectedRadio: HTMLInputElement): void {
    this.hideAllBundleOptionsElements();
    this.showSelectedElements(selectedRadio);
  }

  private hideAllBundleOptionsElements(): void {
    if (!this.elements.bundleOptionsElements) return;

    this.elements.bundleOptionsElements.forEach(element => {
      element.classList.add(CSS_CLASSES.HIDDEN);
    });
  }

  private showSelectedElements(selectedRadio: HTMLInputElement): void {
    const optionId = selectedRadio.id;
    const targetElements = this.querySelector(`[${DATA_ATTRIBUTES.OPTION_ID}="${optionId}"]`) as HTMLElement;
    
    if (!targetElements) return;

    targetElements.classList.remove(CSS_CLASSES.HIDDEN);
    this.resetBundleSelections(targetElements);
  }

  // Simplified reset method
  private resetBundleSelections(targetElements: HTMLElement): void {
    const bundlePanels = targetElements.querySelectorAll('pop-select-options-bundles');
    bundlePanels.forEach(panel => {
      const componentWithAPI = panel as any;
      
      // Try to use component's API first, fallback to manual reset
      if (componentWithAPI?.clearSelections && typeof componentWithAPI.clearSelections === 'function') {
        componentWithAPI.clearSelections();
      } else {
        // Simple manual reset - just remove any selection classes
        const selectedElements = panel.querySelectorAll('[class*="selected"]');
        selectedElements.forEach(el => {
          el.classList.remove(...Array.from(el.classList).filter(cls => cls.includes('selected')));
        });
      }
    });
  }

  // Event Dispatching
  private dispatchSelectionStartEvent(radio: HTMLInputElement, items: number, selectedOffer: any): void {
    this.dispatchCustomEvent(CUSTOM_EVENTS.SELECTION_START, {
      radioId: radio.id,
      items,
      selectedOffer,
      previousSelection: this.bundleOptionsSubject.getState()
    });
  }

  private dispatchSelectionCompleteEvent(radio: HTMLInputElement, items: number, selectedOffer: any): void {
    this.dispatchCustomEvent(CUSTOM_EVENTS.SELECTED, {
      radioId: radio.id,
      items,
      selectedOffer,
      updatedState: this.bundleOptionsSubject.getState()
    });
  }

  private dispatchCustomEvent(eventName: string, detail: OfferSelectionDetail): void {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // Public API
  public getCurrentSelection(): any {
    return this.bundleOptionsSubject.getState();
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

  

  public setStorageEnabled(enabled: boolean): void {
    this.config.enableStorage = enabled;
    this.setAttribute(DATA_ATTRIBUTES.ENABLE_STORAGE, enabled.toString());
  }

  public getBundleOptionsSubject(): BundleOptionsSubject {
    return this.bundleOptionsSubject;
  }

  public getCustomOptionBundlesSubject(): CustomOptionBundlesSubject {
    return this.customOptionBundlesSubject;
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
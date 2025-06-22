// ClassicQuantityOptions.ts - Web Component for Offer Selection

import { QuantityOptionsSubject } from '../../../../../../lib/patterns/Observers/quantity-observer';
import { ColorSizeOptionsSubject } from '../../../../../../lib/patterns/Observers/color-size-observer';

interface OfferSelectorElements {
  radioButtons: NodeListOf<HTMLInputElement> | null;
  repeatedElements: NodeListOf<HTMLElement> | null;
}

class OfferSelector extends HTMLElement {
  private elements: OfferSelectorElements = {
    radioButtons: null,
    repeatedElements: null
  };
  private quantitySubject: QuantityOptionsSubject;
  private colorSizeSubject: ColorSizeOptionsSubject;
  private offerName: string = 'qty';
  private autoSelectFirst: boolean = true;
  private enableStorage: boolean = true;
  private storageKey: string = 'selectedItem';

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.colorSizeSubject = ColorSizeOptionsSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
    this.initializeWithFirstSelected();
  }

  private initializeSettings(): void {
    this.offerName = this.getAttribute('data-offer-name') || 'qty';
    this.autoSelectFirst = this.getAttribute('data-offer-auto-select-first') !== 'false';
    this.enableStorage = this.getAttribute('data-offer-enable-storage') !== 'false';
    this.storageKey = this.getAttribute('data-offer-storage-key') || 'selectedItem';
  }

  private initializeElements(): void {
    this.elements = {
      radioButtons: this.querySelectorAll('[data-offer-radio]') as NodeListOf<HTMLInputElement>,
      repeatedElements: this.querySelectorAll('[data-offer-options-elements]') as NodeListOf<HTMLElement>
    };

    if (!this.elements.radioButtons?.length) {
      console.warn('Offer Selector: No radio buttons found');
      return;
    }
  }

  private setupEventListeners(): void {
    if (!this.elements.radioButtons) return;

    // Listen for radio button changes
    this.elements.radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          this.handleOfferSelection(target);
        }
      });
    });
  }

  private initializeWithFirstSelected(): void {
    if (!this.autoSelectFirst || !this.elements.radioButtons) return;

    // Find the initially checked radio button
    const initialRadio = Array.from(this.elements.radioButtons).find(radio => radio.checked);
    
    if (initialRadio) {
      this.handleOfferSelection(initialRadio);
    }
  }

  private handleOfferSelection(selectedRadio: HTMLInputElement): void {
    const items = parseInt(selectedRadio.getAttribute('data-offer-items') || '1');
    const selectedItemJson = selectedRadio.getAttribute('data-offer-selected-item');
    
    if (!selectedItemJson) {
      console.warn('Offer Selector: No selected item data found');
      return;
    }

    let selectedItem;
    try {
      selectedItem = JSON.parse(selectedItemJson);
    } catch (error) {
      console.error('Offer Selector: Invalid JSON in selected item data', error);
      return;
    }

    // Dispatch event before selection
    this.dispatchEvent(new CustomEvent('offer-selection-start', {
      detail: { 
        radioId: selectedRadio.id,
        items,
        selectedItem,
        previousSelection: this.quantitySubject.getState()
      }
    }));

    // Update quantity subject
    this.quantitySubject.setState({
      quantity: items,
      selectedItem: selectedItem
    });

    // Store in localStorage if enabled
    if (this.enableStorage) {
      const updatedSelectedItem = this.quantitySubject.getState().selectedItem;
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(updatedSelectedItem));
      } catch (error) {
        console.warn('Offer Selector: Failed to save to localStorage', error);
      }
    }

    // Initialize color/size panels for the selected quantity
    this.colorSizeSubject.initializePanels(items);

    // Update repeated elements visibility
    this.updateRepeatedElementsVisibility(selectedRadio);

    // Dispatch event after selection
    this.dispatchEvent(new CustomEvent('offer-selected', {
      detail: { 
        radioId: selectedRadio.id,
        items,
        selectedItem,
        updatedState: this.quantitySubject.getState()
      }
    }));
  }

  private updateRepeatedElementsVisibility(selectedRadio: HTMLInputElement): void {
    if (!this.elements.repeatedElements) return;

    // Hide all repeated elements
    this.elements.repeatedElements.forEach(element => {
      element.classList.add('hidden');
    });

    // Show the repeated elements for the selected option
    const optionId = selectedRadio.id;
    const targetRepeatedElements = this.querySelector(`[data-offer-option-id="${optionId}"]`) as HTMLElement;
    
    if (targetRepeatedElements) {
      targetRepeatedElements.classList.remove('hidden');

      // Find all classic dynamic panel containers and reset them
      const dynamicPanels = targetRepeatedElements.querySelectorAll('classic-select-options');
      dynamicPanels.forEach(panel => {
        this.resetAllSelectionsInPanel(panel as HTMLElement);
      });
    }
  }

  private resetAllSelectionsInPanel(panelContainer: HTMLElement): void {
    // Use the web component's public API to clear selections
    const selectOptionsComponent = panelContainer as any; // Cast to access custom methods
    
    if (selectOptionsComponent && typeof selectOptionsComponent.clearSelections === 'function') {
      selectOptionsComponent.clearSelections();
    } else {
      // Fallback to manual reset using updated selectors
      this.resetSelectionsManually(panelContainer);
    }
  }
  private resetSelectionsManually(panelContainer: HTMLElement): void {
    const selectedSizeClassName = "classic-selected-size-option";
    const selectedColorClassName = "classic-selected-color-option";

    // Reset size selections using new attributes
    const sizeOptions = panelContainer.querySelectorAll<HTMLElement>('[data-options-size-option]');
    sizeOptions.forEach(option => {
      option.classList.remove(selectedSizeClassName);
    });

    // Reset color selections using new attributes
    const colorOptions = panelContainer.querySelectorAll<HTMLElement>('[data-options-color-option]');
    colorOptions.forEach(option => {
      option.classList.remove(selectedColorClassName);
    });

    // Clear selected size text using new attributes
    const selectedSizeText = panelContainer.querySelector<HTMLElement>('[data-options-selected-size]');
    if (selectedSizeText) selectedSizeText.textContent = "";

    // Clear selected color text using new attributes
    const selectedColorText = panelContainer.querySelector<HTMLElement>('[data-options-selected-color]');
    if (selectedColorText) selectedColorText.textContent = "";
  }
  // Public API methods
  public getCurrentSelection(): any {
    return this.quantitySubject.getState();
  }
  public selectOffer(radioId: string): boolean {
    if (!this.elements.radioButtons) return false;

    const targetRadio = Array.from(this.elements.radioButtons).find(radio => radio.id === radioId);
    
    if (targetRadio) {
      targetRadio.checked = true;
      this.handleOfferSelection(targetRadio);
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
    this.handleOfferSelection(targetRadio);
    return true;
  }
  public clearStorage(): void {
    if (this.enableStorage) {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (error) {
        console.warn('Offer Selector: Failed to clear localStorage', error);
      }
    }
  }
  public enableStorageFeature(enable: boolean): void {
    this.enableStorage = enable;
    this.setAttribute('data-offer-enable-storage', enable.toString());
  }
  public getQuantitySubject(): QuantityOptionsSubject {
    return this.quantitySubject;
  }
  public getColorSizeSubject(): ColorSizeOptionsSubject {
    return this.colorSizeSubject;
  }
}
// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('offer-selector')) {
    customElements.define('offer-selector', OfferSelector);
  }
});
// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const offerSelectors = document.querySelectorAll('offer-selector:not(:defined)');
  offerSelectors.forEach(selector => {
    if (selector instanceof OfferSelector) {
      selector.connectedCallback();
    }
  });
});
// Export for potential external use
export { OfferSelector };
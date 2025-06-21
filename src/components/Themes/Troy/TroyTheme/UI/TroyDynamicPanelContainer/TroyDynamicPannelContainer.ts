// troyDynamicPannelContainer.ts - Web Component for Select Options with Observer Integration

import { QuantityOptionsSubject, type Observer, type Subject, type QuantityState } from "../../../../../../lib/patterns/Observer";
import { ColorSizeOptionsSubject, type ColorSizeState } from "../../../../../../lib/patterns/Observer";

interface SelectOptionsElements {
  panelIndexDisplay: HTMLElement | null;
  selectedColorDisplay: HTMLElement | null;
  selectedSizeDisplay: HTMLElement | null;
  sizeOptions: NodeListOf<HTMLElement> | null;
  colorOptions: NodeListOf<HTMLElement> | null;
}

interface SelectedOption {
  color?: string | null;
  size?: string | null;
}

class troySelectOptions extends HTMLElement implements Observer<QuantityState>, Observer<ColorSizeState> {
  private elements: SelectOptionsElements = {
    panelIndexDisplay: null,
    selectedColorDisplay: null,
    selectedSizeDisplay: null,
    sizeOptions: null as any,
    colorOptions: null as any
  };
  private panelIndex: number = 1;
  private allowMultipleSelection: boolean = false;
  private showSelectionIndicators: boolean = true;
  private enableAutoSelect: boolean = false;
  private selectedOptions: SelectedOption = {};
  
  // Observer pattern integration
  private quantitySubject: QuantityOptionsSubject;
  private colorSizeSubject: ColorSizeOptionsSubject;
  private isVisible: boolean = false;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.colorSizeSubject = ColorSizeOptionsSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
    this.attachToObservers();
    
    if (this.enableAutoSelect) {
      this.autoSelectFirstOptions();
    }
  }

  disconnectedCallback() {
    this.detachFromObservers();
  }

  private initializeSettings(): void {
    this.panelIndex = parseInt(this.getAttribute('data-options-panel-index') || '1');
    this.allowMultipleSelection = this.getAttribute('data-options-allow-multiple') === 'true';
    this.showSelectionIndicators = this.getAttribute('data-options-show-indicators') !== 'false';
    this.enableAutoSelect = this.getAttribute('data-options-auto-select') === 'true';
  }

  private initializeElements(): void {
    this.elements = {
      panelIndexDisplay: this.querySelector('[data-options-panel-index-display]') as HTMLElement,
      selectedColorDisplay: this.querySelector('[data-options-selected-color]') as HTMLElement,
      selectedSizeDisplay: this.querySelector('[data-options-selected-size]') as HTMLElement,
      sizeOptions: this.querySelectorAll('[data-options-size-option]') as NodeListOf<HTMLElement>,
      colorOptions: this.querySelectorAll('[data-options-color-option]') as NodeListOf<HTMLElement>
    };
  }

  private attachToObservers(): void {
    this.quantitySubject.attach(this);
    this.colorSizeSubject.attach(this);
  }

  private detachFromObservers(): void {
    this.quantitySubject.detach(this);
    this.colorSizeSubject.detach(this);
  }

  // Observer pattern implementation
  public update(subject: Subject<QuantityState | ColorSizeState>): void {
    if (subject instanceof QuantityOptionsSubject) {
      const state = subject.getState();
      // Handle quantity changes if needed
      this.handleQuantityUpdate(state);
    } else if (subject instanceof ColorSizeOptionsSubject) {
      const state = subject.getState();
      // Sync with external state changes
      this.handleColorSizeUpdate(state);
    }
  }

  private handleQuantityUpdate(state: QuantityState): void {
    // Handle quantity changes - could trigger panel visibility or resets
    this.dispatchEvent(new CustomEvent('quantity-updated', {
      detail: { panelIndex: this.panelIndex, quantityState: state }
    }));
  }

  private handleColorSizeUpdate(state: ColorSizeState): void {
    // Sync with external color/size state changes
    const panelOption = this.colorSizeSubject.getPanelOption(this.panelIndex);
    
    if (panelOption) {
      // Update internal state to match observer state
      this.selectedOptions = {
        color: panelOption.color,
        size: panelOption.size
      };

      // Update UI to reflect observer state
      this.syncUIWithObserverState(panelOption);
    }
  }

  private syncUIWithObserverState(panelOption: any): void {
    // Update displays
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = panelOption.color || '';
    }
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = panelOption.size || '';
    }

    // Update visual selections
    this.updateVisualSelections(panelOption);
  }

  private updateVisualSelections(panelOption: any): void {
    // Clear all selections first
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('selected-size-option');
      });
    }
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove('selected-color-option');
      });
    }

    // Apply selections based on observer state
    if (panelOption.size && this.elements.sizeOptions) {
      const sizeOption = Array.from(this.elements.sizeOptions).find(
        option => option.textContent?.trim() === panelOption.size
      );
      if (sizeOption) {
        sizeOption.classList.add('selected-size-option');
      }
    }

    if (panelOption.color && this.elements.colorOptions) {
      const colorOption = Array.from(this.elements.colorOptions).find(
        option => option.getAttribute('data-options-color-name') === panelOption.color
      );
      if (colorOption) {
        colorOption.classList.add('selected-color-option');
      }
    }
  }

  private setupEventListeners(): void {
    // Size option event listeners
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(sizeOption => {
        sizeOption.addEventListener('click', () => {
          this.handleSizeSelection(sizeOption);
        });
      });
    }

    // Color option event listeners
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(colorOption => {
        colorOption.addEventListener('click', () => {
          this.handleColorSelection(colorOption);
        });
      });
    }
  }

  private autoSelectFirstOptions(): void {
    // Auto-select first size option if available
    if (this.elements.sizeOptions && this.elements.sizeOptions.length > 0) {
      this.handleSizeSelection(this.elements.sizeOptions[0]);
    }

    // Auto-select first color option if available
    if (this.elements.colorOptions && this.elements.colorOptions.length > 0) {
      this.handleColorSelection(this.elements.colorOptions[0]);
    }
  }

  private handleSizeSelection(sizeOption: HTMLElement): void {
    const selectedSizeClassName = "selected-size-option";
    const sizeValue = sizeOption.getAttribute('data-options-size-value');
    const sizeDisplay = sizeOption.textContent?.trim() || null;

    // Dispatch event before selection
    this.dispatchEvent(new CustomEvent('size-selection-start', {
      detail: { 
        panelIndex: this.panelIndex, 
        sizeValue, 
        sizeDisplay,
        previousSize: this.selectedOptions.size 
      }
    }));

    // Update size display in indicators
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = sizeDisplay;
    }

    // Remove selection class from all size options (unless multiple selection is allowed)
    if (!this.allowMultipleSelection && this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove(selectedSizeClassName);
      });
    }

    // Toggle or add selection class to the clicked size
    if (this.allowMultipleSelection) {
      sizeOption.classList.toggle(selectedSizeClassName);
    } else {
      sizeOption.classList.add(selectedSizeClassName);
    }

    // Update internal state
    this.selectedOptions.size = sizeDisplay;

    // **UPDATE OBSERVER SUBJECT** - This is the key integration
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { size: sizeDisplay });

    // Dispatch event after selection
    this.dispatchEvent(new CustomEvent('size-selected', {
      detail: { 
        panelIndex: this.panelIndex, 
        sizeValue, 
        sizeDisplay,
        selectedOptions: { ...this.selectedOptions }
      }
    }));

    // Dispatch general selection change event
    this.dispatchSelectionChangeEvent();
  }

  private handleColorSelection(colorOption: HTMLElement): void {
    const selectedColorClassName = "selected-color-option";
    const colorName = colorOption.getAttribute('data-options-color-name');
    const colorHex = colorOption.getAttribute('data-options-color-hex');

    // Dispatch event before selection
    this.dispatchEvent(new CustomEvent('color-selection-start', {
      detail: { 
        panelIndex: this.panelIndex, 
        colorName, 
        colorHex,
        previousColor: this.selectedOptions.color 
      }
    }));

    // Update color display in indicators
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = colorName;
    }

    // Remove selection class from all color options (unless multiple selection is allowed)
    if (!this.allowMultipleSelection && this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove(selectedColorClassName);
      });
    }

    // Toggle or add selection class to the clicked color
    if (this.allowMultipleSelection) {
      colorOption.classList.toggle(selectedColorClassName);
    } else {
      colorOption.classList.add(selectedColorClassName);
    }

    // Update internal state
    this.selectedOptions.color = colorName;

    // **UPDATE OBSERVER SUBJECT** - This is the key integration
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { color: colorName });

    // Dispatch event after selection
    this.dispatchEvent(new CustomEvent('color-selected', {
      detail: { 
        panelIndex: this.panelIndex, 
        colorName, 
        colorHex,
        selectedOptions: { ...this.selectedOptions }
      }
    }));

    // Dispatch general selection change event
    this.dispatchSelectionChangeEvent();
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: {
        panelIndex: this.panelIndex,
        selectedOptions: { ...this.selectedOptions },
        isComplete: this.isSelectionComplete(),
        observerState: this.colorSizeSubject.getPanelOption(this.panelIndex)
      }
    }));
  }

  // Public API methods
  public getSelectedOptions(): SelectedOption {
    return { ...this.selectedOptions };
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  public isSelectionComplete(): boolean {
    const hasSize = !this.elements.sizeOptions || this.elements.sizeOptions.length === 0 || this.selectedOptions.size !== undefined;
    const hasColor = !this.elements.colorOptions || this.elements.colorOptions.length === 0 || this.selectedOptions.color !== undefined;
    return hasSize && hasColor;
  }

  public clearSelections(): void {
    // Clear size selections
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('selected-size-option');
      });
    }

    // Clear color selections
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove('selected-color-option');
      });
    }

    // Clear displays
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = '';
    }
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = '';
    }

    // Clear internal state
    this.selectedOptions = {};

    // **UPDATE OBSERVER SUBJECT** - Clear the observer state too
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { color: null, size: null });

    // Dispatch event
    this.dispatchEvent(new CustomEvent('selections-cleared', {
      detail: { panelIndex: this.panelIndex }
    }));
  }

  public selectSize(sizeValue: string): boolean {
    if (!this.elements.sizeOptions) return false;
    
    const sizeOption = Array.from(this.elements.sizeOptions).find(
      option => option.getAttribute('data-options-size-value') === sizeValue
    );
    
    if (sizeOption) {
      this.handleSizeSelection(sizeOption);
      return true;
    }
    return false;
  }

  public selectColor(colorName: string): boolean {
    if (!this.elements.colorOptions) return false;
    
    const colorOption = Array.from(this.elements.colorOptions).find(
      option => option.getAttribute('data-options-color-name') === colorName
    );
    
    if (colorOption) {
      this.handleColorSelection(colorOption);
      return true;
    }
    return false;
  }

  public enableMultipleSelection(enable: boolean): void {
    this.allowMultipleSelection = enable;
    this.setAttribute('data-options-allow-multiple', enable.toString());
  }

  // Observer integration public methods
  public getObserverState(): any {
    return this.colorSizeSubject.getPanelOption(this.panelIndex);
  }

  public syncWithObserver(): void {
    const panelOption = this.colorSizeSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.syncUIWithObserverState(panelOption);
    }
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
  if (!customElements.get('troy-select-options')) {
    customElements.define('troy-select-options', troySelectOptions);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const selectOptions = document.querySelectorAll('troy-select-options:not(:defined)');
  selectOptions.forEach(option => {
    if (option instanceof troySelectOptions) {
      option.connectedCallback();
    }
  });
});

export { troySelectOptions };
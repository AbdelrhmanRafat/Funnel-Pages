// ClassicDynamicPannelContainer.ts - Enhanced Web Component with Variant Filtering

// quantity-observer.ts
import { QuantityOptionsSubject } from "../../../../../../lib/patterns/Observers/quantity-observer";
import type { QuantityState } from "../../../../../../lib/patterns/Observers/quantity-observer";

// color-size-observer.ts
import { ColorSizeOptionsSubject } from "../../../../../../lib/patterns/Observers/color-size-observer";
import type { ColorSizeState } from "../../../../../../lib/patterns/Observers/color-size-observer";

import type { Observer, Subject } from "../../../../../../lib/patterns/Observers/base-observer";

interface SelectOptionsElements {
  panelIndexDisplay: HTMLElement | null;
  selectedDisplays: NodeListOf<HTMLElement> | null;
  allOptions: NodeListOf<HTMLElement> | null;
}

interface SelectedOption {
  [key: string]: string | null;
}

interface VariantAssociations {
  optionGroups: Array<{
    key: string;
    label: string;
    hasColors: boolean;
    values: string[];
    relatedKeys: string[];
  }>;
  associations: { [groupKey: string]: { [associationKey: string]: Array<{value: string, sku_id: number}> } };
}

class ClassicSelectOptions extends HTMLElement implements Observer<QuantityState>, Observer<ColorSizeState> {
  private elements: SelectOptionsElements = {
    panelIndexDisplay: null,
    selectedDisplays: null as any,
    allOptions: null as any
  };
  private panelIndex: number = 1;
  private allowMultipleSelection: boolean = false;
  private showSelectionIndicators: boolean = true;
  private enableAutoSelect: boolean = false;
  private selectedOptions: SelectedOption = {};
  private isVariant: boolean = false;
  private variantAssociations: VariantAssociations | null = null;
  private skuNoVariant: string = "";
  
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
    this.isVariant = this.getAttribute('data-options-is-variant') === 'true';
    this.skuNoVariant = this.getAttribute('data-sku-no-variant') || ''; // 🆕 Added
    
    // Parse variant associations
    const associationsData = this.getAttribute('data-variant-associations');
    if (associationsData && this.isVariant) {
      try {
        this.variantAssociations = JSON.parse(associationsData);
        console.log('Parsed variant associations:', this.variantAssociations);
      } catch (e) {
        console.error('Failed to parse variant associations:', e);
      }
    }
    
    // 🆕 Initialize sku_id for non-variant products
    if (!this.isVariant && this.skuNoVariant) {
      this.colorSizeSubject.updatePanelOption(this.panelIndex, { 
        sku_id: parseInt(this.skuNoVariant) 
      });
    }
  }

  private initializeElements(): void {
    this.elements = {
      panelIndexDisplay: this.querySelector('[data-options-panel-index-display]') as HTMLElement,
      selectedDisplays: this.querySelectorAll('[data-options-selected]') as NodeListOf<HTMLElement>,
      allOptions: this.querySelectorAll('[data-options-option]') as NodeListOf<HTMLElement>
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
      this.handleQuantityUpdate(state);
    } else if (subject instanceof ColorSizeOptionsSubject) {
      const state = subject.getState();
      this.handleColorSizeUpdate(state);
    }
  }

  private handleQuantityUpdate(state: QuantityState): void {
    this.dispatchEvent(new CustomEvent('quantity-updated', {
      detail: { panelIndex: this.panelIndex, quantityState: state }
    }));
  }

  private handleColorSizeUpdate(state: ColorSizeState): void {
    const panelOption = this.colorSizeSubject.getPanelOption(this.panelIndex);
    
    if (panelOption) {
      this.selectedOptions = {
        color: panelOption.color,
        size: panelOption.size
      };
      this.syncUIWithObserverState(panelOption);
    }
  }

  private syncUIWithObserverState(panelOption: any): void {
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = panelOption.color || '';
    }
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = panelOption.size || '';
    }
    this.updateVisualSelections(panelOption);
  }

  private updateVisualSelections(panelOption: any): void {
    // Clear all selections first
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('classic-selected-size-option');
      });
    }
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove('classic-selected-color-option');
      });
    }

    // Apply selections based on observer state
    if (panelOption.size && this.elements.sizeOptions) {
      const sizeOption = Array.from(this.elements.sizeOptions).find(
        option => option.getAttribute('data-options-size-value') === panelOption.size
      );
      if (sizeOption) {
        sizeOption.classList.add('classic-selected-size-option');
      }
    }

    if (panelOption.color && this.elements.colorOptions) {
      const colorOption = Array.from(this.elements.colorOptions).find(
        option => option.getAttribute('data-options-color-name') === panelOption.color
      );
      if (colorOption) {
        colorOption.classList.add('classic-selected-color-option');
      }
    }
  }

  private setupEventListeners(): void {
    // Generic option event listeners
    if (this.elements.allOptions) {
      this.elements.allOptions.forEach(option => {
        option.addEventListener('click', () => {
          this.handleOptionSelection(option);
        });
      });
    }
  }

  // Simplified methods for generic options
  public getPanelIndex(): number {
    return this.panelIndex;
  }

  public enableMultipleSelection(enable: boolean): void {
    this.allowMultipleSelection = enable;
    this.setAttribute('data-options-allow-multiple', enable.toString());
  }

  public getVariantAssociations(): VariantAssociations | null {
    return this.variantAssociations;
  }

  public getObserverState(): any {
    return this.colorSizeSubject.getPanelOption(this.panelIndex);
  }

  public getQuantitySubject(): QuantityOptionsSubject {
    return this.quantitySubject;
  }

  public getColorSizeSubject(): ColorSizeOptionsSubject {
    return this.colorSizeSubject;
  }ability(option: HTMLElement, isAvailable: boolean): void {
    if (isAvailable) {
      option.classList.remove('classic-option-disabled');
      option.classList.add('classic-option-available');
      option.style.pointerEvents = 'auto';
      option.style.opacity = '1';
    } else {
      option.classList.add('classic-option-disabled');
      option.classList.remove('classic-option-available');
      option.style.pointerEvents = 'none';
      option.style.opacity = '0.3';
      
      // Remove selection if it becomes unavailable
      option.classList.remove('classic-selected-size-option', 'classic-selected-color-option');
    }
  }

  private showAllOptions(): void {
    const allOptions = [
      ...(this.elements.sizeOptions ? Array.from(this.elements.sizeOptions) : []),
      ...(this.elements.colorOptions ? Array.from(this.elements.colorOptions) : [])
    ];
    
    allOptions.forEach(option => {
      this.toggleOptionAvailability(option, true);
    });
  }

  private handleOptionSelection(optionElement: HTMLElement): void {
    const groupKey = optionElement.getAttribute('data-options-group-key');
    const groupIndex = optionElement.getAttribute('data-options-group-index');
    const optionValue = optionElement.getAttribute('data-options-option-value');
    const optionHex = optionElement.getAttribute('data-options-option-hex');

    if (!groupKey || !optionValue) return;

    // Check if this option is currently available
    if (optionElement.classList.contains('classic-option-disabled')) {
      return;
    }

    console.log(`🎯 Option selected: ${groupKey} = ${optionValue}`);

    // Find sku_id for this selection
    let sku_id: number | null = null;
    if (this.isVariant && this.variantAssociations) {
      sku_id = this.findSkuForSelection(groupKey, optionValue);
    } else if (!this.isVariant && this.skuNoVariant) {
      sku_id = parseInt(this.skuNoVariant);
    }

    // Clear previous selection for this group if not allowing multiple
    if (!this.allowMultipleSelection) {
      this.clearGroupSelections(groupKey);
    }

    // Apply selection visual state
    if (optionHex) {
      optionElement.classList.add('classic-selected-color-option');
    } else {
      optionElement.classList.add('classic-selected-size-option');
    }

    // Update internal state
    this.selectedOptions[groupKey] = optionValue;

    // Update displays
    this.updateSelectedDisplays();

    // Update observer with current state
    const observerUpdate: any = { sku_id };
    Object.keys(this.selectedOptions).forEach(key => {
      observerUpdate[key] = this.selectedOptions[key];
    });
    this.colorSizeSubject.updatePanelOption(this.panelIndex, observerUpdate);

    console.log(`🆔 SKU ID set for panel ${this.panelIndex}:`, sku_id);
    console.log(`📊 Current selections:`, this.selectedOptions);

    // Dispatch events
    this.dispatchEvent(new CustomEvent('option-selected', {
      detail: { 
        panelIndex: this.panelIndex,
        groupKey,
        optionValue,
        optionHex,
        selectedOptions: { ...this.selectedOptions },
        sku_id
      }
    }));

    this.dispatchSelectionChangeEvent();
  }

  private findSkuForSelection(groupKey: string, optionValue: string): number | null {
    if (!this.variantAssociations || !this.selectedOptions) return null;

    // Look for associations from this group to other groups
    const groupAssociations = this.variantAssociations.associations[groupKey];
    if (!groupAssociations) return null;

    // Find other selected options
    const otherSelections = Object.entries(this.selectedOptions)
      .filter(([key]) => key !== groupKey);

    // Try to find sku_id by looking at associations
    for (const [otherKey, otherValue] of otherSelections) {
      const associationKey = `${optionValue}::${otherKey}`;
      const associatedOptions = groupAssociations[associationKey];
      
      if (associatedOptions) {
        const matchingOption = associatedOptions.find(opt => opt.value === otherValue);
        if (matchingOption) {
          return matchingOption.sku_id;
        }
      }
    }

    return null;
  }

  private clearGroupSelections(groupKey: string): void {
    if (this.elements.allOptions) {
      this.elements.allOptions.forEach(option => {
        const optionGroupKey = option.getAttribute('data-options-group-key');
        if (optionGroupKey === groupKey) {
          option.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
        }
      });
    }
  }

  private updateSelectedDisplays(): void {
    if (this.elements.selectedDisplays) {
      this.elements.selectedDisplays.forEach((display, index) => {
        const groupKey = this.variantAssociations?.optionGroups[index]?.key;
        if (groupKey && this.selectedOptions[groupKey]) {
          display.textContent = this.selectedOptions[groupKey];
        } else {
          display.textContent = '';
        }
      });
    }
  }

  private dispatchSelectionChangeEvent(): void {
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: {
        panelIndex: this.panelIndex,
        selectedOptions: { ...this.selectedOptions },
        isComplete: this.isSelectionComplete(),
        observerState: this.colorSizeSubject.getPanelOption(this.panelIndex),
        isVariant: this.isVariant,
        isValidCombination: this.selectedOptions.color && this.selectedOptions.size ? 
          this.isValidCombination(this.selectedOptions.color, this.selectedOptions.size) : true
      }
    }));
  }

  // Enhanced public API methods
  public getSelectedOptions(): SelectedOption {
    return { ...this.selectedOptions };
  }

  public getPanelIndex(): number {
    return this.panelIndex;
  }

  public isSelectionComplete(): boolean {
    const hasSize = !this.elements.sizeOptions || this.elements.sizeOptions.length === 0 || this.selectedOptions.size !== undefined;
    const hasColor = !this.elements.colorOptions || this.elements.colorOptions.length === 0 || this.selectedOptions.color !== undefined;
    const isValid = !this.isVariant || !this.selectedOptions.color || !this.selectedOptions.size || 
      this.isValidCombination(this.selectedOptions.color, this.selectedOptions.size);
    
    return hasSize && hasColor && isValid;
  }

  public clearSelections(): void {
    // Clear all option selections
    if (this.elements.allOptions) {
      this.elements.allOptions.forEach(option => {
        option.classList.remove('classic-selected-color-option', 'classic-selected-size-option');
      });
    }
    
    // Clear internal state
    this.selectedOptions = {};
    
    // Clear displays
    this.updateSelectedDisplays();

    this.colorSizeSubject.updatePanelOption(this.panelIndex, { sku_id: null });

    this.dispatchEvent(new CustomEvent('selections-cleared', {
      detail: { panelIndex: this.panelIndex }
    }));
  }

  public selectSize(sizeValue: string): boolean {
    if (!this.elements.sizeOptions) return false;
    
    const sizeOption = Array.from(this.elements.sizeOptions).find(
      option => option.getAttribute('data-options-size-value') === sizeValue
    );
    
    if (sizeOption && !sizeOption.classList.contains('classic-option-disabled')) {
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
    
    // In simplified logic, colors are always available, so no need to check disabled state
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

  // Enhanced variant-specific methods (updated for simplified logic)
  public getVariantAssociations(): VariantAssociations | null {
    return this.variantAssociations;
  }

  public getAvailableColorsForSize(size: string): string[] {
    // In simplified logic, all colors are always available regardless of size
    if (!this.isVariant || !this.variantAssociations) {
      return [];
    }
    return this.variantAssociations.allColors;
  }

  public getAvailableSizesForColor(color: string): string[] {
    if (!this.isVariant || !this.variantAssociations) {
      return this.variantAssociations?.allSizes || [];
    }
    return this.variantAssociations.colorToSizes[color] || [];
  }

  public isColorAvailable(color: string): boolean {
    // In simplified logic, all colors are always available
    return true;
  }

  public isSizeAvailable(size: string): boolean {
    if (!this.isVariant) return true;
    
    if (!this.selectedOptions.color) {
      return true; // All sizes available when no color is selected
    }
    
    return this.getAvailableSizesForColor(this.selectedOptions.color).includes(size);
  }

  public validateCurrentSelection(): boolean {
    if (!this.selectedOptions.color || !this.selectedOptions.size) {
      return true; // Partial selections are valid
    }
    
    return this.isValidCombination(this.selectedOptions.color, this.selectedOptions.size);
  }

  public getInvalidOptions(): { colors: string[], sizes: string[] } {
    if (!this.isVariant || !this.variantAssociations) {
      return { colors: [], sizes: [] };
    }

    // In simplified logic, colors are never invalid
    const invalidColors: string[] = [];
    const invalidSizes: string[] = [];

    // Only sizes can be invalid based on selected color
    if (this.selectedOptions.color) {
      const availableSizes = this.getAvailableSizesForColor(this.selectedOptions.color);
      invalidSizes.push(...this.variantAssociations.allSizes.filter(s => !availableSizes.includes(s)));
    }

    return { colors: invalidColors, sizes: invalidSizes };
  }

  // Observer integration public methods
  public getObserverState(): any {
    return this.colorSizeSubject.getPanelOption(this.panelIndex);
  }

  public syncWithObserver(): void {
    const panelOption = this.colorSizeSubject.getPanelOption(this.panelIndex);
    if (panelOption) {
      this.syncUIWithObserverState(panelOption);
      // Only filter sizes based on color in simplified logic
      this.filterAvailableOptions(panelOption.color);
    }
  }

  public getQuantitySubject(): QuantityOptionsSubject {
    return this.quantitySubject;
  }

  public getColorSizeSubject(): ColorSizeOptionsSubject {
    return this.colorSizeSubject;
  }

  // Debug methods (updated for simplified logic)
  public logVariantState(): void {
    if (!this.isVariant) {
      console.log('This is not a variant product');
      return;
    }

    console.group(`Panel ${this.panelIndex} Variant State (Simplified Logic)`);
    console.log('Selected Options:', this.selectedOptions);
    console.log('Variant Associations:', this.variantAssociations);
    console.log('Is Valid Combination:', this.validateCurrentSelection());
    
    console.log('All colors (always available):', this.variantAssociations?.allColors);
    
    if (this.selectedOptions.color) {
      console.log('Available sizes for selected color:', this.getAvailableSizesForColor(this.selectedOptions.color));
    } else {
      console.log('No color selected - all sizes available');
    }
    
    const invalid = this.getInvalidOptions();
    if (invalid.sizes.length) {
      console.log('Invalid sizes (based on color):', invalid.sizes);
    }
    
    console.groupEnd();
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
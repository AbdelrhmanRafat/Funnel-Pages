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
  selectedColorDisplay: HTMLElement | null;
  selectedSizeDisplay: HTMLElement | null;
  sizeOptions: NodeListOf<HTMLElement> | null;
  colorOptions: NodeListOf<HTMLElement> | null;
}

interface SelectedOption {
  color?: string | null;
  size?: string | null;
}

interface VariantAssociations {
  colorToSizes: { [color: string]: string[] };
  sizeToColors: { [size: string]: string[] };
  allColors: string[];
  allSizes: string[];
}

class ClassicSelectOptions extends HTMLElement implements Observer<QuantityState>, Observer<ColorSizeState> {
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
  private isVariant: boolean = false;
  private variantAssociations: VariantAssociations | null = null;
  
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
    // For variants, only auto-select if all combinations are valid
    if (this.isVariant && this.variantAssociations) {
      // Auto-select first available color-size pair
      const firstColor = this.variantAssociations.allColors[0];
      const firstSize = this.variantAssociations.allSizes[0];
      
      if (firstColor && firstSize && this.isValidCombination(firstColor, firstSize)) {
        this.selectColor(firstColor);
        this.selectSize(firstSize);
        return;
      }
    }
    
    // Fallback to original auto-select behavior
    if (this.elements.sizeOptions && this.elements.sizeOptions.length > 0) {
      this.handleSizeSelection(this.elements.sizeOptions[0]);
    }
    if (this.elements.colorOptions && this.elements.colorOptions.length > 0) {
      this.handleColorSelection(this.elements.colorOptions[0]);
    }
  }

  private isValidCombination(color: string, size: string): boolean {
    if (!this.isVariant || !this.variantAssociations) {
      return true; // Non-variants allow all combinations
    }
    
    const colorSizes = this.variantAssociations.colorToSizes[color] || [];
    const sizeColors = this.variantAssociations.sizeToColors[size] || [];
    
    return colorSizes.includes(size) && sizeColors.includes(color);
  }

  private filterAvailableOptions(selectedColor?: string): void {
    if (!this.isVariant || !this.variantAssociations) {
      return; // No filtering for non-variants
    }

    // Always keep all colors available (no color filtering)
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(colorOption => {
        this.toggleOptionAvailability(colorOption, true);
      });
    }

    // Filter sizes based on selected color only
    if (selectedColor && this.elements.sizeOptions) {
      const availableSizes = this.variantAssociations.colorToSizes[selectedColor] || [];
      
      this.elements.sizeOptions.forEach(sizeOption => {
        const sizeValue = sizeOption.getAttribute('data-options-size-value');
        const isAvailable = availableSizes.includes(sizeValue || '');
        
        this.toggleOptionAvailability(sizeOption, isAvailable);
      });
    } else {
      // If no color is selected, show all sizes as available
      if (this.elements.sizeOptions) {
        this.elements.sizeOptions.forEach(sizeOption => {
          this.toggleOptionAvailability(sizeOption, true);
        });
      }
    }
  }

  private toggleOptionAvailability(option: HTMLElement, isAvailable: boolean): void {
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

  private handleSizeSelection(sizeOption: HTMLElement): void {
    const selectedSizeClassName = "classic-selected-size-option";
    const sizeValue = sizeOption.getAttribute('data-options-size-value');
    const sizeDisplay = sizeOption.textContent?.trim() || null;

    // Check if this size is currently available
    if (sizeOption.classList.contains('classic-option-disabled')) {
      return; // Don't allow selection of disabled options
    }

    // Dispatch event before selection
    this.dispatchEvent(new CustomEvent('size-selection-start', {
      detail: { 
        panelIndex: this.panelIndex, 
        sizeValue, 
        sizeDisplay,
        previousSize: this.selectedOptions.size 
      }
    }));

    // Clear previous size selection if not allowing multiple
    if (!this.allowMultipleSelection && this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove(selectedSizeClassName);
      });
    }

    // Apply selection
    if (this.allowMultipleSelection) {
      sizeOption.classList.toggle(selectedSizeClassName);
    } else {
      sizeOption.classList.add(selectedSizeClassName);
    }

    // Update internal state
    this.selectedOptions.size = sizeDisplay;

    // Update displays
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = sizeDisplay;
    }

    // Size selection doesn't affect color filtering - colors always stay available
    // No need to call filterAvailableOptions here

    // Update observer subject
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { size: sizeDisplay });

    // Dispatch events
    this.dispatchEvent(new CustomEvent('size-selected', {
      detail: { 
        panelIndex: this.panelIndex, 
        sizeValue, 
        sizeDisplay,
        selectedOptions: { ...this.selectedOptions }
      }
    }));

    this.dispatchSelectionChangeEvent();
  }

  private handleColorSelection(colorOption: HTMLElement): void {
    const selectedColorClassName = "classic-selected-color-option";
    const colorName = colorOption.getAttribute('data-options-color-name');
    const colorHex = colorOption.getAttribute('data-options-color-hex');

    // Colors are always available in the simplified logic, no need to check disabled state

    // Dispatch event before selection
    this.dispatchEvent(new CustomEvent('color-selection-start', {
      detail: { 
        panelIndex: this.panelIndex, 
        colorName, 
        colorHex,
        previousColor: this.selectedOptions.color 
      }
    }));

    // Clear previous color selection if not allowing multiple
    if (!this.allowMultipleSelection && this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove(selectedColorClassName);
      });
    }

    // 🔄 NEW REQUIREMENT: Reset size selection when color changes
    if (this.selectedOptions.color !== colorName) {
      // Clear size selection UI
      this.clearSizeSelectionUI();
      
      // Reset size observer state
      this.resetSizeObserver();
      
      // Clear internal size state
      this.selectedOptions.size = null;
    }

    // Apply color selection
    if (this.allowMultipleSelection) {
      colorOption.classList.toggle(selectedColorClassName);
    } else {
      colorOption.classList.add(selectedColorClassName);
    }

    // Update internal state
    this.selectedOptions.color = colorName;

    // Update displays
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = colorName;
    }

    // Apply size filtering based on selected color (simplified - only colors affect sizes)
    this.filterAvailableOptions(colorName || undefined);

    // Update observer subject with new color and reset size
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { 
      color: colorName, 
      size: null // Reset size when color changes
    });

    // Dispatch events
    this.dispatchEvent(new CustomEvent('color-selected', {
      detail: { 
        panelIndex: this.panelIndex, 
        colorName, 
        colorHex,
        selectedOptions: { ...this.selectedOptions },
        availableSizes: this.isVariant && this.variantAssociations ? 
          this.variantAssociations.colorToSizes[colorName || ''] || [] : [],
        sizeReset: true // Indicate that size was reset
      }
    }));

    this.dispatchSelectionChangeEvent();
  }

  private clearColorSelection(): void {
    if (this.elements.colorOptions) {
      this.elements.colorOptions.forEach(option => {
        option.classList.remove('classic-selected-color-option');
      });
    }
    
    this.selectedOptions.color = null;
    
    if (this.elements.selectedColorDisplay) {
      this.elements.selectedColorDisplay.textContent = '';
    }
  }

  private clearSizeSelection(): void {
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('classic-selected-size-option');
      });
    }
    
    this.selectedOptions.size = null;
    
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = '';
    }
  }

  // 🔄 NEW: Enhanced size selection clearing for UI reset
  private clearSizeSelectionUI(): void {
    // Clear visual selection classes from all size options
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.forEach(option => {
        option.classList.remove('classic-selected-size-option');
      });
    }
    
    // Reset the selected size display to empty
    if (this.elements.selectedSizeDisplay) {
      this.elements.selectedSizeDisplay.textContent = '';
      // Also set the attribute directly for external systems
      this.elements.selectedSizeDisplay.setAttribute('data-options-selected-size', '');
    }
  }

  // 🔄 NEW: Reset size observer state
  private resetSizeObserver(): void {
    // Update the observer to clear the size selection for this panel
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { 
      size: null,
      // Keep the color as is, only reset size
      color: this.selectedOptions.color 
    });
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
    this.clearColorSelection();
    this.clearSizeSelectionUI(); // Use the enhanced UI clearing method
    
    // Show all options as available (simplified - all colors always available, all sizes available when no color selected)
    this.filterAvailableOptions(); // No parameters = reset to show all

    this.colorSizeSubject.updatePanelOption(this.panelIndex, { color: null, size: null });

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
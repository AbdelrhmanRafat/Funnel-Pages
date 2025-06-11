import { QuantityOptionsSubject, type Observer, type Subject, type QuantityState } from "../../../../../../lib/patterns/Observer";
import { ColorSizeOptionsSubject, type ColorSizeState } from "../../../../../../lib/patterns/Observer";
import { getTranslation } from "../../../../../../lib/utils/i18n/translations";

export class ClassicDynamicPannelContainer extends HTMLElement implements Observer<QuantityState>, Observer<ColorSizeState> {
  private quantitySubject: QuantityOptionsSubject;
  private colorSizeSubject: ColorSizeOptionsSubject;
  private panelIndex: number;
  private isVisible: boolean = false;
  private sizeOptions: NodeListOf<HTMLElement>;
  private colorOptions: NodeListOf<HTMLElement>;
  private sizeOptionClickHandlers: Map<HTMLElement, (event: MouseEvent) => void> = new Map();
  private colorOptionClickHandlers: Map<HTMLElement, (event: MouseEvent) => void> = new Map();

  // Define selection styles as static properties for consistency
  public static readonly SIZE_SELECTED_CLASSES = ['bg-blue-50', 'text-blue-700', 'border-blue-500'];
  public static readonly SIZE_UNSELECTED_CLASSES = ['text-gray-600', 'border-gray-300'];
  public static readonly COLOR_SELECTED_CLASSES = ['ring-2', 'ring-blue-500', 'ring-offset-2'];

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    const panelIndexElement = this.querySelector('[data-panel-index]');
    this.panelIndex = panelIndexElement ? parseInt(panelIndexElement.getAttribute('data-panel-index') || '1') : 1;

    // Initialize NodeLists
    this.sizeOptions = this.querySelectorAll('.size-option');
    this.colorOptions = this.querySelectorAll('.color-option');
  }

  connectedCallback() {
    this.quantitySubject.attach(this);
    this.colorSizeSubject.attach(this);
    this.addEventListeners();

    // Ensure UI is synced with current state on connection
    const currentOptionState = this.colorSizeSubject.getPanelOption(this.panelIndex);
    if (currentOptionState) {
      this.syncUIWithState(currentOptionState);
    } else {
      // If no state exists for this panel yet (e.g., initial load), clear styles.
      // The resetSelections() will also update the state to null.
      this.resetSelections();
    }
  }

  disconnectedCallback() {
    this.quantitySubject.detach(this);
    this.colorSizeSubject.detach(this);
    this.removeEventListeners();
  }

  private addEventListeners(): void {
    this.sizeOptions.forEach(sizeOption => {
      const handler = this.handleSizeSelection.bind(this, sizeOption);
      this.sizeOptionClickHandlers.set(sizeOption, handler);
      sizeOption.addEventListener('click', handler);
    });

    this.colorOptions.forEach(colorOption => {
      const handler = this.handleColorSelection.bind(this, colorOption);
      this.colorOptionClickHandlers.set(colorOption, handler);
      colorOption.addEventListener('click', handler);
    });
  }

  private removeEventListeners(): void {
    this.sizeOptions.forEach(sizeOption => {
      const handler = this.sizeOptionClickHandlers.get(sizeOption);
      if (handler) {
        sizeOption.removeEventListener('click', handler);
        this.sizeOptionClickHandlers.delete(sizeOption);
      }
    });

    this.colorOptions.forEach(colorOption => {
      const handler = this.colorOptionClickHandlers.get(colorOption);
      if (handler) {
        colorOption.removeEventListener('click', handler);
        this.colorOptionClickHandlers.delete(colorOption);
      }
    });
  }

  public update(subject: Subject<QuantityState | ColorSizeState>): void {
    if (subject instanceof QuantityOptionsSubject) {
      const state = subject.getState();
      const container = this.querySelector('#panels-container');
      if (container) {
        const shouldBeVisible = state.quantity >= this.panelIndex;
        
        if (shouldBeVisible !== this.isVisible) {
          this.isVisible = shouldBeVisible;
          if (shouldBeVisible) {
            container.classList.remove('hidden');
            // Always reset selections when becoming visible
            this.resetSelections();
          } else {
            container.classList.add('hidden');
          }
        }
      }
    } else if (subject instanceof ColorSizeOptionsSubject) {
      const state = subject.getState();
      const option = state.options.find((opt: { panelIndex: number; }) => opt.panelIndex === this.panelIndex);
      if (option) {
        this.syncUIWithState(option);
      }
    }
  }

  private clearAllSelectionStyles(): void {
    // Clear color selection styles
    this.colorOptions.forEach(option => {
      ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
        option.classList.remove(className);
      });
    });

    // Clear size selection styles
    this.sizeOptions.forEach(option => {
      ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
        option.classList.remove(className);
      });
      ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
        option.classList.add(className);
      });
    });
  }

  public resetSelections(): void {
    // Clear all selection styles
    this.clearAllSelectionStyles();

    // Reset display text
    const selectedColorElement = this.querySelector('.selected-color');
    const selectedSizeElement = this.querySelector('.selected-size');
    
    if (selectedColorElement) {
      selectedColorElement.textContent = getTranslation('dynamicPanel.notSelected');
    }
    if (selectedSizeElement) {
      selectedSizeElement.textContent = getTranslation('dynamicPanel.notSelected');
    }

    // Update the state to null
    this.colorSizeSubject.updatePanelOption(this.panelIndex, {
      color: null,
      size: null
    });
  }

  private syncUIWithState(option: { color: string | null; size: string | null }): void {
    // Clear all existing selection styles first
    this.clearAllSelectionStyles();

    // Update display text
    const selectedColorElement = this.querySelector('.selected-color');
    const selectedSizeElement = this.querySelector('.selected-size');

    if (selectedColorElement) {
      selectedColorElement.textContent = option.color || getTranslation('dynamicPanel.notSelected');
    }
    if (selectedSizeElement) {
      selectedSizeElement.textContent = option.size || getTranslation('dynamicPanel.notSelected');
    }

    // Apply current selections
    if (option.color) {
      const colorOption = this.querySelector(`.color-option[data-name="${option.color}"]`);
      if (colorOption) {
        ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
          colorOption.classList.add(className);
        });
      }
    }

    if (option.size) {
      const sizeOption = this.querySelector(`.size-option[data-value="${option.size}"]`);
      if (sizeOption) {
        ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
          sizeOption.classList.remove(className);
        });
        ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
          sizeOption.classList.add(className);
        });
      }
    }
  }

  private handleSizeSelection(sizeOption: HTMLElement): void {
    const size = sizeOption.textContent || null;
    
    // Immediately apply visual feedback
    this.sizeOptions.forEach(option => {
        ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
            option.classList.remove(className);
        });
        ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
            option.classList.add(className);
        });
    });
    ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
        sizeOption.classList.remove(className);
    });
    ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
        sizeOption.classList.add(className);
    });

    // Update the state
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { size });
  }

  private handleColorSelection(colorOption: HTMLElement): void {
    const color = colorOption.getAttribute('data-name') || null;
    
    // Immediately apply visual feedback
    this.colorOptions.forEach(option => {
        ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
            option.classList.remove(className);
        });
    });
    ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
        colorOption.classList.add(className);
    });

    // Update the state
    this.colorSizeSubject.updatePanelOption(this.panelIndex, { color });
  }
}

customElements.define('classic-dynamic-panel-container', ClassicDynamicPannelContainer);

// Handle size selection
function handleSizeSelection(panel: Element, sizeOption: Element) {
    const panelIndex = parseInt(panel.querySelector('[data-panel-index]')?.getAttribute('data-panel-index') || '1');
    const size = sizeOption.textContent || null;
    
    // Immediately apply visual feedback
    panel.querySelectorAll('.size-option').forEach(option => {
        ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
            option.classList.remove(className);
        });
        ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
            option.classList.add(className);
        });
    });
    ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
        sizeOption.classList.remove(className);
    });
    ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
        sizeOption.classList.add(className);
    });

    // Update the state
    const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    colorSizeSubject.updatePanelOption(panelIndex, { size });
}

// Handle color selection
function handleColorSelection(panel: Element, colorOption: Element) {
    const panelIndex = parseInt(panel.querySelector('[data-panel-index]')?.getAttribute('data-panel-index') || '1');
    const color = colorOption.getAttribute('data-name') || null;
    
    // Immediately apply visual feedback
    panel.querySelectorAll('.color-option').forEach(option => {
        ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
            option.classList.remove(className);
        });
    });
    ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
        colorOption.classList.add(className);
    });

    // Update the state
    const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    colorSizeSubject.updatePanelOption(panelIndex, { color });
}

// Initialize event listeners for each panel
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.option-panel').forEach(panel => {
        // Size selection
        panel.querySelectorAll('.size-option').forEach(sizeOption => {
            sizeOption.addEventListener('click', () => {
                handleSizeSelection(panel, sizeOption);
            });
        });

        // Color selection
        panel.querySelectorAll('.color-option').forEach(colorOption => {
            colorOption.addEventListener('click', () => {
                handleColorSelection(panel, colorOption);
            });
        });
    });
});
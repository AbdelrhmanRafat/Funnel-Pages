import { QuantityOptionsSubject, type Observer, type Subject, type QuantityState } from "../../../../../../lib/patterns/Observer";
import { ColorSizeOptionsSubject, type ColorSizeState } from "../../../../../../lib/patterns/Observer";

export class TroyDynamicPannelContainer extends HTMLElement implements Observer<QuantityState>, Observer<ColorSizeState> {
  private quantitySubject: QuantityOptionsSubject;
  private colorSizeSubject: ColorSizeOptionsSubject;
  private panelIndex: number;
  private isVisible: boolean = false;
  private sizeOptions: NodeListOf<HTMLElement>;
  private colorOptions: NodeListOf<HTMLElement>;
  private sizeOptionClickHandlers: Map<HTMLElement, (event: MouseEvent) => void> = new Map();
  private colorOptionClickHandlers: Map<HTMLElement, (event: MouseEvent) => void> = new Map();

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

  public update(subject: Subject<QuantityState | ColorSizeState>): void {
    if (subject instanceof QuantityOptionsSubject) {
      const state = subject.getState();

    } else if (subject instanceof ColorSizeOptionsSubject) {
      const state = subject.getState();
    }
  }
}
function handleSizeSelection(panel: Element, sizeOption: Element) {
  const selectedSizeClassName = "selected-size-option";
  const panelIndex = parseInt(panel.querySelector('[data-panel-index]')?.getAttribute('data-panel-index') || '1');
  const size = sizeOption.textContent || null;

  // Update size display
  const selectedSize = panel.querySelector<HTMLElement>('.selected-size');
  if (selectedSize) selectedSize.textContent = size;

  // Remove selection class from all size options
  panel.querySelectorAll('.size-option').forEach(option => {
    option.classList.remove(selectedSizeClassName);
  });

  // Add selection class to the clicked size
  sizeOption.classList.add(selectedSizeClassName);

  // Update internal state
  const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
  colorSizeSubject.updatePanelOption(panelIndex, { size });
}

function handleColorSelection(panel: Element, colorOption: Element) {
  const selectedColorClassName = "selected-color-option";
  const panelIndex = parseInt(panel.querySelector('[data-panel-index]')?.getAttribute('data-panel-index') || '1');
  const color = colorOption.getAttribute('data-name') || null;

  // Update color display
  const selectedColor = panel.querySelector<HTMLElement>('.selected-color');
  if (selectedColor) selectedColor.textContent = color;

  // Remove selection class from all color options
  panel.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove(selectedColorClassName);
  });

  // Add selection class to the clicked color
  colorOption.classList.add(selectedColorClassName);

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
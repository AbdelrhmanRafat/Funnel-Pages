import type { BlockData } from "../../../../../../lib/api/types";
import { QuantityOptionsSubject } from '../../../../../../lib/patterns/Observer';
import { ColorSizeOptionsSubject } from '../../../../../../lib/patterns/ColorSizeOptionsState';

// Initialize the quantity options subject
const quantitySubject = QuantityOptionsSubject.getInstance();
const colorSizeSubject = ColorSizeOptionsSubject.getInstance();

// Function to handle repeated elements visibility
function updateRepeatedElementsVisibility(selectedRadio: HTMLInputElement) {
  // Hide all repeated elements
  document.querySelectorAll('.repeated-elements').forEach(element => {
    element.classList.add('hidden');
  });

  // Show the repeated elements for the selected option
  const optionId = selectedRadio.id;
  const repeatedElements = document.querySelector(`.repeated-elements[data-option-id="${optionId}"]`);
  if (repeatedElements) {
    repeatedElements.classList.remove('hidden');
  }
}

// Initialize with the first selected item
document.addEventListener('DOMContentLoaded', () => {
    const initialRadio = document.querySelector('input[type="radio"]:checked');
    if (initialRadio) {
        const items = parseInt(initialRadio.getAttribute('data-items') || '1');
        const selectedItem = initialRadio.getAttribute('selected-item');
        if (selectedItem) {
            quantitySubject.setState({
                quantity: items,
                selectedItem: JSON.parse(selectedItem)
            });
            colorSizeSubject.initializePanels(items);
            updateRepeatedElementsVisibility(initialRadio as HTMLInputElement);
        }
    }

    // Listen for radio button changes
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const items = parseInt(target.getAttribute('data-items') || '1');
            const selectedItem = target.getAttribute('selected-item');
            if (selectedItem) {
                quantitySubject.setState({
                    quantity: items,
                    selectedItem: JSON.parse(selectedItem)
                });
                colorSizeSubject.initializePanels(items);
                updateRepeatedElementsVisibility(target);
            }
        });
    });
});

// Export the subjects for use in other components
export { quantitySubject, colorSizeSubject };

class ClassicQuantityOptions extends HTMLElement {
  private radioButtons: NodeListOf<HTMLInputElement>;
  private repeatedElements: NodeListOf<HTMLElement>;

  constructor() {
    super();
    this.radioButtons = this.querySelectorAll('input[type="radio"]');
    this.repeatedElements = this.querySelectorAll('.repeated-elements');
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.radioButtons.forEach((radio) => {
      radio.addEventListener('change', (e) => this.handleRadioChange(e));
    });
  }

  private handleRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedItem = JSON.parse(target.getAttribute('selected-item') || '{}');
    const items = parseInt(target.getAttribute('data-items') || '1');

    // Hide all repeated elements first
    this.repeatedElements.forEach((element) => {
      element.classList.add('hidden');
    });

    // Show the selected option's repeated elements
    const selectedElement = this.querySelector(`.repeated-elements[data-option-id="${target.id}"]`);
    if (selectedElement) {
      selectedElement.classList.remove('hidden');
    }

    // Update the subjects state
    quantitySubject.setState({
      quantity: items,
      selectedItem
    });
    colorSizeSubject.initializePanels(items);
  }
}

customElements.define('classic-quantity-options', ClassicQuantityOptions);
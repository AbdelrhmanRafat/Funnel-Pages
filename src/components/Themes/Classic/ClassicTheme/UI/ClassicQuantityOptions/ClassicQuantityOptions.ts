import { QuantityOptionsSubject, ColorSizeOptionsSubject } from '../../../../../../lib/patterns/Observer';
import { getTranslation } from '../../../../../../lib/utils/i18n/translations';
import { ClassicDynamicPannelContainer } from '../ClassicDynamicPanelContainer/ClassicDynamicPannelContainer';

// Initialize the quantity options subject
const quantitySubject = QuantityOptionsSubject.getInstance();
// Initialize the Color Size options subject
const colorSizeSubject = ColorSizeOptionsSubject.getInstance();

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

    // Find all classic dynamic panel containers and reset them
    const dynamicPanels = repeatedElements.querySelectorAll<HTMLElement>('.classic-pannel-container');
    dynamicPanels.forEach(panel => {
      resetAllSelectionsInPanel(panel);
    });
  }
}


function resetAllSelectionsInPanel(panelContainer: HTMLElement): void {
  // Reset size selections
  const sizeOptions = panelContainer.querySelectorAll<HTMLElement>('.size-option');
  sizeOptions.forEach(option => {
    ClassicDynamicPannelContainer.SIZE_SELECTED_CLASSES.forEach(className => {
      option.classList.remove(className);
    });
    ClassicDynamicPannelContainer.SIZE_UNSELECTED_CLASSES.forEach(className => {
      option.classList.add(className);
    });
  });

  // Reset color selections
  const colorOptions = panelContainer.querySelectorAll<HTMLElement>('.color-option');
  colorOptions.forEach(option => {
    ClassicDynamicPannelContainer.COLOR_SELECTED_CLASSES.forEach(className => {
      option.classList.remove(className);
    });
  });

  // Reset selected text if needed
  const selectedSize = panelContainer.querySelector<HTMLElement>('.selected-size');
  if (selectedSize) selectedSize.textContent = getTranslation('dynamicPanel.notSelected');

  const selectedColor = panelContainer.querySelector<HTMLElement>('.selected-color');
  if (selectedColor) selectedColor.textContent = getTranslation('dynamicPanel.notSelected');
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
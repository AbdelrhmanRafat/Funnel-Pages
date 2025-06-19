import { QuantityOptionsSubject, ColorSizeOptionsSubject } from '../../../../../../lib/patterns/Observer';

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

    // Find all nasa dynamic panel containers and reset them
    const dynamicPanels = repeatedElements.querySelectorAll<HTMLElement>('.nasa-pannel-container');
    dynamicPanels.forEach(panel => {
      resetAllSelectionsInPanel(panel);
    });
  }
}


function resetAllSelectionsInPanel(panelContainer: HTMLElement): void {
  const selectedSizeClassName = "selected-size-option";
  const selectedColorClassName = "selected-color-option";

  // Reset size selections
  const sizeOptions = panelContainer.querySelectorAll<HTMLElement>('.size-option');
  sizeOptions.forEach(option => {
    option.classList.remove(selectedSizeClassName);
  });

  // Reset color selections
  const colorOptions = panelContainer.querySelectorAll<HTMLElement>('.color-option');
  colorOptions.forEach(option => {
    option.classList.remove(selectedColorClassName);
  });

  // Clear selected size text
  const selectedSizeText = panelContainer.querySelector<HTMLElement>('.selected-size');
  if (selectedSizeText) selectedSizeText.textContent = "";

  // Clear selected color text (make sure it refers to a display element, not the option)
  const selectedColorText = panelContainer.querySelector<HTMLElement>('.selected-color');
  if (selectedColorText) selectedColorText.textContent = "";
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
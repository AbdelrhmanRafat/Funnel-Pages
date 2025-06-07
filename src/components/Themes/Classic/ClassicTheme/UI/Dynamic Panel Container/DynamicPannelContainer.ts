/**
 * ClassicThemeProductFunnel.ts
 * 
 * This file handles the product funnel functionality for the Classic Theme.
 * It can be expanded to include upsell/cross-sell features, product selection, etc.
 */

// Define types for price structure

export function initClassicThemeProductFunnel(): void {
  // Quantity selection functionality
  const quantityLabels: NodeListOf<HTMLLabelElement> = document.querySelectorAll('label[for^="qty"]');
  const quantityInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="qty"]');
  const productPrice: HTMLElement | null = document.getElementById('productPrice');
  const totalPrice: HTMLElement | null = document.getElementById('totalPrice');
  const panelsContainer: HTMLElement | null = document.getElementById('panels-container');
  const nextBtn: HTMLElement | null = document.getElementById('nextBtn');
  const prevBtn: HTMLElement | null = document.getElementById('prevBtn');

  // Guard clause to prevent errors if elements don't exist
  if (!productPrice || !totalPrice || !panelsContainer) {
    console.error('Required DOM elements not found');
    return;
  }

  function addPanelEventListeners(): void {
    // Size selection
    const sizeOptions: NodeListOf<Element> = document.querySelectorAll('.size-option');
    sizeOptions.forEach((option: Element) => {
      option.addEventListener('click', function(this: HTMLElement) {
        const panel = this.closest('.option-panel');
        if (!panel) return;

        // Update UI for sizes
        panel.querySelectorAll('.size-option').forEach(opt => {
          opt.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-300');
          opt.classList.add('border-gray-300', 'text-gray-600');
        });
        
        this.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-300');
        this.classList.remove('border-gray-300', 'text-gray-600');

        // Update selected size display
        const sizeDisplay = panel.querySelector('.selected-size');
        if (sizeDisplay) sizeDisplay.textContent = this.textContent || '';
      });
    });

    // Color selection
    const colorOptions: NodeListOf<Element> = document.querySelectorAll('.color-option');
    colorOptions.forEach((option: Element) => {
      option.addEventListener('click', function(this: HTMLElement) {
        const panel = this.closest('.option-panel');
        if (!panel) return;

        // Update UI for colors
        panel.querySelectorAll('.color-option div').forEach(colorDiv => {
          colorDiv.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        });
        
        const colorDiv = this.querySelector('div');
        if (colorDiv) colorDiv.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');

        // Update selected color display
        const colorName = this.querySelector('span')?.textContent || '';
        const colorDisplay = panel.querySelector('.selected-color');
        if (colorDisplay) colorDisplay.textContent = colorName;
      });
    });
  }

  quantityInputs.forEach((input: HTMLInputElement) => {
    input.addEventListener('change', function(this: HTMLInputElement) {
      // Update visual selection
      quantityLabels.forEach((label: HTMLLabelElement) => {
        label.classList.remove('selected');
      });
      
      const parentElement = this.parentElement;
      if (parentElement) {
        parentElement.classList.add('selected');
      }

      // Get the selected quantity from the data attribute
      const selectedQuantity = parseInt(this.getAttribute('data-items') || '1', 10);
      
      // Show/hide panels based on quantity
      const panels = panelsContainer.querySelectorAll('.option-panel');
      panels.forEach((panel, index) => {
        if (index < selectedQuantity) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // Initialize event listeners for panels
  addPanelEventListeners();

  // Add keyboard navigation for gallery
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && nextBtn) {
      nextBtn.click();
    } else if (e.key === 'ArrowRight' && prevBtn) {
      prevBtn.click();
    }
  });
}

// Initialize the funnel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initClassicThemeProductFunnel();
});
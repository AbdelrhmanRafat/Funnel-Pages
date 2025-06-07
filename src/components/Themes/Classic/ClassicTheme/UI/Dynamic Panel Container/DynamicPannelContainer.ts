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

  const prices: PriceMap = {
    'qty1': { product: 329.00, total: 369.00 },
    'qty2': { product: 275.00, total: 315.00 },
    'qty3': { product: 214.90, total: 254.90 }
  };

  // Function to create a new panel
  function createPanel(index: number): string {
    return `
      <div class="option-panel bg-white p-8 rounded-3xl shadow-xl space-y-8 border border-blue-100 fade-in">
          <!-- Header -->
          <div class="flex justify-between items-center">
              <p class="text-blue-700 font-bold text-xl">اختر الخيارات للمنتج ${index === 0 ? 'الأول' : index === 1 ? 'الثاني' : 'الثالث'}</p>
              <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-full shadow-sm">
                      <span class="text-sm text-gray-700 font-medium">أحمر</span>
                      <div class="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-inner"></div>
                  </div>
                  <div class="flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-full shadow-sm">
                      <span class="text-sm text-gray-700 font-medium">XXL</span>
                  </div>
              </div>
          </div>
          <!-- Size Selection -->
          <div class="space-y-3">
              <p class="text-lg font-semibold text-gray-700">المقاس:</p>
              <div class="flex gap-4">
                  <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                      XL
                  </div>
                  <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                      L
                  </div>
                  <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                      M
                  </div>
              </div>
          </div>
          <!-- Color Selection -->
          <div class="space-y-3">
              <p class="text-lg font-semibold text-gray-700">اللون:</p>
              <div class="flex gap-6 flex-wrap">
                  <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                      <div class="w-9 h-9 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
                      <span class="text-sm text-gray-600">أحمر</span>
                  </div>
                  <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                      <div class="w-9 h-9 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                      <span class="text-sm text-gray-600">أزرق</span>
                  </div>
                  <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                      <div class="w-9 h-9 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
                      <span class="text-sm text-gray-600">أخضر</span>
                  </div>
                  <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                      <div class="w-9 h-9 rounded-full bg-yellow-500 border-2 border-white shadow-md"></div>
                      <span class="text-sm text-gray-600">أصفر</span>
                  </div>
              </div>
          </div>
      </div>
  `;
  }

  // Function to update panels based on quantity
  function updatePanels(quantity: number): void {
    // Clear existing panels
    panelsContainer.innerHTML = '';

    // Create panels based on quantity
    for (let i = 0; i < quantity; i++) {
      panelsContainer.innerHTML += createPanel(i);
    }

    // Add event listeners to new panels
    addPanelEventListeners();
  }

  // Function to add event listeners to panel elements
  function addPanelEventListeners(): void {
    // Size selection
    const sizeOptions: NodeListOf<Element> = document.querySelectorAll('.size-option');
    sizeOptions.forEach((option: Element) => {
      option.addEventListener('click', function(this: Element) {
        // Remove active class from siblings
        const siblings: NodeListOf<Element> = this.parentElement?.querySelectorAll('.size-option') || document.createDocumentFragment().querySelectorAll('*');
        siblings.forEach((sibling: Element) => {
          sibling.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-300');
          sibling.classList.add('text-gray-600', 'border-gray-300');
        });

        // Add active class to clicked option
        this.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-300');
        this.classList.remove('text-gray-600', 'border-gray-300');

        // Update header display
        const panel: Element | null = this.closest('.option-panel');
        if (panel) {
          const sizeDisplay: Element | null = panel.querySelector('.bg-blue-100:last-child span');
          if (sizeDisplay && this.textContent) {
            sizeDisplay.textContent = this.textContent.trim();
          }
        }
      });
    });

    // Color selection
    const colorOptions: NodeListOf<Element> = document.querySelectorAll('.color-option');
    colorOptions.forEach((option: Element) => {
      option.addEventListener('click', function(this: Element) {
        // Remove active class from siblings
        const siblings: NodeListOf<Element> = this.parentElement?.querySelectorAll('.color-option') || document.createDocumentFragment().querySelectorAll('*');
        siblings.forEach((sibling: Element) => {
          const colorDiv: Element | null = sibling.querySelector('div');
          if (colorDiv) {
            colorDiv.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }
        });

        // Add active class to clicked option
        const colorDiv: Element | null = this.querySelector('div');
        if (colorDiv) {
          colorDiv.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        }

        // Update header display
        const panel: Element | null = this.closest('.option-panel');
        if (panel) {
          const colorDisplay: Element | null = panel.querySelector('.bg-blue-100:first-child span');
          const colorNameElement: Element | null = this.querySelector('span');
          if (colorDisplay && colorNameElement && colorNameElement.textContent) {
            colorDisplay.textContent = colorNameElement.textContent;
          }

          // Update color indicator
          const colorIndicator: Element | null = panel.querySelector('.bg-blue-100:first-child div');
          if (colorDiv && colorIndicator) {
            const selectedColorMatch: RegExpMatchArray | null = colorDiv.className.match(/bg-(\w+)-500/);
            if (selectedColorMatch) {
              colorIndicator.className = `w-3.5 h-3.5 rounded-full bg-${selectedColorMatch[1]}-500 border border-white shadow-inner`;
            }
          }
        }
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

      // Update prices
      const selectedPrices: ProductPrice | undefined = prices[this.id];
      if (selectedPrices) {
        productPrice.textContent = `${selectedPrices.product.toFixed(2)} ج.م`;
        totalPrice.textContent = `${selectedPrices.total.toFixed(2)} ج.م`;

        // Update panels based on quantity
        const quantity: number = parseInt(this.id.replace('qty', ''), 10);
        updatePanels(quantity);
      }
    });
  });

  // Initialize panels for default selection (qty1)
  updatePanels(1);
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
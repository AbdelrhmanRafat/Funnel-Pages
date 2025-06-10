import type { BlockData } from "../../../../../../lib/api/types";

  // Initialize with the first selected item
  const initialRadio = document.querySelector('input[type="radio"]:checked');
  if (initialRadio) {
    const items = parseInt(initialRadio.getAttribute('data-items') || '1');
    document.dispatchEvent(new CustomEvent('quantity-change', { 
      detail: { items },
      bubbles: true 
    }));
  }

  // Listen for radio button changes
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const items = parseInt(target.getAttribute('data-items') || '1');
      const selectedItem = target.getAttribute('selected-item');
      document.dispatchEvent(new CustomEvent('quantity-change', { 
        detail: { items },
        bubbles: true 
      }));
      document.dispatchEvent(new CustomEvent('item-change', { 
        detail: { selectedItem },
        bubbles: true 
      }));
    });
  });
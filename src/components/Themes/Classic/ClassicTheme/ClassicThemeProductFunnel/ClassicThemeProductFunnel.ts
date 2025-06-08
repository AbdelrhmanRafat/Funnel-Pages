/*
This TypeScript file is intended for client-side JavaScript functionalities
associated with the ClassicThemeProductFunnel.astro component.

Currently, this file is empty. This might indicate that the interactivity
for product options, quantity selection, and price updates is handled by
more specific child components (like QuantityOptions.ts or DynamicPanelContainer.ts)
or directly within the .astro file's <script> tags if the logic is simple.

If more complex client-side logic is needed for the overall product funnel area,
this file would be the place to implement it. Examples could include:

- Dynamically updating the price summary based on selected variants and quantities.
- Handling interactions between different selection panels (e.g., disabling options based on other choices).
- Managing the state of user selections before adding to the cart.
- Validating selections before proceeding.
- Analytics tracking for funnel interactions.
*/

import { init } from "astro/virtual-modules/prefetch.js";

// Example of a function that could be exported and used:
/*
export function updatePriceDisplay(selectedOptions, quantity) {
  // Logic to calculate and update the price in the summary section
  console.log("Price display updated based on:", selectedOptions, "and quantity:", quantity);
}

export function handleAddToCart() {
  // Logic to gather selected options and add to cart
  console.log("Attempting to add to cart...");
}

// Event listeners for option changes or button clicks would be set up
// either here or in the .astro component, calling these functions.
*/

interface SelectedOffer {
  title: string;
  items: number;
  price_per_item: number;
  original_price_per_item: number;
  original_total: number;
  total_price: number;
  discount: number;
  discount_percent: string;
  shipping_price: number;
  final_total: number;
}

export function initProductFunnel() {
  document.addEventListener('item-change', (e: Event) => {
    const customEvent = e as CustomEvent;
    // Parse the stringified JSON into an object
    const selectedOffer: SelectedOffer = JSON.parse(customEvent.detail.selectedItem);
    
    // Update price breakdown elements
    updatePriceBreakdown(selectedOffer);
  });
}

function updatePriceBreakdown(offer: SelectedOffer) {
  // Update product quantity
  const quantityElement = document.querySelector('[data-price-quantity]');
  if (quantityElement) {
    quantityElement.textContent = `${offer.items} ${offer.items === 1 ? 'قطعة' : 'قطع'}`;
  }

  // Update unit price
  const unitPriceElement = document.querySelector('[data-price-unit]');
  if (unitPriceElement) {
    unitPriceElement.textContent = `${offer.price_per_item.toLocaleString()} ج.م`;
  }

  // Update subtotal
  const subtotalElement = document.querySelector('[data-price-subtotal]');
  if (subtotalElement) {
    subtotalElement.textContent = `${offer.total_price.toLocaleString()} ج.م`;
  }

  // Update shipping
  const shippingElement = document.querySelector('[data-price-shipping]');
  if (shippingElement) {
    shippingElement.textContent = `${offer.shipping_price.toLocaleString()} ج.م`;
  }

  // Update discount
  const discountElement = document.querySelector('[data-price-discount]');
  if (discountElement) {
    if (offer.discount > 0) {
      discountElement.textContent = `- ${offer.discount.toLocaleString()} ج.م`;
      discountElement.closest('[data-discount-container]')?.classList.remove('hidden');
    } else {
      discountElement.closest('[data-discount-container]')?.classList.add('hidden');
    }
  }

  // Update final total
  const totalElement = document.querySelector('[data-price-total]');
  if (totalElement) {
    totalElement.textContent = `${offer.final_total.toLocaleString()} ج.م`;
  }
}
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

import type { BlockData } from "../../../../../lib/api/types";

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


export function initProductFunnel() {
  document.addEventListener('item-change', (e: Event) => {
    const customEvent = e as CustomEvent;
    // Parse the stringified JSON into an object
    const selectedOffer: BlockData = JSON.parse(customEvent.detail.selectedItem);
    
    // Update price breakdown elements
    updatePriceBreakdown(selectedOffer);
  });
}

function updatePriceBreakdown(offer: BlockData) {
  // Update product quantity
  const quantityElements = document.querySelectorAll('[data-price-quantity]');
  quantityElements.forEach((el) => {
    el.textContent = `${offer.items}`;
  });

  // Update unit price
  const unitPriceElements = document.querySelectorAll('[data-price-unit]');
  unitPriceElements.forEach((el) => {
    el.textContent = `${offer.price_per_item.toLocaleString()} ج.م`;
  });

  // Update subtotal
  const subtotalElements = document.querySelectorAll('[data-price-subtotal]');
  subtotalElements.forEach((el) => {
    el.textContent = `${offer.total_price.toLocaleString()} ج.م`;
  });

  // Update shipping
  const shippingElements = document.querySelectorAll('[data-price-shipping]');
  shippingElements.forEach((el) => {
    el.textContent = `${offer.shipping_price.toLocaleString()} ج.م`;
  });

  // Update discount
  const discountElements = document.querySelectorAll('[data-price-discount]');
  discountElements.forEach((el) => {
    const container = el.closest('[data-discount-container]');
    if (offer.discount > 0) {
      el.textContent = `- ${offer.discount.toLocaleString()} ج.م`;
      container?.classList.remove('hidden');
    } else {
      container?.classList.add('hidden');
    }
  });

  // Update final total
  const totalElements = document.querySelectorAll('[data-price-total]');
  totalElements.forEach((el) => {
    el.textContent = `${offer.final_total.toLocaleString()} ج.م`;
  });
}

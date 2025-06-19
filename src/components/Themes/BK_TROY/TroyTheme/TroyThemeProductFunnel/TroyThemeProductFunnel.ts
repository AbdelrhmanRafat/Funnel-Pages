import type { PurchaseOption } from "../../../../../lib/api/types";
import { QuantityOptionsSubject, type Observer, type QuantityState } from "../../../../../lib/patterns/Observer";
import { getTranslation } from '../../../../../lib/utils/i18n/translations';

class ProductFunnelObserver implements Observer<QuantityState> {
  public update(subject: QuantityOptionsSubject): void {
    const state = subject.getState();
    const offer = state.selectedItem as PurchaseOption;
    if (!offer) return;
    // Update UI elements
    document.querySelector('[data-price-quantity]')!.textContent = `${offer.items}`;
    document.querySelector('[data-price-unit]')!.textContent = `${offer.price_per_item.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
    document.querySelector('[data-price-subtotal]')!.textContent = `${offer.total_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
    document.querySelector('[data-price-shipping]')!.textContent = `${offer.shipping_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;

    const discountEl = document.querySelector('[data-price-discount]');
    const discountContainer = discountEl?.closest('[data-discount-container]');
    if (offer.discount > 0 && discountEl && discountContainer) {
      discountEl.textContent = `- ${offer.discount.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
      discountContainer.classList.remove('hidden');
    } else {
      discountContainer?.classList.add('hidden');
    }

    document.querySelector('[data-price-total]')!.textContent = `${offer.final_total.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
  }
}

export function initProductFunnel() {
  const quantitySubject = QuantityOptionsSubject.getInstance();
  const observer = new ProductFunnelObserver();
  quantitySubject.attach(observer);
}
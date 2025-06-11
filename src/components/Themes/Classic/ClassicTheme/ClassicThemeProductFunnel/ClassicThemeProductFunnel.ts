import type { PurchaseOption } from "../../../../../lib/api/types";
import type { Observer, Subject } from '../../../../../lib/patterns/Observer';
import { QuantityOptionsSubject, type QuantityState } from '../../../../../lib/patterns/Observer';
import { getTranslation } from '../../../../../lib/utils/i18n/translations';

class ProductFunnelObserver implements Observer<QuantityState> {
    public update(subject: Subject<QuantityState>): void {
        const state = subject.getState();
        if (state.selectedItem) {
            this.updatePriceBreakdown(state.selectedItem);
        }
    }

    private updatePriceBreakdown(offer: PurchaseOption): void {
        // Update quantity
        const quantityElement = document.querySelector('[data-price-quantity]');
        if (quantityElement) {
            quantityElement.textContent = `${offer.items}`;
        }

        // Update unit price
        const unitPriceElement = document.querySelector('[data-price-unit]');
        if (unitPriceElement) {
            unitPriceElement.textContent = `${offer.price_per_item.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        }

        // Update subtotal
        const subtotalElement = document.querySelector('[data-price-subtotal]');
        if (subtotalElement) {
            subtotalElement.textContent = `${offer.total_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        }

        // Update shipping
        const shippingElement = document.querySelector('[data-price-shipping]');
        if (shippingElement) {
            shippingElement.textContent = `${offer.shipping_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        }

        // Update discount
        const discountElement = document.querySelector('[data-price-discount]');
        if (discountElement) {
            const container = discountElement.closest('[data-discount-container]');
            if (offer.discount > 0) {
                discountElement.textContent = `- ${offer.discount.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
                container?.classList.remove('hidden');
            } else {
                container?.classList.add('hidden');
            }
        }

        // Update total
        const totalElement = document.querySelector('[data-price-total]');
        if (totalElement) {
            totalElement.textContent = `${offer.final_total.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        }
    }
}

export function initProductFunnel() {
    const productFunnelObserver = new ProductFunnelObserver();
    const quantitySubject = new QuantityOptionsSubject();
    quantitySubject.attach(productFunnelObserver);
}

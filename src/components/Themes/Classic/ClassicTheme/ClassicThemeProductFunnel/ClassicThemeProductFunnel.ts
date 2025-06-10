import type { BlockData } from "../../../../../lib/api/types";
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

    private updatePriceBreakdown(offer: BlockData): void {
        const quantityElements = document.querySelectorAll('[data-price-quantity]');
        quantityElements.forEach((el) => {
            el.textContent = `${offer.items}`;
        });

        const unitPriceElements = document.querySelectorAll('[data-price-unit]');
        unitPriceElements.forEach((el) => {
            el.textContent = `${offer.price_per_item.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        });

        const subtotalElements = document.querySelectorAll('[data-price-subtotal]');
        subtotalElements.forEach((el) => {
            el.textContent = `${offer.total_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        });

        const shippingElements = document.querySelectorAll('[data-price-shipping]');
        shippingElements.forEach((el) => {
            el.textContent = `${offer.shipping_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        });

        const discountElements = document.querySelectorAll('[data-price-discount]');
        discountElements.forEach((el) => {
            const container = el.closest('[data-discount-container]');
            if (offer.discount > 0) {
                el.textContent = `- ${offer.discount.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
                container?.classList.remove('hidden');
            } else {
                container?.classList.add('hidden');
            }
        });

        const totalElements = document.querySelectorAll('[data-price-total]');
        totalElements.forEach((el) => {
            el.textContent = `${offer.final_total.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
        });
    }
}

export function initProductFunnel() {
    const productFunnelObserver = new ProductFunnelObserver();
    const quantitySubject = new QuantityOptionsSubject();
    quantitySubject.attach(productFunnelObserver);
}

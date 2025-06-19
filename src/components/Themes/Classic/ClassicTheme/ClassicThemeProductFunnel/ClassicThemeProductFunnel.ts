import type { PurchaseOption } from "../../../../../lib/api/types";
import {   DeliveryOptionsSubject, QuantityOptionsSubject, type Observer, type QuantityState } from "../../../../../lib/patterns/Observer";
import { getTranslation } from '../../../../../lib/utils/i18n/translations';



class ProductFunnelObserver implements Observer<any> {
  public update(subject: any): void {
    // Always get the latest state from both subjects
    const quantitySubject = QuantityOptionsSubject.getInstance();
    const deliverySubject = DeliveryOptionsSubject.getInstance();
    const state = quantitySubject.getState();
    const deliveryOption = deliverySubject.getState();
    const offer = state.selectedItem as PurchaseOption;
   
    let ActualShipping;
    let ActualFinalTotal;
    // const orignalFinalTotal = offer.final_total;
    if (deliveryOption.selectedDeliveryOptionId === "delivery-pickup") {
      ActualFinalTotal = Number(offer.final_total) - Number(offer.shipping_price);
      ActualShipping = "0";
    }
    else {
      ActualShipping = offer?.shipping_price;
      ActualFinalTotal = offer?.final_total;
    }
    if (!offer) return;
    // Update UI elements
    document.querySelector('[data-price-quantity]')!.textContent = `${offer.items}`;
    document.querySelector('[data-price-unit]')!.textContent = `${offer.price_per_item.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
    document.querySelector('[data-price-subtotal]')!.textContent = `${offer.total_price.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
    document.querySelector('[data-price-shipping]')!.textContent = `${ActualShipping} ${getTranslation('productFunnel.currency')}`;
    const discountEl = document.querySelector('[data-price-discount]');
    const discountContainer = discountEl?.closest('[data-discount-container]');
    if (offer.discount > 0 && discountEl && discountContainer) {
      discountEl.textContent = `- ${offer.discount.toLocaleString()} ${getTranslation('productFunnel.currency')}`;
      discountContainer.classList.remove('hidden');
    } else {
      discountContainer?.classList.add('hidden');
    }
    
    document.querySelector('[data-price-total]')!.textContent = `${ActualFinalTotal} ${getTranslation('productFunnel.currency')}`;
  }
}

export function initProductFunnel() {
  const quantitySubject = QuantityOptionsSubject.getInstance();
  const deliverySubject = DeliveryOptionsSubject.getInstance();
  const observer = new ProductFunnelObserver();
  quantitySubject.attach(observer);
  deliverySubject.attach(observer);
}
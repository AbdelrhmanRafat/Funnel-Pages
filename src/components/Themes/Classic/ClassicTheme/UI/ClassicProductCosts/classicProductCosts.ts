// ClassicThemeProductFunnel.ts - Web Component for Product Funnel

import type { PurchaseOption } from "../../../../../../lib/api/types";
import { QuantityOptionsSubject } from "../../../../../../lib/patterns/Observers/quantity-observer";
import type { Observer } from "../../../../../../lib/patterns/Observers/base-observer";
import { DeliveryOptionsSubject } from "../../../../../../lib/patterns/Observers/delivery-observer";
import { getTranslation } from '../../../../../../lib/utils/i18n/translations';

interface ProductFunnelElements {
  quantityElement: HTMLElement | null;
  unitPriceElement: HTMLElement | null;
  subtotalElement: HTMLElement | null;
  shippingElement: HTMLElement | null;
  discountElement: HTMLElement | null;
  discountContainer: HTMLElement | null;
  totalElement: HTMLElement | null;
}

class ClassicProductFunnel extends HTMLElement implements Observer<any> {
  private elements: ProductFunnelElements = {
    quantityElement: null,
    unitPriceElement: null,
    subtotalElement: null,
    shippingElement: null,
    discountElement: null,
    discountContainer: null,
    totalElement: null
  };
  private quantitySubject: QuantityOptionsSubject;
  private deliverySubject: DeliveryOptionsSubject;
  private autoUpdate: boolean = true;
  private showDiscountWhenZero: boolean = false;
  private currency: string = '';
  private hasBundles: boolean = false;
  private currentOffer: PurchaseOption | null = null;

  constructor() {
    super();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.deliverySubject = DeliveryOptionsSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.loadInitialDataFromSubject();
    
    if (this.autoUpdate) {
      this.attachToSubjects();
    }
    
    // Initial update
    this.update();
  }

  disconnectedCallback() {
    this.detachFromSubjects();
  }

  private initializeSettings(): void {
    this.autoUpdate = this.getAttribute('data-funnel-auto-update') !== 'false';
    this.showDiscountWhenZero = this.getAttribute('data-funnel-show-discount-when-zero') === 'true';
    this.currency = this.getAttribute('data-funnel-currency') || getTranslation('productFunnel.currency');
    this.hasBundles = this.getAttribute('data-funnel-has-bundles') === 'true';
  }

  private loadInitialDataFromSubject(): void {
    // Get initial data from QuantityOptionsSubject instead of props
    const state = this.quantitySubject.getState();
    
    if (this.hasBundles) {
      // Logic for when hasBundles is true
      this.loadBundleData(state);
    } else {
      // Logic for when hasBundles is false  
      this.loadNonBundleData(state);
    }
  }

  private loadBundleData(state: any): void {
    if (state.selectedItem) {
      this.currentOffer = state.selectedItem as PurchaseOption;
    } else if (state.items && state.items.length > 0) {
      // If no selection, use the first available option as default
      this.currentOffer = state.items[0] as PurchaseOption;
      
      // Optionally, set this as the selected item in the subject
      this.quantitySubject.selectItem(this.currentOffer);
    } else {
      // Create a fallback empty offer if no data is available
      this.currentOffer = this.createFallbackOffer();
      console.warn('Product Funnel: No bundle data available in QuantityOptionsSubject, using fallback values');
    }
  }

  private loadNonBundleData(state: any): void {
    // TODO: Implement logic for non-bundle products
    // For now, using the same logic as bundles but you can customize this
    if (state.selectedItem) {
      this.currentOffer = state.selectedItem as PurchaseOption;
    } else if (state.items && state.items.length > 0) {
      // If no selection, use the first available option as default
      this.currentOffer = state.items[0] as PurchaseOption;
      
      // Optionally, set this as the selected item in the subject
      this.quantitySubject.selectItem(this.currentOffer);
    } else {
      // Create a fallback empty offer if no data is available
      this.currentOffer = this.createFallbackOffer();
      console.warn('Product Funnel: No non-bundle data available in QuantityOptionsSubject, using fallback values');
    }
  }

  private createFallbackOffer(): PurchaseOption {
    return {
      id: 'fallback',
      items: 0,
      price_per_item: 0,
      total_price: 0,
      shipping_price: 0,
      discount: 0,
      final_total: 0
    } as PurchaseOption;
  }

  private initializeElements(): void {
    this.elements = {
      quantityElement: this.querySelector('[data-funnel-price-quantity]') as HTMLElement,
      unitPriceElement: this.querySelector('[data-funnel-price-unit]') as HTMLElement,
      subtotalElement: this.querySelector('[data-funnel-price-subtotal]') as HTMLElement,
      shippingElement: this.querySelector('[data-funnel-price-shipping]') as HTMLElement,
      discountElement: this.querySelector('[data-funnel-price-discount]') as HTMLElement,
      discountContainer: this.querySelector('[data-funnel-discount-container]') as HTMLElement,
      totalElement: this.querySelector('[data-funnel-price-total]') as HTMLElement
    };

    if (!this.elements.totalElement) {
      console.warn('Product Funnel: Required total element not found');
    }
  }

  private attachToSubjects(): void {
    this.quantitySubject.attach(this);
    this.deliverySubject.attach(this);
  }

  private detachFromSubjects(): void {
    this.quantitySubject.detach(this);
    this.deliverySubject.detach(this);
  }

  // Observer pattern implementation
  public update(subject?: any): void {
    // Always get the latest state from both subjects
    const quantityState = this.quantitySubject.getState();
    const deliveryState = this.deliverySubject.getState();
    
    // Update current offer from subject based on bundle logic
    if (this.hasBundles) {
      this.updateBundleOffer(quantityState);
    } else {
      this.updateNonBundleOffer(quantityState);
    }

    if (!this.currentOffer) {
      console.warn('Product Funnel: No offer available for update');
      return;
    }

    this.updateUI(this.currentOffer, deliveryState);

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('funnel-updated', {
      detail: {
        offer: this.currentOffer,
        deliveryState,
        calculatedValues: this.calculateValues(this.currentOffer, deliveryState),
        hasBundles: this.hasBundles
      }
    }));
  }

  private updateBundleOffer(quantityState: any): void {
    if (quantityState.selectedItem) {
      this.currentOffer = quantityState.selectedItem as PurchaseOption;
    }
    // Add any additional bundle-specific logic here
  }

  private updateNonBundleOffer(quantityState: any): void {
    if (quantityState.selectedItem) {
      this.currentOffer = quantityState.selectedItem as PurchaseOption;
    }
    // Add any additional non-bundle-specific logic here
  }

  private updateUI(offer: PurchaseOption, deliveryState: any): void {
    const calculatedValues = this.calculateValues(offer, deliveryState);

    // Update quantity
    if (this.elements.quantityElement) {
      this.elements.quantityElement.textContent = `${offer.items}`;
    }

    // Update unit price
    if (this.elements.unitPriceElement) {
      this.elements.unitPriceElement.textContent = `${offer.price_per_item.toLocaleString()} ${this.currency}`;
    }

    // Update subtotal
    if (this.elements.subtotalElement) {
      this.elements.subtotalElement.textContent = `${offer.total_price.toLocaleString()} ${this.currency}`;
    }

    // Update shipping
    if (this.elements.shippingElement) {
      this.elements.shippingElement.textContent = `${calculatedValues.actualShipping} ${this.currency}`;
    }

    // Update discount
    this.updateDiscountDisplay(offer);

    // Update total
    if (this.elements.totalElement) {
      this.elements.totalElement.textContent = `${calculatedValues.actualFinalTotal} ${this.currency}`;
    }
  }

  private calculateValues(offer: PurchaseOption, deliveryState: any) {
    let actualShipping: string;
    let actualFinalTotal: number;

    if (deliveryState.selectedDeliveryOptionId === "delivery-pickup") {
      actualFinalTotal = Number(offer.final_total) - Number(offer.shipping_price);
      actualShipping = "0";
    } else {
      actualShipping = offer.shipping_price.toLocaleString();
      actualFinalTotal = offer.final_total;
    }

    return {
      actualShipping,
      actualFinalTotal
    };
  }

  private updateDiscountDisplay(offer: PurchaseOption): void {
    if (!this.elements.discountElement || !this.elements.discountContainer) return;

    if (offer.discount > 0) {
      this.elements.discountElement.textContent = `- ${offer.discount.toLocaleString()} ${this.currency}`;
      this.elements.discountContainer.classList.remove('hidden');
    } else {
      if (this.showDiscountWhenZero) {
        this.elements.discountElement.textContent = `- 0 ${this.currency}`;
        this.elements.discountContainer.classList.remove('hidden');
      } else {
        this.elements.discountContainer.classList.add('hidden');
      }
    }
  }

  // Public API methods
  public getCurrentOffer(): PurchaseOption | null {
    return this.currentOffer;
  }

  public getCurrentDeliveryState(): any {
    return this.deliverySubject.getState();
  }

  public forceUpdate(): void {
    this.loadInitialDataFromSubject(); // Reload data from subject
    this.update();
  }

  public refreshFromSubject(): void {
    // Method to explicitly refresh data from the subject
    this.loadInitialDataFromSubject();
    this.update();
  }

  public enableAutoUpdate(enable: boolean): void {
    this.autoUpdate = enable;
    this.setAttribute('data-funnel-auto-update', enable.toString());
    
    if (enable) {
      this.attachToSubjects();
    } else {
      this.detachFromSubjects();
    }
  }

  public setCurrency(currency: string): void {
    this.currency = currency;
    this.setAttribute('data-funnel-currency', currency);
    this.update(); // Refresh display with new currency
  }

  public showDiscountAlways(show: boolean): void {
    this.showDiscountWhenZero = show;
    this.setAttribute('data-funnel-show-discount-when-zero', show.toString());
    this.update(); // Refresh display
  }

  public getCalculatedValues(): any {
    const offer = this.getCurrentOffer();
    const deliveryState = this.getCurrentDeliveryState();
    
    if (!offer) return null;
    
    return this.calculateValues(offer, deliveryState);
  }

  public getHasBundles(): boolean {
    return this.hasBundles;
  }

  public setHasBundles(hasBundles: boolean): void {
    this.hasBundles = hasBundles;
    this.setAttribute('data-funnel-has-bundles', hasBundles.toString());
    this.refreshFromSubject(); // Reload with new bundle logic
  }

  public getQuantitySubject(): QuantityOptionsSubject {
    return this.quantitySubject;
  }

  public getDeliverySubject(): DeliveryOptionsSubject {
    return this.deliverySubject;
  }
}

// Legacy function for backward compatibility
export function initProductFunnel() {
  // This function is now handled by the web component
  // but we keep it for compatibility
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-product-funnel')) {
    customElements.define('classic-product-funnel', ClassicProductFunnel);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const productFunnels = document.querySelectorAll('classic-product-funnel:not(:defined)');
  productFunnels.forEach(funnel => {
    if (funnel instanceof ClassicProductFunnel) {
      funnel.connectedCallback();
    }
  });
});

export { ClassicProductFunnel };
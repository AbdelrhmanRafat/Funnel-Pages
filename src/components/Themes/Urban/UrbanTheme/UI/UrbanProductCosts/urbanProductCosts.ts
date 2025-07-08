// UrbanThemeProductFunnel.ts - Web Component for Product Funnel

import type { PurchaseOption } from "../../../../../../lib/api/types";
import type { Observer } from "../../../../../../lib/patterns/Observers/base-observer";
import { DeliveryOptionsSubject } from "../../../../../../lib/patterns/Observers/delivery-observer";
import { CustomOptionsNonBundleSubject } from '../../../../../../lib/patterns/Observers/custom-options-non-bundle';
import { getTranslation } from '../../../../../../lib/utils/i18n/translations';
import { BundleOptionsSubject } from "../../../../../../lib/patterns/Observers/bundle-observer";

interface ProductFunnelElements {
  quantityElement: HTMLElement | null;
  unitPriceElement: HTMLElement | null;
  subtotalElement: HTMLElement | null;
  shippingElement: HTMLElement | null;
  discountElement: HTMLElement | null;
  discountContainer: HTMLElement | null;
  totalElement: HTMLElement | null;
}

class UrbanProductFunnel extends HTMLElement implements Observer<any> {
  private elements: ProductFunnelElements = {
    quantityElement: null,
    unitPriceElement: null,
    subtotalElement: null,
    shippingElement: null,
    discountElement: null,
    discountContainer: null,
    totalElement: null
  };
  private bundleOptionsSubject: BundleOptionsSubject;
  private customOptionsNonBundleSubject: CustomOptionsNonBundleSubject;
  private deliverySubject: DeliveryOptionsSubject;
  private autoUpdate: boolean = true;
  private showDiscountWhenZero: boolean = false;
  private currency: string = '';
  private hasBundles: boolean = false;
  private currentOffer: PurchaseOption | null = null;

  constructor() {
    super();
    this.bundleOptionsSubject = BundleOptionsSubject.getInstance();
    this.deliverySubject = DeliveryOptionsSubject.getInstance();
    this.customOptionsNonBundleSubject = CustomOptionsNonBundleSubject.getInstance();
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
    const state = this.bundleOptionsSubject.getState();
    
    if (this.hasBundles) {
      // Logic for when hasBundles is true
      this.loadBundleData(state);
    } else {
      // Logic for when hasBundles is false  
      this.loadNonBundleData(state);
    }
  }

  private loadBundleData(state: any): void {
    if (state.selectedOffer) {
      this.currentOffer = state.selectedOffer as PurchaseOption;
    } else if (state.items && state.items.length > 0) {
      // If no selection, use the first available option as default
      this.currentOffer = state.items[0] as PurchaseOption;
      
      // Optionally, set this as the selected item in the subject
    } else {
      // Create a fallback empty offer if no data is available
      this.currentOffer = this.createFallbackOffer();
    }
  }

  private loadNonBundleData(state: any): void {
    // For non-bundle products, get initial data from CustomOptionsNonBundleSubject
    const customOptionsState = this.customOptionsNonBundleSubject.getState();
    
    // Create offer based on custom options state
    if (customOptionsState && customOptionsState.option) {
      this.currentOffer = this.createOfferFromCustomOptions(customOptionsState);
    } else {
      // Fallback to base product data if no custom options
      this.currentOffer = this.createFallbackOffer();
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
    } as any as PurchaseOption;
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
  }

  private attachToSubjects(): void {
    this.bundleOptionsSubject.attach(this);
    this.deliverySubject.attach(this);
    this.customOptionsNonBundleSubject.attach(this);
  }

  private detachFromSubjects(): void {
    this.bundleOptionsSubject.detach(this);
    this.deliverySubject.detach(this);
    this.customOptionsNonBundleSubject.detach(this);
  }

  // Observer pattern implementation
  public update(subject?: any): void {
    // Check if the update is from CustomOptionsNonBundleSubject
    if (subject === this.customOptionsNonBundleSubject) {
      const customOptionsState = this.customOptionsNonBundleSubject.getState();
      
      // If this is a non-bundle product, update the offer based on custom options
      if (!this.hasBundles) {
        const bundleOptionsState = this.bundleOptionsSubject.getState();
        this.updateNonBundleOffer(bundleOptionsState);
        
        if (this.currentOffer) {
          const deliveryState = this.deliverySubject.getState();
          this.updateUI(this.currentOffer, deliveryState);
          
          // Dispatch custom event for non-bundle updates
          this.dispatchEvent(new CustomEvent('funnel-updated', {
            detail: {
              offer: this.currentOffer,
              deliveryState,
              calculatedValues: this.calculateValues(this.currentOffer, deliveryState),
              hasBundles: this.hasBundles,
              customOptionsState: customOptionsState
            }
          }));
        }
      }
      return;
    }

    // Always get the latest state from both subjects
    const bundleOptionsState = this.bundleOptionsSubject.getState();
    const deliveryState = this.deliverySubject.getState();
    
    // Update current offer from subject based on bundle logic
    if (this.hasBundles) {
      this.updateBundleOffer(bundleOptionsState);
    } else {
      this.updateNonBundleOffer(bundleOptionsState);
    }

    if (!this.currentOffer) {
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

  private updateBundleOffer(bundleOptionsState: any): void {
    if (bundleOptionsState.selectedOffer) {
      this.currentOffer = bundleOptionsState.selectedOffer as PurchaseOption; 
    }
    // Add any additional bundle-specific logic here
  }

  private updateNonBundleOffer(bundleOptionsState: any): void {
    // For non-bundle products, sync with CustomOptionsNonBundleSubject
    const customOptionsState = this.customOptionsNonBundleSubject.getState();
    
    if (customOptionsState && customOptionsState.option) {
      // Update offer based on custom options selection
      this.currentOffer = this.createOfferFromCustomOptions(customOptionsState, bundleOptionsState.selectedQuantity);
    } else if (bundleOptionsState.selectedItem) {
      // Fallback to bundle options subject if custom options not available
      this.currentOffer = bundleOptionsState.selectedItem as PurchaseOption;
    }
  }

  private createOfferFromCustomOptions(customOptionsState: any, quantity?: number): PurchaseOption {
    const option = customOptionsState.option;
    // Use qty from custom options state, fallback to quantity parameter, then default to 1
    const selectedQuantity = option.qty || quantity || customOptionsState.selectedQuantity || 1;
    
    // Calculate prices based on custom options selection
    const unitPrice = option.price_after_discount || option.price || 0;
    const totalPrice = unitPrice * selectedQuantity;
    const discount = option.price && option.price_after_discount ? 
      (option.price - option.price_after_discount) * selectedQuantity : 0;
    
    return {
      id: option.sku_id || 'custom-option',
      items: selectedQuantity,
      price_per_item: unitPrice,
      total_price: totalPrice,
      shipping_price: 0, // Will be handled by delivery options
      discount: discount,
      final_total: totalPrice,
      // Add custom option specific data
      custom_option_data: {
        sku_id: option.sku_id,
        original_price: option.price,
        discounted_price: option.price_after_discount,
        selection_complete: customOptionsState.isSelectionComplete,
        first_option: customOptionsState.firstOption,
        second_option: customOptionsState.secondOption,
        qty: selectedQuantity
      }
    } as unknown as PurchaseOption;
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

    // Calculate final total with quantity multiplied
    const baseTotal = offer.final_total; // This already includes quantity multiplication from createOfferFromCustomOptions

    if (deliveryState.selectedDeliveryOptionId === "delivery-pickup") {
      actualFinalTotal = baseTotal - Number(offer.shipping_price);
      actualShipping = "0";
    } else {
      actualShipping = offer.shipping_price.toLocaleString();
      actualFinalTotal = baseTotal;
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

  public getCurrentCustomOptionsState(): any {
    return this.customOptionsNonBundleSubject.getState();
  }

  public getCustomOptionsNonBundleSubject(): CustomOptionsNonBundleSubject {
    return this.customOptionsNonBundleSubject;
  }

  public getBundleOptionsSubject(): BundleOptionsSubject {
    return this.bundleOptionsSubject;
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
  if (!customElements.get('urban-product-funnel')) {
    customElements.define('urban-product-funnel', UrbanProductFunnel);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const productFunnels = document.querySelectorAll('urban-product-funnel:not(:defined)');
  productFunnels.forEach(funnel => {
    if (funnel instanceof UrbanProductFunnel) {
      funnel.connectedCallback();
    }
  });
});

export { UrbanProductFunnel };
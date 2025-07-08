import { CustomOptionsNonBundleSubject } from '../../../../../lib/patterns/Observers/custom-options-non-bundle';
import type { Observer } from '../../../../../lib/patterns/Observers/base-observer';

interface ProductHeaderElements {
  skuElement: HTMLElement | null;
  priceElement: HTMLElement | null;
  priceDiscountElement: HTMLElement | null;
}

class FreshProductHeader extends HTMLElement implements Observer<any> {
  private elements: ProductHeaderElements = {
    skuElement: null,
    priceElement: null,
    priceDiscountElement: null
  };
  private customOptionsNonBundleSubject: CustomOptionsNonBundleSubject;
  private shouldObserve: boolean = false;
  private initialPrice: string = '';
  private initialPriceDiscount: string = '';
  private initialSku: string = '';

  constructor() {
    super();
    this.customOptionsNonBundleSubject = CustomOptionsNonBundleSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    if (this.shouldObserve) {
      this.attachToSubject();
    }
  }

  disconnectedCallback() {
    this.detachFromSubject();
  }

  private initializeSettings(): void {
    const purchaseOptionsAttr = this.getAttribute('data-purchase-options');
    const isHaveVariantAttr = this.getAttribute('data-is-have-variant');
    
    const purchaseOptionsFalse = purchaseOptionsAttr === 'true';
    const isHaveVariantTrue = isHaveVariantAttr === 'true';
    
    this.shouldObserve = purchaseOptionsFalse && isHaveVariantTrue;
    
    this.initialPrice = this.getAttribute('data-initial-price') || '';
    this.initialPriceDiscount = this.getAttribute('data-initial-price-discount') || '';
    this.initialSku = this.getAttribute('data-initial-sku') || '';
  }

  private initializeElements(): void {
    this.elements = {
      skuElement: this.querySelector('[data-product-sku]') as HTMLElement,
      priceElement: this.querySelector('[data-product-price]') as HTMLElement,
      priceDiscountElement: this.querySelector('[data-product-price-discount]') as HTMLElement
    };
  }

  private attachToSubject(): void {
    this.customOptionsNonBundleSubject.attach(this);
  }

  private detachFromSubject(): void {
    this.customOptionsNonBundleSubject.detach(this);
  }

  public update(subject?: any): void {
    if (!this.shouldObserve) return;

    if (subject === this.customOptionsNonBundleSubject) {
      const customOptionsState = this.customOptionsNonBundleSubject.getState();
      this.updateProductDisplay(customOptionsState);
    }
  }

  private updateProductDisplay(customOptionsState: any): void {
    if (!customOptionsState || !customOptionsState.option) {
      return;
    }

    const option = customOptionsState.option;
    
    if (this.elements.skuElement && option.sku_id) {
      this.elements.skuElement.textContent = option.sku_id.toString();
    }

    if (this.elements.priceElement && option.price !== null && option.price !== undefined) {
      this.elements.priceElement.textContent = option.price.toString();
    }

    if (this.elements.priceDiscountElement && option.price_after_discount !== null && option.price_after_discount !== undefined) {
      this.elements.priceDiscountElement.textContent = option.price_after_discount.toString();
    }

    this.dispatchEvent(new CustomEvent('product-header-updated', {
      detail: {
        sku: option.sku_id,
        price: option.price,
        priceAfterDiscount: option.price_after_discount,
        customOptionsState: customOptionsState
      },
      bubbles: true
    }));
  }

  public getCurrentCustomOptionsState(): any {
    return this.customOptionsNonBundleSubject.getState();
  }

  public resetToInitialValues(): void {
    if (this.elements.skuElement) {
      this.elements.skuElement.textContent = this.initialSku;
    }
    if (this.elements.priceElement) {
      this.elements.priceElement.textContent = this.initialPrice;
    }
    if (this.elements.priceDiscountElement) {
      this.elements.priceDiscountElement.textContent = this.initialPriceDiscount;
    }
  }

  public forceUpdate(): void {
    if (this.shouldObserve) {
      const customOptionsState = this.customOptionsNonBundleSubject.getState();
      this.updateProductDisplay(customOptionsState);
    }
  }

  public getObserverStatus(): boolean {
    return this.shouldObserve;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('fresh-product-header')) {
    customElements.define('fresh-product-header', FreshProductHeader);
  }
});

document.addEventListener('astro:page-load', () => {
  const productHeaders = document.querySelectorAll('fresh-product-header:not(:defined)');
  productHeaders.forEach(header => {
    if (header instanceof FreshProductHeader) {
      header.connectedCallback();
    }
  });
});

export { FreshProductHeader };
// quantity-observer.ts

// form-fields-observer.ts
import { FormFieldsSubject } from '../../../../../lib/patterns/Observers/form-fields-observer';

// delivery-observer.ts
import { DeliveryOptionsSubject } from '../../../../../lib/patterns/Observers/delivery-observer';

// payment-observer.ts
import { PaymentOptionsSubject } from '../../../../../lib/patterns/Observers/payment-observer';
import { CustomOptionsNonBundleSubject } from '../../../../../lib/patterns/Observers/custom-options-non-bundle';
import { BundleOptionsSubject } from '../../../../../lib/patterns/Observers/bundle-observer';
import { CustomOptionBundlesSubject, type CustomOptionBundlesState } from '../../../../../lib/patterns/Observers/custom-option-observer-bundles';


interface SelectedOffer {
  title: string;
  items: number;
  price_per_item: number;
  original_price_per_item?: number;
  original_total?: number;
  total_price: number;
  discount: number;
  discount_percent: string;
  shipping_price?: number;
  final_total: number;
}

interface FormField {
  id: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
}

interface FormData {
  [key: string]: FormField;
}

interface DirectPurchaseOption {
  firstOption: string | null;
  secondOption: string | null;
  sku_id: number;
  hex: string | null;
  price: number;
  price_after_discount: number;
  qty: number;
  image?: string | null;
}

class ClassicPurchaseModal extends HTMLElement {
  // DOM elements cache
  private elements: { [key: string]: HTMLElement | null } = {};
  
  // Observer subjects - centralized access
  private subjects = {
    customOptions: CustomOptionBundlesSubject.getInstance(),
    quantity: BundleOptionsSubject.getInstance(),
    formFields: FormFieldsSubject.getInstance(),
    delivery: DeliveryOptionsSubject.getInstance(),
    payment: PaymentOptionsSubject.getInstance(),
    customOptionNonBundle: CustomOptionsNonBundleSubject.getInstance(),
  };

  // Element selectors mapping
  private readonly selectors = {
    modal: '[data-modal-container]',
    overlay: '[data-modal-overlay]',
    cancelButton: '[data-modal-cancel-button]',
    purchaseInfoView: '[data-modal-purchase-info-view]',
    celebrationView: '[data-modal-celebration-view]',
    celebrationContinueButton: '[data-modal-celebration-continue-button]',
    orderNumberElement: '[data-modal-order-number]',
    selectionItemsContainer: '[data-modal-selection-items]',
    directItemsContainer: '[data-modal-direct-items-container]',
    notesSection: '[data-modal-notes-section]'
  };

  // Field mapping for customer info display
  private readonly fieldMappings = {
    fullName: '[data-modal-customer-name]',
    phone: '[data-modal-customer-phone]',
    email: '[data-modal-customer-email]',
    address: '[data-modal-customer-address]',
    city: '[data-modal-customer-city]',
    paymentOption: '[data-modal-payment-method]',
    notes: '[data-modal-customer-notes]'
  };

  connectedCallback() {
    this.cacheElements();
    this.setupEventListeners();
  }

  // Cache all DOM elements
  private cacheElements(): void {
    Object.entries(this.selectors).forEach(([key, selector]) => {
      this.elements[key] = this.querySelector(selector);
    });

    if (!this.elements.modal) {
      console.warn('Purchase Modal: Modal container not found');
    }
  }

  // Setup all event listeners
  private setupEventListeners(): void {
    const { cancelButton, celebrationContinueButton } = this.elements;
    
    // Modal close events - removed overlay click listener
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.closeModal());
    }
    
    if (celebrationContinueButton) {
      celebrationContinueButton.addEventListener('click', () => this.handleContinueButton());
    }

    // Custom events
    document.addEventListener('openPurchaseModal', () => this.openModal());
    document.addEventListener('orderConfirmed', () => this.showCelebrationView());
  }

  // Modal state management
  private openModal(): void {
    if (!this.elements.modal) return;

    this.dispatchCustomEvent('modal-opening', { autoLoadData: true });
    
    this.elements.modal.classList.add('classic-modal-open');
    this.toggleBodyScroll(false);
    this.showPurchaseInfoView();
    
    this.loadModalData();
    
    this.dispatchCustomEvent('modal-opened', { view: 'purchase-info' });
  }

  private closeModal(): void {
    if (!this.elements.modal) return;

    this.dispatchCustomEvent('modal-closing');
    
    this.elements.modal.classList.remove('classic-modal-open');
    this.toggleBodyScroll(true);
    
    // Reset view after animation
    setTimeout(() => this.showPurchaseInfoView(), 300);
    
    this.dispatchCustomEvent('modal-closed');
  }

  // Handle continue button click - reload whole page
  private handleContinueButton(): void {
    this.dispatchCustomEvent('continue-button-clicked');
    
    // Reload the whole page
    window.location.reload();
    
    this.dispatchCustomEvent('page-reloaded');
  }

  // View switching
  private showPurchaseInfoView(): void {
    this.switchView('purchaseInfoView', 'celebrationView', 'purchase-info');
  }

  private showCelebrationView(): void {
    this.dispatchCustomEvent('celebration-starting');
    
    this.switchView('celebrationView', 'purchaseInfoView', 'celebration');
    
    this.generateOrderNumber();
    this.triggerConfettiEffect();
  }

  // Helper for view switching
  private switchView(showView: string, hideView: string, viewName: string): void {
    const show = this.elements[showView];
    const hide = this.elements[hideView];
    
    if (show && hide) {
      show.style.display = 'block';
      hide.style.display = 'none';
      this.dispatchCustomEvent('view-changed', { view: viewName });
    }
  }

  // Utility methods
  private toggleBodyScroll(enable: boolean): void {
      document.body.style.overflow = enable ? '' : 'hidden';
  }

  private dispatchCustomEvent(name: string, detail?: any): void {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  private updateElementText(selector: string, text: string): void {
    const element = this.querySelector(selector);
    if (element) element.textContent = text;
  }

  // Order number generation
  private generateOrderNumber(): void {
    if (!this.elements.orderNumberElement) return;

    const orderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
    this.elements.orderNumberElement.textContent = orderNumber;
    this.dispatchCustomEvent('order-number-generated', { orderNumber });
  }

  // Confetti effect
  private triggerConfettiEffect(): void {
    setTimeout(() => this.createFloatingEmojis(), 800);
  }

  private createFloatingEmojis(): void {
    const emojis = ['🎉', '✨', '🎊', '🌟', '💫'];
    const container = this.querySelector('.classic-modal-container');
    if (!container) return;

    // Add animation styles once
    if (!document.getElementById('float-animation')) {
      const style = document.createElement('style');
      style.id = 'float-animation';
      style.textContent = `
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Create floating emojis
    Array.from({ length: 10 }, (_, i) => {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
          position: absolute; font-size: 1.5rem; pointer-events: none;
          z-index: 9999; animation: float-up 3s ease-out forwards;
          left: ${Math.random() * 100}%; top: 100%;
        `;
        
        container.appendChild(emoji);
        setTimeout(() => emoji.remove(), 3000);
      }, i * 200);
    });

    this.dispatchCustomEvent('confetti-triggered');
  }

  // Data loading and population
  private loadModalData(): void {
    try {
      this.dispatchCustomEvent('data-loading-start');

      const states = {
        customOptions: this.subjects.customOptions.getState(),
        quantity: this.subjects.quantity.getState(),
        formFields: this.subjects.formFields.getState(),
        payment: this.subjects.payment.getState(),
        delivery: this.subjects.delivery.getState(),
        customOptionNonBundle: this.subjects.customOptionNonBundle.getState()
      };
      
      
      this.populateQuantityInfo(states.quantity.selectedItem);
      this.populateDirectPurchaseInfo(states.customOptionNonBundle.option);
      this.populateCustomerInfo(states.formFields.formData, states.payment.selectedPaymentOptionValue ?? "");
      
      this.dispatchCustomEvent('data-loaded', states);
      console.log('Modal data loaded:', states);
    } catch (error) {
      console.error('Error loading modal data:', error);
      this.dispatchCustomEvent('data-loading-error', { error });
    }
  }

  private populateQuantityInfo(quantityData: SelectedOffer | null): void {
    if (!quantityData) return;

    const deliveryState = this.subjects.delivery.getState();
    const isPickup = deliveryState.selectedDeliveryOptionId === 'delivery-pickup';
    
    const actualShipping = isPickup ? 0 : quantityData.shipping_price;
    const actualFinalTotal = isPickup 
      ? Number(quantityData.final_total) - Number(quantityData.shipping_price)
      : quantityData.final_total;

    // Update quantity display elements
    const updates = {
      '[data-modal-order-title]': quantityData.title,
      '[data-modal-items-count]': quantityData.items.toString(),
      '[data-modal-price-per-item]': `${quantityData.price_per_item} جنيه`,
      '[data-modal-final-total]': `${actualFinalTotal} جنيه`,
      '[data-modal-discount-info]': quantityData.discount > 0 
        ? `${quantityData.discount} جنيه (${quantityData.discount_percent})`
        : 'لا يوجد خصم'
    };

    Object.entries(updates).forEach(([selector, text]) => {
      this.updateElementText(selector, text);
    });

    // Add discount styling if applicable
    if (quantityData.discount > 0) {
      this.querySelector('[data-modal-discount-info]')?.classList.add('classic-discount-info');
    }
  }

  private populateDirectPurchaseInfo(directOptions: any): void {
    const container = this.elements.directItemsContainer;
    const hasBundles = this.getAttribute('data-has-bundles') === 'true';
    
    if (!container || !directOptions || hasBundles) return;

    console.log('Populating direct purchase info:', directOptions);

    // Since directOptions is an object, not an array, we need to handle it differently
    // Assuming directOptions has properties we can access directly
    const quantity = directOptions.qty || 1;
    const price = directOptions.price || 0;
    const discountedPrice = directOptions.price_after_discount || price;
    const itemDiscount = (price - discountedPrice) * quantity;
    
    const totalQuantity = quantity;
    const totalSubtotal = price * quantity;
    const totalDiscount = itemDiscount;

    // Build options display
    const optionsDisplay = [];
    if (directOptions.firstOption) {
      optionsDisplay.push(`<span class="classic-direct-option-tag">${directOptions.firstOption}</span>`);
    }
    if (directOptions.secondOption) {
      optionsDisplay.push(`<span class="classic-direct-option-tag">${directOptions.secondOption}</span>`);
    }
    
    const hasDiscount = price > discountedPrice;
    
    container.innerHTML = `
      <div class="classic-direct-item">
        <div class="classic-direct-item-info">
          <div class="classic-direct-item-title">المنتج المحدد</div>
          ${optionsDisplay.length > 0 ? `<div class="classic-direct-item-options">${optionsDisplay.join('')}</div>` : ''}
        </div>
        <div class="classic-direct-item-pricing">
          <div class="classic-direct-item-price">${discountedPrice} جنيه</div>
          ${hasDiscount ? `<div class="classic-direct-item-original-price">${price} جنيه</div>` : ''}
          ${hasDiscount ? `<div class="classic-direct-item-discount">وفر ${price - discountedPrice} جنيه</div>` : ''}
        </div>
        <div class="classic-direct-item-quantity">${quantity}</div>
      </div>
    `;

    // Update summary totals
    this.updateElementText('[data-modal-total-quantity]', totalQuantity.toString());
    this.updateElementText('[data-modal-subtotal]', `${totalSubtotal} جنيه`);
    this.updateElementText('[data-modal-total-discount]', totalDiscount > 0 ? `${totalDiscount} جنيه` : 'لا يوجد خصم');
    
    // Update final total in the main total section
    const finalTotal = totalSubtotal - totalDiscount;
    this.updateElementText('[data-modal-final-total]', `${finalTotal} جنيه`);
    
    console.log('Direct purchase totals:', {
      totalQuantity,
      totalSubtotal,
      totalDiscount,
      finalTotal
    });
  }

  private populateCustomOptions(customOptions: CustomOptionBundlesState[]): void {
    const container = this.elements.selectionItemsContainer;
    if (!container || !customOptions) return;

    container.innerHTML = customOptions.map(option => `
      <div class="classic-selection-item">
          <div class="classic-panel-info">القطعة ${option.panelIndex}</div>
          <div class="classic-color-display"><span>${option.firstOption ?? ""}</span></div>
          <div class="classic-size-display"><span>${option.secondOption ?? ""}</span></div>
      </div>
    `).join('');
  }

  private populateCustomerInfo(formData: FormData, paymentText: string): void {
    if (!formData) return;

    Object.entries(this.fieldMappings).forEach(([fieldName, selector]) => {
      if (fieldName === 'paymentOption') {
        this.updateElementText(selector, paymentText);
        return;
      }

      const fieldData = formData[fieldName];
      if (!fieldData) return;

      if (fieldName === 'notes') {
        const hasNotes = fieldData.value?.trim();
        if (this.elements.notesSection) {
          this.elements.notesSection.style.display = hasNotes ? 'flex' : 'none';
        }
        if (hasNotes) this.updateElementText(selector, fieldData.value);
      } else {
        this.updateElementText(selector, fieldData.value || '-');
      }
    });
  }

  // Public API - simplified method names
  public open = () => this.openModal();
  public close = () => this.closeModal();
  public showCelebration = () => this.showCelebrationView();
  public loadData = () => this.loadModalData();
}

// Registration and initialization
const initializeModal = () => {
  if (!customElements.get('classic-purchase-modal')) {
    customElements.define('classic-purchase-modal', ClassicPurchaseModal);
  }
};

document.addEventListener('DOMContentLoaded', initializeModal);
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('classic-purchase-modal:not(:defined)')
    .forEach(modal => {
      if (modal instanceof ClassicPurchaseModal) {
        modal.connectedCallback();
      }
    });
});

export { ClassicPurchaseModal };
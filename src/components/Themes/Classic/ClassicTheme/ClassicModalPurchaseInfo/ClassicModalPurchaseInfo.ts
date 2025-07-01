// ClassicModalPurchaseInfo.ts - Simplified Implementation

import { FormFieldsSubject } from '../../../../../lib/patterns/Observers/form-fields-observer';
import { DeliveryOptionsSubject } from '../../../../../lib/patterns/Observers/delivery-observer';
import { PaymentOptionsSubject } from '../../../../../lib/patterns/Observers/payment-observer';
import { CustomOptionsNonBundleSubject } from '../../../../../lib/patterns/Observers/custom-options-non-bundle';
import { BundleOptionsSubject } from '../../../../../lib/patterns/Observers/bundle-observer';
import { CustomOptionBundlesSubject, type CustomOption } from '../../../../../lib/patterns/Observers/custom-option-observer-bundles';
import { getTranslation, type Language } from '../../../../../lib/utils/i18n/translations';

// Simplified interfaces
interface ModalElements {
  modal: HTMLElement | null;
  overlay: HTMLElement | null;
  selectionItemsContainer: HTMLElement | null;
  cancelButton: HTMLElement | null;
  purchaseView: HTMLElement | null;
  celebrationView: HTMLElement | null;
  continueButton: HTMLElement | null;
}

interface ObserverSubjects {
  customOptionBundlesSubject: CustomOptionBundlesSubject;
  bundle: BundleOptionsSubject;
  formFields: FormFieldsSubject;
  delivery: DeliveryOptionsSubject;
  payment: PaymentOptionsSubject;
  customNonBundle: CustomOptionsNonBundleSubject;
}

class ClassicPurchaseModal extends HTMLElement {
  private elements: ModalElements = {
    modal: null,
    overlay: null,
    cancelButton: null,
    selectionItemsContainer: null,
    purchaseView: null,
    celebrationView: null,
    continueButton: null
  };
  private currentLang: Language = 'en';
  private subjects: ObserverSubjects;
  private hasVariants: boolean = false;
  private hasBundles: boolean = false;

  constructor() {
    super();
    // Initialize all observers
    this.subjects = {
      customOptionBundlesSubject: CustomOptionBundlesSubject.getInstance(),
      bundle: BundleOptionsSubject.getInstance(),
      formFields: FormFieldsSubject.getInstance(),
      delivery: DeliveryOptionsSubject.getInstance(),
      payment: PaymentOptionsSubject.getInstance(),
      customNonBundle: CustomOptionsNonBundleSubject.getInstance()
    };
    this.currentLang = this.detectLanguage();
  }

  connectedCallback() {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.loadSettings();
    this.cacheElements();
    this.setupEventListeners();
  }

  // === Initialization Methods ===

  private loadSettings(): void {
    this.hasVariants = this.getAttribute('data-has-variants') === 'true';
    this.hasBundles = this.getAttribute('data-has-bundles') === 'true';
  }

  private detectLanguage(): Language {
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('lang='))
      ?.split('=')[1];
    return (langCookie || 'en') as Language;
  }
  private cacheElements(): void {
    this.elements = {
      modal: this.querySelector('[data-modal-container]'),
      overlay: this.querySelector('[data-modal-overlay]'),
      cancelButton: this.querySelector('[data-modal-cancel-button]'),
      purchaseView: this.querySelector('[data-modal-purchase-info-view]'),
      selectionItemsContainer: this.querySelector('[data-modal-selection-items]'),
      celebrationView: this.querySelector('[data-modal-celebration-view]'),
      continueButton: this.querySelector('[data-modal-celebration-continue-button]')
    };
  }

  private setupEventListeners(): void {
    // Modal controls
    this.elements.cancelButton?.addEventListener('click', () => this.close());
    this.elements.continueButton?.addEventListener('click', () => this.handleContinue());

    // Global events
    document.addEventListener('openPurchaseModal', () => this.open());
    document.addEventListener('orderConfirmed', () => this.showCelebration());
  }

  // === Public API Methods ===

  public open(): void {
    if (!this.elements.modal) return;

    this.elements.modal.classList.add('classic-modal-open');
    this.toggleBodyScroll(false);
    this.showPurchaseView();
    this.loadAllData();

    this.dispatchEvent(new CustomEvent('modal-opened'));
  }

  public close(): void {
    if (!this.elements.modal) return;

    this.elements.modal.classList.remove('classic-modal-open');
    this.toggleBodyScroll(true);

    // Reset to purchase view after close
    setTimeout(() => this.showPurchaseView(), 300);

    this.dispatchEvent(new CustomEvent('modal-closed'));
  }

  public showCelebration(): void {
    this.showView('celebration');
    this.generateOrderNumber();
    this.createConfetti();

    this.dispatchEvent(new CustomEvent('celebration-shown'));
  }

  // === View Management ===

  private showPurchaseView(): void {
    this.showView('purchase');
  }

  private showView(viewType: 'purchase' | 'celebration'): void {
    const { purchaseView, celebrationView } = this.elements;

    if (viewType === 'purchase') {
      purchaseView!.style.display = 'block';
      celebrationView!.style.display = 'none';
    } else {
      purchaseView!.style.display = 'none';
      celebrationView!.style.display = 'block';
    }
  }

  // === Data Loading Methods ===

  private loadAllData(): void {
    try {
      // Get all current states
      const bundleState = this.subjects.bundle.getState();
      const customState = this.subjects.customNonBundle.getState();
      const formState = this.subjects.formFields.getState();
      const paymentState = this.subjects.payment.getState();
      const deliveryState = this.subjects.delivery.getState();

      // Load data based on product type
      if (this.hasBundles) {
        this.loadBundleData(bundleState);
      } else {
        this.loadDirectData(customState);
      }

      this.loadCustomerData(formState, paymentState, deliveryState);

      console.log('Modal data loaded successfully');
    } catch (error) {
      console.error('Failed to load modal data:', error);
    }
  }

  private loadBundleData(bundleState: any): void {
    const offer = bundleState.selectedOffer;
    if (!offer) return;

    const delivery = this.subjects.delivery.getState();
    const isPickup = delivery.selectedDeliveryOptionId === 'delivery-pickup';

    // Calculate final amounts
    const finalTotal = isPickup
      ? offer.final_total - offer.shipping_price
      : offer.final_total;

    // Update bundle information
    this.updateText('[data-modal-order-title]', offer.title);
    this.updateText('[data-modal-items-count]', offer.items.toString());
    this.updateText('[data-modal-price-per-item]', `${offer.price_per_item} جنيه`);
    this.updateText('[data-modal-final-total]', `${finalTotal} جنيه`);

    const discountText = offer.discount > 0
      ? `${offer.discount} جنيه (${offer.discount_percent})`
      : 'لا يوجد خصم';
    this.updateText('[data-modal-discount-info]', discountText);
    if (this.hasVariants) {
      const bundleOptions = this.subjects.customOptionBundlesSubject.getState();
      // Update Bundle custom options
      this.populateCustomOptions(bundleOptions.options);
    }

  }

  private populateCustomOptions(customOptions: CustomOption[]): void {
    const container = this.elements.selectionItemsContainer;
    if (!container || !customOptions) return;
    container.innerHTML = customOptions.map(option => `
      <div class="classic-selection-item">
          <div class="classic-panel-info">${getTranslation('modal.item', this.currentLang)} ${option.panelIndex}</div>
          <div class="classic-selection-display"><span>${option.firstOption}</span></div>
${option.secondOption ? `<div class="classic-selection-display"><span>${option.secondOption}</span></div>` : ""}
          </div>
    `).join('');
  }

  private loadDirectData(customState: any): void {
    const option = customState.option;
    if (!option) return;

    const quantity = option.qty || 1;
    const price = option.price || 0;
    const discountPrice = option.price_after_discount || price;
    const totalDiscount = (price - discountPrice) * quantity;
    const finalTotal = discountPrice * quantity;

    // Create direct purchase item display
    const container = this.querySelector('[data-modal-direct-items-container]');
    if (container) {
      container.innerHTML = this.createDirectItemHTML(option, quantity, price, discountPrice);
    }

    // Update totals
    this.updateText('[data-modal-total-quantity]', quantity.toString());
    this.updateText('[data-modal-subtotal]', `${price * quantity} جنيه`);
    this.updateText('[data-modal-total-discount]', totalDiscount > 0 ? `${totalDiscount} جنيه` : 'لا يوجد خصم');
    this.updateText('[data-modal-final-total]', `${finalTotal} جنيه`);
  }

  private loadCustomerData(formState: any, paymentState: any, deliveryState: any): void {
    const formData = formState.formData;
    if (!formData) return;

    // Customer information mapping
    const customerFields = {
      '[data-modal-customer-name]': formData.fullName?.value || '-',
      '[data-modal-customer-phone]': formData.phone?.value || '-',
      '[data-modal-customer-email]': formData.email?.value || '-',
      '[data-modal-customer-address]': formData.address?.value || '-',
      '[data-modal-customer-city]': formData.city?.value || '-',
      '[data-modal-payment-method]': paymentState.selectedPaymentOptionValue || '-',
      '[data-modal-delivery-method]': deliveryState.selectedDeliveryOptionValue || '-'
    };

    // Update all customer fields
    Object.entries(customerFields).forEach(([selector, value]) => {
      this.updateText(selector, value);
    });

    // Handle notes (optional field)
    const notes = formData.notes?.value?.trim();
    const notesSection = this.querySelector('[data-modal-notes-section]');
    if (notesSection !== null) {
      notesSection.style.display = notes ? 'flex' : 'none';
      if (notes) {
        this.updateText('[data-modal-customer-notes]', notes);
      }
    }
  }

  // === Helper Methods ===

  private createDirectItemHTML(option: any, quantity: number, price: number, discountPrice: number): string {
    const hasDiscount = price > discountPrice;
    const optionTags = [];

    if (option.firstOption) optionTags.push(`<span class="classic-direct-option-tag">${option.firstOption}</span>`);
    if (option.secondOption) optionTags.push(`<span class="classic-direct-option-tag">${option.secondOption}</span>`);

    return `
      <div class="classic-direct-item">
        <div class="classic-direct-item-info">
          <div class="classic-direct-item-title">المنتج المحدد</div>
          ${optionTags.length > 0 ? `<div class="classic-direct-item-options">${optionTags.join('')}</div>` : ''}
        </div>
        <div class="classic-direct-item-pricing">
          <div class="classic-direct-item-price">${discountPrice} جنيه</div>
          ${hasDiscount ? `<div class="classic-direct-item-original-price">${price} جنيه</div>` : ''}
          ${hasDiscount ? `<div class="classic-direct-item-discount">وفر ${price - discountPrice} جنيه</div>` : ''}
        </div>
        <div class="classic-direct-item-quantity">${quantity}</div>
      </div>
    `;
  }

  private updateText(selector: string, text: string): void {
    const element = this.querySelector(selector);
    if (element) element.textContent = text;
  }

  private toggleBodyScroll(enable: boolean): void {
    document.body.style.overflow = enable ? '' : 'hidden';
  }

  private generateOrderNumber(): void {
    const orderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
    this.updateText('[data-modal-order-number]', orderNumber);
  }

  private createConfetti(): void {
    setTimeout(() => {
      const emojis = ['🎉', '✨', '🎊', '🌟', '💫'];
      const container = this.elements.modal;
      if (!container) return;

      // Simple confetti animation
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const emoji = document.createElement('div');
          emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          emoji.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9999;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: float-up 3s ease-out forwards;
          `;

          container.appendChild(emoji);
          setTimeout(() => emoji.remove(), 3000);
        }, i * 200);
      }
    }, 800);
  }

  private handleContinue(): void {
    // Simple page reload for continue action
    window.location.reload();
  }

  // === Public Utility Methods ===

  public refresh(): void {
    this.loadAllData();
  }

  public getCurrentData(): any {
    return {
      bundle: this.subjects.bundle.getState(),
      custom: this.subjects.customNonBundle.getState(),
      form: this.subjects.formFields.getState(),
      payment: this.subjects.payment.getState(),
      delivery: this.subjects.delivery.getState()
    };
  }
}

// === Component Registration ===

class ModalManager {
  private static readonly COMPONENT_NAME = 'classic-purchase-modal';

  public static initialize(): void {
    this.registerComponent();
    this.addGlobalCSS();
    this.setupEventListeners();
  }

  private static registerComponent(): void {
    if (!customElements.get(this.COMPONENT_NAME)) {
      customElements.define(this.COMPONENT_NAME, ClassicPurchaseModal);
    }
  }

  private static addGlobalCSS(): void {
    if (!document.getElementById('modal-animations')) {
      const style = document.createElement('style');
      style.id = 'modal-animations';
      style.textContent = `
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private static setupEventListeners(): void {
    document.addEventListener('DOMContentLoaded', this.handleDOMReady.bind(this));
    document.addEventListener('astro:page-load', this.handleAstroPageLoad.bind(this));
  }

  private static handleDOMReady(): void {
    // Component registration handles initialization
  }

  private static handleAstroPageLoad(): void {
    const undefinedModals = document.querySelectorAll(`${this.COMPONENT_NAME}:not(:defined)`);
    undefinedModals.forEach(modal => {
      if (modal instanceof ClassicPurchaseModal) {
        modal.connectedCallback();
      }
    });
  }
}

// Initialize the modal system
ModalManager.initialize();

export { ClassicPurchaseModal };
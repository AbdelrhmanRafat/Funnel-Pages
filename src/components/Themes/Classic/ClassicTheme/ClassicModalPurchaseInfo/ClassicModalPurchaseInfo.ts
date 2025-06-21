// ClassicModalPurchaseInfo.ts - Web Component for Purchase Modal

import { ColorSizeOptionsSubject , QuantityOptionsSubject, FormFieldsSubject, type ColorSizeOption, DeliveryOptionsSubject, PaymentOptionsSubject } from '../../../../../lib/patterns/Observer';

interface QuantityItem {
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

interface PurchaseModalElements {
  modal: HTMLElement | null;
  overlay: HTMLElement | null;
  closeButton: HTMLElement | null;
  cancelButton: HTMLElement | null;
  purchaseInfoView: HTMLElement | null;
  celebrationView: HTMLElement | null;
  celebrationCloseButton: HTMLElement | null;
  celebrationContinueButton: HTMLElement | null;
  orderNumberElement: HTMLElement | null;
  selectionItemsContainer: HTMLElement | null;
  notesSection: HTMLElement | null;
}

class ClassicPurchaseModal extends HTMLElement {
  private elements: PurchaseModalElements = {
    modal: null,
    overlay: null,
    closeButton: null,
    cancelButton: null,
    purchaseInfoView: null,
    celebrationView: null,
    celebrationCloseButton: null,
    celebrationContinueButton: null,
    orderNumberElement: null,
    selectionItemsContainer: null,
    notesSection: null
  };
  
  // Observer subjects
  private colorSizeSubject: ColorSizeOptionsSubject;
  private quantitySubject: QuantityOptionsSubject;
  private paymentOptionsSubject : PaymentOptionsSubject;
  private formFieldsSubject: FormFieldsSubject;
  private deliverySubject: DeliveryOptionsSubject;
  
  // Configuration
  private autoLoadData: boolean = true;
  private showConfetti: boolean = true;
  private preventBodyScroll: boolean = true;
  private closeOnOverlayClick: boolean = true;
  private autoGenerateOrderNumber: boolean = true;
  private language: string = 'en';
  private isArabic: boolean = false;

  constructor() {
    super();
    this.colorSizeSubject = ColorSizeOptionsSubject.getInstance();
    this.quantitySubject = QuantityOptionsSubject.getInstance();
    this.formFieldsSubject = FormFieldsSubject.getInstance();
    this.deliverySubject = DeliveryOptionsSubject.getInstance();
    this.paymentOptionsSubject = PaymentOptionsSubject.getInstance();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupEventListeners();
  }

  private initializeSettings(): void {
    this.autoLoadData = this.getAttribute('data-modal-auto-load-data') !== 'false';
    this.showConfetti = this.getAttribute('data-modal-show-confetti') !== 'false';
    this.preventBodyScroll = this.getAttribute('data-modal-prevent-body-scroll') !== 'false';
    this.closeOnOverlayClick = this.getAttribute('data-modal-close-on-overlay-click') !== 'false';
    this.autoGenerateOrderNumber = this.getAttribute('data-modal-auto-generate-order-number') !== 'false';
    this.language = this.getAttribute('data-modal-language') || 'en';
    this.isArabic = this.getAttribute('data-modal-is-arabic') === 'true';
  }

  private initializeElements(): void {
    this.elements = {
      modal: this.querySelector('[data-modal-container]') as HTMLElement,
      overlay: this.querySelector('[data-modal-overlay]') as HTMLElement,
      closeButton: this.querySelector('[data-modal-close-button]') as HTMLElement,
      cancelButton: this.querySelector('[data-modal-cancel-button]') as HTMLElement,
      purchaseInfoView: this.querySelector('[data-modal-purchase-info-view]') as HTMLElement,
      celebrationView: this.querySelector('[data-modal-celebration-view]') as HTMLElement,
      celebrationCloseButton: this.querySelector('[data-modal-celebration-close-button]') as HTMLElement,
      celebrationContinueButton: this.querySelector('[data-modal-celebration-continue-button]') as HTMLElement,
      orderNumberElement: this.querySelector('[data-modal-order-number]') as HTMLElement,
      selectionItemsContainer: this.querySelector('[data-modal-selection-items]') as HTMLElement,
      notesSection: this.querySelector('[data-modal-notes-section]') as HTMLElement
    };

    if (!this.elements.modal) {
      console.warn('Purchase Modal: Modal container not found');
    }
  }

  private setupEventListeners(): void {
    // Modal control event listeners
    if (this.closeOnOverlayClick && this.elements.overlay) {
      this.elements.overlay.addEventListener('click', () => this.closeModal());
    }
    
    this.elements.closeButton?.addEventListener('click', () => this.closeModal());
    this.elements.cancelButton?.addEventListener('click', () => this.closeModal());
    this.elements.celebrationCloseButton?.addEventListener('click', () => this.closeModal());
    this.elements.celebrationContinueButton?.addEventListener('click', () => this.closeModal());

    // Custom events
    document.addEventListener('openPurchaseModal', () => this.openModal());
    document.addEventListener('orderConfirmed', () => this.showCelebrationView());
  }

  private openModal(): void {
    if (!this.elements.modal) return;

    // Dispatch event before opening
    this.dispatchEvent(new CustomEvent('modal-opening', {
      detail: { autoLoadData: this.autoLoadData }
    }));

    this.elements.modal.classList.add('classic-modal-open');
    
    if (this.preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }
    
    // Reset to purchase info view
    this.showPurchaseInfoView();
    
    // Load data when modal opens if auto-load is enabled
    if (this.autoLoadData) {
      this.loadModalData();
    }

    // Dispatch event after opening
    this.dispatchEvent(new CustomEvent('modal-opened', {
      detail: { view: 'purchase-info' }
    }));
  }

  private closeModal(): void {
    if (!this.elements.modal) return;

    // Dispatch event before closing
    this.dispatchEvent(new CustomEvent('modal-closing'));

    this.elements.modal.classList.remove('classic-modal-open');
    
    if (this.preventBodyScroll) {
      document.body.style.overflow = '';
    }
    
    // Reset to purchase info view for next time
    setTimeout(() => {
      this.showPurchaseInfoView();
    }, 300); // Wait for modal close animation

    // Dispatch event after closing
    this.dispatchEvent(new CustomEvent('modal-closed'));
  }

  private showPurchaseInfoView(): void {
    if (!this.elements.purchaseInfoView || !this.elements.celebrationView) return;

    this.elements.purchaseInfoView.style.display = 'block';
    this.elements.celebrationView.style.display = 'none';

    this.dispatchEvent(new CustomEvent('view-changed', {
      detail: { view: 'purchase-info' }
    }));
  }

  private showCelebrationView(): void {
    if (!this.elements.purchaseInfoView || !this.elements.celebrationView) return;

    // Dispatch event before view change
    this.dispatchEvent(new CustomEvent('celebration-starting'));

    // Hide purchase info view
    this.elements.purchaseInfoView.style.display = 'none';
    
    // Show celebration view with animation
    this.elements.celebrationView.style.display = 'block';
    
    // Generate a random order number if enabled
    if (this.autoGenerateOrderNumber) {
      this.generateOrderNumber();
    }
    
    // Trigger confetti effect if enabled
    if (this.showConfetti) {
      this.triggerConfettiEffect();
    }

    this.dispatchEvent(new CustomEvent('view-changed', {
      detail: { view: 'celebration' }
    }));
  }

  private generateOrderNumber(): void {
    if (!this.elements.orderNumberElement) return;

    const orderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
    this.elements.orderNumberElement.textContent = orderNumber;

    this.dispatchEvent(new CustomEvent('order-number-generated', {
      detail: { orderNumber }
    }));
  }

  private triggerConfettiEffect(): void {
    // Optional: Add confetti effect using CSS animations
    setTimeout(() => {
      this.createFloatingEmojis();
    }, 800);
  }

  private createFloatingEmojis(): void {
    const emojis = ['🎉', '✨', '🎊', '🌟', '💫'];
    const modalContainer = this.querySelector('.classic-modal-container');
    
    if (!modalContainer) return;

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
          position: absolute;
          font-size: 1.5rem;
          pointer-events: none;
          z-index: 9999;
          animation: float-up 3s ease-out forwards;
          left: ${Math.random() * 100}%;
          top: 100%;
        `;
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-200px) rotate(360deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
        
        modalContainer.appendChild(emoji);
        
        // Remove emoji after animation
        setTimeout(() => {
          if (emoji.parentNode) {
            emoji.parentNode.removeChild(emoji);
          }
        }, 3000);
      }, i * 200);
    }

    this.dispatchEvent(new CustomEvent('confetti-triggered'));
  }

  private loadModalData(): void {
    try {
      // Dispatch event before loading data
      this.dispatchEvent(new CustomEvent('data-loading-start'));

      // Get data from observers
      const colorSizeState = this.colorSizeSubject.getState();
      const quantityState = this.quantitySubject.getState();
      const formFieldsState = this.formFieldsSubject.getState();
      const paymentOptionsState = this.paymentOptionsSubject.getState();
      const deliveryState = this.deliverySubject.getState();
      
      // Populate data sections
      this.populateQuantityInfo(quantityState.selectedItem);
      this.populateColorSizeInfo(colorSizeState.options);
      this.populateCustomerInfo(formFieldsState.formData, paymentOptionsState.selectedPaymentOptionValue ?? "");
      
      // Dispatch event after loading data
      this.dispatchEvent(new CustomEvent('data-loaded', {
        detail: {
          colorSize: colorSizeState.options,
          quantity: quantityState.selectedItem,
          formData: formFieldsState.formData,
          paymentData : paymentOptionsState.selectedPaymentOptionValue,
          delivery: deliveryState
        }
      }));

      console.log('Modal data loaded:', {
        colorSize: colorSizeState.options,
        quantity: quantityState.selectedItem,
        formData: formFieldsState.formData,
        payment : paymentOptionsState.selectedPaymentOptionValue
      });
    } catch (error) {
      console.error('Error loading modal data:', error);
      this.dispatchEvent(new CustomEvent('data-loading-error', {
        detail: { error }
      }));
    }
  }

  private populateQuantityInfo(quantityData: QuantityItem | null): void {
    if (!quantityData) return;

    // Get delivery option state
    const deliveryState = this.deliverySubject.getState();

    // Calculate actual final total and shipping based on delivery option
    let actualShipping = quantityData.shipping_price;
    let actualFinalTotal = quantityData.final_total;
    if (deliveryState.selectedDeliveryOptionId === 'delivery-pickup') {
      actualFinalTotal = Number(quantityData.final_total) - Number(quantityData.shipping_price);
      actualShipping = 0;
    }

    // Update quantity information using data attributes
    this.updateElementText('[data-modal-order-title]', quantityData.title);
    this.updateElementText('[data-modal-items-count]', quantityData.items.toString());
    this.updateElementText('[data-modal-price-per-item]', `${quantityData.price_per_item} جنيه`);
    
    // Handle discount information
    if (quantityData.discount > 0) {
      this.updateElementText('[data-modal-discount-info]', `${quantityData.discount} جنيه (${quantityData.discount_percent})`);
      const discountElement = this.querySelector('[data-modal-discount-info]');
      if (discountElement) {
        discountElement.classList.add('classic-discount-info');
      }
    } else {
      this.updateElementText('[data-modal-discount-info]', 'لا يوجد خصم');
    }
    
    // Update final total
    this.updateElementText('[data-modal-final-total]', `${actualFinalTotal} جنيه`);
  }

  private populateColorSizeInfo(colorSizeOptions: ColorSizeOption[]): void {
    if (!this.elements.selectionItemsContainer || !colorSizeOptions) return;

    this.elements.selectionItemsContainer.innerHTML = '';

    colorSizeOptions.forEach((option) => {
      const selectionItem = document.createElement('div');
      selectionItem.className = 'classic-selection-item';
      
      selectionItem.innerHTML = `
        <div class="classic-panel-info">القطعة ${option.panelIndex}</div>
        <div class="classic-selection-details flex justify-center gap-3 items-center">
          <div class="classic-color-display">
            <span>${option.color}</span>
          </div>
          <div class="classic-size-display">
          <span>${option.size}</span>
          </div>
        </div>
      `;
      
      this.elements.selectionItemsContainer.appendChild(selectionItem);
    });
  }

  private populateCustomerInfo(formData: FormData, paymentText : string): void {
    if (!formData) return;

    // Map form field names to display elements using data attributes
    const fieldMappings = {
      fullName: '[data-modal-customer-name]',
      phone: '[data-modal-customer-phone]',
      email: '[data-modal-customer-email]',
      address: '[data-modal-customer-address]',
      city: '[data-modal-customer-city]',
      paymentOption : '[data-modal-payment-method]',
      notes: '[data-modal-customer-notes]'
    };

    Object.entries(fieldMappings).forEach(([fieldName, selector]) => {
      if (fieldName === 'paymentOption') 
          {
          // Translate payment method
          console.log("NJSJKNKSNKSNK");
          this.updateElementText(selector, paymentText);
        }
      const fieldData = formData[fieldName];
      if (fieldData) {
        console.log(fieldName);
        if (fieldName === 'notes') {
          // Handle notes - show/hide section based on content
          if (fieldData.value && fieldData.value.trim()) {
            this.updateElementText(selector, fieldData.value);
            if (this.elements.notesSection) {
              this.elements.notesSection.style.display = 'flex';
            }
          } else {
            if (this.elements.notesSection) {
              this.elements.notesSection.style.display = 'none';
            }
          }
        } else {
          this.updateElementText(selector, fieldData.value || '-');
        }
      }
    });
  }

  private updateElementText(selector: string, text: string): void {
    const element = this.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  // Public API methods
  public openModalManually(): void {
    this.openModal();
  }

  public closeModalManually(): void {
    this.closeModal();
  }

  public showCelebrationManually(): void {
    this.showCelebrationView();
  }

  public loadDataManually(): void {
    this.loadModalData();
  }

  public getCurrentView(): string {
    if (this.elements.celebrationView?.style.display !== 'none') {
      return 'celebration';
    }
    return 'purchase-info';
  }

  public enableAutoLoadData(enable: boolean): void {
    this.autoLoadData = enable;
    this.setAttribute('data-modal-auto-load-data', enable.toString());
  }

  public enableConfetti(enable: boolean): void {
    this.showConfetti = enable;
    this.setAttribute('data-modal-show-confetti', enable.toString());
  }

  public enableBodyScrollPrevention(enable: boolean): void {
    this.preventBodyScroll = enable;
    this.setAttribute('data-modal-prevent-body-scroll', enable.toString());
  }

  public enableOverlayClose(enable: boolean): void {
    this.closeOnOverlayClick = enable;
    this.setAttribute('data-modal-close-on-overlay-click', enable.toString());
  }

  public setOrderNumber(orderNumber: string): void {
    if (this.elements.orderNumberElement) {
      this.elements.orderNumberElement.textContent = orderNumber;
    }
  }

  public getOrderNumber(): string | null {
    return this.elements.orderNumberElement?.textContent || null;
  }

  public getModalData(): any {
    return {
      colorSize: this.colorSizeSubject.getState(),
      quantity: this.quantitySubject.getState(),
      formData: this.formFieldsSubject.getState(),
      delivery: this.deliverySubject.getState()
    };
  }

  public getObserverSubjects(): any {
    return {
      colorSizeSubject: this.colorSizeSubject,
      quantitySubject: this.quantitySubject,
      formFieldsSubject: this.formFieldsSubject,
      deliverySubject: this.deliverySubject
    };
  }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('classic-purchase-modal')) {
    customElements.define('classic-purchase-modal', ClassicPurchaseModal);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const purchaseModals = document.querySelectorAll('classic-purchase-modal:not(:defined)');
  purchaseModals.forEach(modal => {
    if (modal instanceof ClassicPurchaseModal) {
      modal.connectedCallback();
    }
  });
});

export { ClassicPurchaseModal };
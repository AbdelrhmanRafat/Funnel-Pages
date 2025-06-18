import { ColorSizeOptionsSubject, QuantityOptionsSubject, FormFieldsSubject } from '../../../../../lib/patterns/Observer';

interface ColorSizeOption {
  panelIndex: number;
  color: string;
  size: string;
}

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

class ClassicModalPurchaseInfo {
  private modal: HTMLElement | null;
  private overlay: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private cancelButton: HTMLElement | null;
  private purchaseInfoView: HTMLElement | null;
  private celebrationView: HTMLElement | null;
  private celebrationCloseButton: HTMLElement | null;
  private celebrationContinueButton: HTMLElement | null;

  constructor() {
    this.modal = document.getElementById('classic-purchase-modal');
    this.overlay = document.getElementById('classic-modal-overlay');
    this.closeButton = document.getElementById('classic-modal-close');
    this.cancelButton = document.getElementById('classic-modal-cancel');
    this.purchaseInfoView = document.getElementById('purchase-info-view');
    this.celebrationView = document.getElementById('celebration-view');
    this.celebrationCloseButton = document.getElementById('classic-modal-close-celebration');
    this.celebrationContinueButton = document.getElementById('celebration-continue');
    
    this.initialize();
  }

  private initialize(): void {
    // Add event listeners for original modal controls
    this.overlay?.addEventListener('click', () => this.closeModal());
    this.closeButton?.addEventListener('click', () => this.closeModal());
    this.cancelButton?.addEventListener('click', () => this.closeModal());

    // Add event listeners for celebration view controls
    this.celebrationCloseButton?.addEventListener('click', () => this.closeModal());
    this.celebrationContinueButton?.addEventListener('click', () => this.closeModal());

    // Listen for custom events
    document.addEventListener('openPurchaseModal', () => this.openModal());
    document.addEventListener('orderConfirmed', () => this.showCelebrationView());
  }

  private openModal(): void {
    if (this.modal) {
      this.modal.classList.add('classic-modal-open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Reset to purchase info view
      this.showPurchaseInfoView();
      
      // Load data when modal opens
      this.loadModalData();
    }
  }

  private closeModal(): void {
    if (this.modal) {
      this.modal.classList.remove('classic-modal-open');
      document.body.style.overflow = ''; // Restore scrolling
      
      // Reset to purchase info view for next time
      setTimeout(() => {
        this.showPurchaseInfoView();
      }, 300); // Wait for modal close animation
    }
  }

  private showPurchaseInfoView(): void {
    if (this.purchaseInfoView && this.celebrationView) {
      this.purchaseInfoView.style.display = 'block';
      this.celebrationView.style.display = 'none';
    }
  }

  private showCelebrationView(): void {
    if (this.purchaseInfoView && this.celebrationView) {
      // Hide purchase info view
      this.purchaseInfoView.style.display = 'none';
      
      // Show celebration view with animation
      this.celebrationView.style.display = 'block';
      
      // Generate a random order number
      this.generateOrderNumber();
      
      // Trigger confetti effect (optional)
      this.triggerConfettiEffect();
    }
  }

  private generateOrderNumber(): void {
    const orderNumberElement = document.getElementById('order-number');
    if (orderNumberElement) {
      const orderNumber = '#' + Math.floor(Math.random() * 900000 + 100000);
      orderNumberElement.textContent = orderNumber;
    }
  }

  private triggerConfettiEffect(): void {
    // Optional: Add confetti effect using CSS animations or a library
    // For now, we'll add some floating animation elements
    setTimeout(() => {
      this.createFloatingEmojis();
    }, 800);
  }

  private createFloatingEmojis(): void {
    const emojis = ['🎉', '✨', '🎊', '🌟', '💫'];
    const modalContainer = document.querySelector('.classic-modal-container');
    
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
  }

  private loadModalData(): void {
    try {
      // Get data from observers
      const colorSizeSubject = ColorSizeOptionsSubject.getInstance();
      const quantitySubject = QuantityOptionsSubject.getInstance();
      const formFieldsSubject = FormFieldsSubject.getInstance();
      
      const colorSizeState = colorSizeSubject.getState();
      const quantityState = quantitySubject.getState();
      const formFieldsState = formFieldsSubject.getState();

      // Populate quantity information
      this.populateQuantityInfo(quantityState.selectedItem);
      
      // Populate color/size selections
      this.populateColorSizeInfo(colorSizeState.options);
      
      // Populate customer information
      this.populateCustomerInfo(formFieldsState.formData);
      
      console.log('Modal data loaded:', {
        colorSize: colorSizeState.options,
        quantity: quantityState.selectedItem,
        formData: formFieldsState.formData
      });
    } catch (error) {
      console.error('Error loading modal data:', error);
    }
  }

  private populateQuantityInfo(quantityData: QuantityItem | null): void {
    if (!quantityData) return;

    // Update quantity information
    this.updateElementText('order-title', quantityData.title);
    this.updateElementText('items-count', quantityData.items.toString());
    this.updateElementText('price-per-item', `${quantityData.price_per_item} جنيه`);
    
    // Handle discount information
    if (quantityData.discount > 0) {
      this.updateElementText('discount-info', `${quantityData.discount} جنيه (${quantityData.discount_percent})`);
      const discountElement = document.getElementById('discount-info');
      if (discountElement) {
        discountElement.classList.add('classic-discount-info');
      }
    } else {
      this.updateElementText('discount-info', 'لا يوجد خصم');
    }
    
    // Update final total
    this.updateElementText('final-total', `${quantityData.final_total} جنيه`);
  }

  private populateColorSizeInfo(colorSizeOptions: ColorSizeOption[]): void {
    const container = document.getElementById('selection-items');
    if (!container || !colorSizeOptions) return;

    container.innerHTML = '';

    colorSizeOptions.forEach((option) => {
      const selectionItem = document.createElement('div');
      selectionItem.className = 'classic-selection-item';
      
      selectionItem.innerHTML = `
        <div class="classic-panel-info">القطعة ${option.panelIndex}</div>
        <div class="classic-selection-details">
          <div class="classic-color-display">
            <span>اللون: ${option.color}</span>
          </div>
          <div class="classic-size-display">${option.size}</div>
        </div>
      `;
      
      container.appendChild(selectionItem);
    });
  }

  private populateCustomerInfo(formData: FormData): void {
    if (!formData) return;

    // Map form field names to display elements
    const fieldMappings = {
      fullName: 'customer-name',
      phone: 'customer-phone',
      email: 'customer-email',
      address: 'customer-address',
      city: 'customer-city',
      paymentOption: 'payment-method',
      notes: 'customer-notes'
    };

    Object.entries(fieldMappings).forEach(([fieldName, elementId]) => {
      const fieldData = formData[fieldName];
      if (fieldData) {
        if (fieldName === 'paymentOption') {
          // Translate payment method
          const paymentText = fieldData.value === 'cashOnDelivery' ? 'الدفع عند الاستلام' : fieldData.value;
          this.updateElementText(elementId, paymentText);
        } else if (fieldName === 'notes') {
          // Handle notes - show/hide section based on content
          const notesSection = document.getElementById('notes-section');
          if (fieldData.value && fieldData.value.trim()) {
            this.updateElementText(elementId, fieldData.value);
            if (notesSection) {
              notesSection.style.display = 'flex';
            }
          } else {
            if (notesSection) {
              notesSection.style.display = 'none';
            }
          }
        } else {
          this.updateElementText(elementId, fieldData.value || '-');
        }
      }
    });
  }

  private updateElementText(elementId: string, text: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }
}

// Initialize the modal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ClassicModalPurchaseInfo();
});
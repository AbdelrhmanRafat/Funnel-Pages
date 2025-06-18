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
  private confirmButton: HTMLElement | null;

  constructor() {
    this.modal = document.getElementById('classic-purchase-modal');
    this.overlay = document.getElementById('classic-modal-overlay');
    this.closeButton = document.getElementById('classic-modal-close');
    this.cancelButton = document.getElementById('classic-modal-cancel');
    this.confirmButton = document.getElementById('classic-modal-confirm');
    
    this.initialize();
  }

  private initialize(): void {
    // Add event listeners
    this.overlay?.addEventListener('click', () => this.closeModal());
    this.closeButton?.addEventListener('click', () => this.closeModal());
    this.cancelButton?.addEventListener('click', () => this.closeModal());
    this.confirmButton?.addEventListener('click', () => this.handleConfirm());

    // Listen for custom open event
    document.addEventListener('openPurchaseModal', () => this.openModal());
  }

  private openModal(): void {
    if (this.modal) {
      this.modal.classList.add('classic-modal-open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      
      // Load data when modal opens
      this.loadModalData();
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

  private closeModal(): void {
    if (this.modal) {
      this.modal.classList.remove('classic-modal-open');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  private handleConfirm(): void {
    // Only close the modal as requested
    console.log('Order confirmed - modal closing');
    this.closeModal();
  }
}

// Initialize the modal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ClassicModalPurchaseInfo();
});
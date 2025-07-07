class NasaConfirmPurchaseButton {
  private confirmButton: HTMLElement | null;
  private confirmText: HTMLElement | null;
  private loadingSpinner: HTMLElement | null;

  constructor() {
    this.confirmButton = document.querySelector('[nasa-confirm-purchase]');
    this.confirmText = this.confirmButton?.querySelector('.confirm-text') || null;
    this.loadingSpinner = this.confirmButton?.querySelector('.loading-spinner') || null;
    this.initialize();
  }

  private initialize(): void {
    this.confirmButton?.addEventListener('click', () => this.handleConfirm());
  }

  private async handleConfirm(): Promise<void> {
    if (!this.confirmButton) return;
    
    // Prevent multiple clicks
    if (this.confirmButton.classList.contains('loading')) return;
    
    try {
      // Show loading state
      this.setLoadingState(true);
      
      // Process order (replace with actual API call)
      await this.processOrder();
      this.setLoadingState(false);
      // Transform modal to celebration view
      this.showCelebrationMessage();
      
    } catch (error) {
      console.error('Order processing failed:', error);
      this.setLoadingState(false);
      // Handle error (you can add error message display here)
      this.showErrorMessage();
    }
  }

  private setLoadingState(isLoading: boolean): void {
    if (!this.confirmButton || !this.confirmText || !this.loadingSpinner) return;

    if (isLoading) {
      // Add loading class to button
      this.confirmButton.classList.add('loading');
      
      // Hide confirm text and show spinner
      this.confirmText.style.opacity = '0';
      this.loadingSpinner.style.display = 'inline-flex';
      
      // Disable button interactions
      this.confirmButton.setAttribute('aria-busy', 'true');
      this.confirmButton.setAttribute('disabled', 'true');
      
    } else {
      // Remove loading class from button
      this.confirmButton.classList.remove('loading');
      
      // Show confirm text and hide spinner
      this.confirmText.style.opacity = '1';
      this.loadingSpinner.style.display = 'none';
      
      // Re-enable button interactions
      this.confirmButton.removeAttribute('aria-busy');
      this.confirmButton.removeAttribute('disabled');
    }
  }

  private async processOrder(): Promise<void> {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          resolve();
        } else {
          reject(new Error('Order processing failed'));
        }
      }, 2000); // 2 second delay for demonstration
    });
  }

  private showCelebrationMessage(): void {
    // Dispatch custom event to transform modal
    document.dispatchEvent(new CustomEvent('orderConfirmed', {
      detail: {
        timestamp: new Date().toISOString(),
        success: true
      }
    }));
  }

  private showErrorMessage(): void {
    // You can dispatch an error event or show inline error
    document.dispatchEvent(new CustomEvent('orderError', {
      detail: {
        timestamp: new Date().toISOString(),
        error: 'Failed to process order. Please try again.'
      }
    }));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NasaConfirmPurchaseButton();
});
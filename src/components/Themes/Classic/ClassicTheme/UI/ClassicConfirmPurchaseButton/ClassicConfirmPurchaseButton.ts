class ClassicConfirmPurchaseButton {
  private confirmButton: HTMLElement | null;

  constructor() {
    this.confirmButton = document.getElementById('classic-modal-confirm');
    this.initialize();
  }

  private initialize(): void {
    this.confirmButton?.addEventListener('click', () => this.handleConfirm());
  }

  private async handleConfirm(): Promise<void> {
    if (!this.confirmButton) return;
    
    try {
      // Show loading state
      this.setLoadingState(true);
      // Simulate order processing (replace with actual API call)
      await this.processOrder();
      // Transform modal to celebration view
      this.showCelebrationMessage();
      
    } catch (error) {
      console.error('Order processing failed:', error);
      this.setLoadingState(false);
      // Handle error (you can add error message display here)
    }
  }

  private setLoadingState(isLoading: boolean): void {
    if (!this.confirmButton) return;

    if (isLoading) {
      this.confirmButton.classList.add('loading');
      this.confirmButton.setAttribute('disabled', 'true');
    } else {
      this.confirmButton.classList.remove('loading');
      this.confirmButton.removeAttribute('disabled');
    }
  }

  private async processOrder(): Promise<void> {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // 2 second delay for demonstration
    });
  }

  private showCelebrationMessage(): void {
    // Dispatch custom event to transform modal
    document.dispatchEvent(new CustomEvent('orderConfirmed'));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ClassicConfirmPurchaseButton();
});
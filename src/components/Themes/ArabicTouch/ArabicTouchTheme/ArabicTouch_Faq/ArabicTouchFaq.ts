// ArabicTouchFaq-ModernCards.ts - Modern Card Layout with Modal
class FaqModernCards {
    private cards: NodeListOf<HTMLElement>;
    private modal: HTMLElement | null;
    private modalTitle: HTMLElement | null;
    private modalContent: HTMLElement | null;
    private isInitialized: boolean = false;
    private faqs: Array<{label: string, content: string}> = [];

    constructor() {
        this.cards = document.querySelectorAll('[data-faq-card]');
        this.modal = document.getElementById('faq-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalContent = document.getElementById('modal-content');
    }

    public init(): void {
        if (this.isInitialized) return;
        
        this.extractFaqData();
        this.attachEventListeners();
        this.setupAccessibility();
        this.isInitialized = true;
    }

    public destroy(): void {
        this.removeEventListeners();
        this.isInitialized = false;
    }

    private extractFaqData(): void {
        this.cards.forEach((card, index) => {
            const title = card.querySelector('.arabictouch-faq-cardTitle')?.textContent || '';
            const preview = card.querySelector('.arabictouch-faq-cardPreview')?.textContent || '';
            
            // For this example, we'll use the preview as content
            // In a real implementation, you'd have the full content available
            this.faqs[index] = {
                label: title,
                content: preview.replace('...', '') // Remove the ellipsis
            };
        });
    }

    private setupAccessibility(): void {
        this.cards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-expanded', 'false');
            card.setAttribute('aria-controls', `faq-modal-${index}`);
        });

        // Setup modal accessibility
        if (this.modal) {
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }

    private attachEventListeners(): void {
        // Card click handlers
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => this.openModal(index));
            card.addEventListener('keydown', (e) => this.handleCardKeydown(e, index));
        });

        // Modal close handlers
        if (this.modal) {
            const closeButtons = this.modal.querySelectorAll('[data-modal-close]');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.closeModal());
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isModalOpen()) {
                    this.closeModal();
                }
            });

            // Trap focus in modal
            this.modal.addEventListener('keydown', (e) => this.trapFocus(e));
        }

        // Keyboard navigation between cards
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }

    private removeEventListeners(): void {
        this.cards.forEach((card, index) => {
            card.removeEventListener('click', () => this.openModal(index));
            card.removeEventListener('keydown', (e) => this.handleCardKeydown(e, index));
        });
    }

    private handleCardKeydown(event: KeyboardEvent, index: number): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.openModal(index);
        }
    }

    private handleGlobalKeydown(event: KeyboardEvent): void {
        if (this.isModalOpen()) return; // Don't handle if modal is open

        const currentIndex = Array.from(this.cards).findIndex(card => 
            document.activeElement === card
        );

        if (currentIndex === -1) return;

        let nextIndex: number;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = (currentIndex + 1) % this.cards.length;
                (this.cards[nextIndex] as HTMLElement).focus();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = currentIndex === 0 ? this.cards.length - 1 : currentIndex - 1;
                (this.cards[nextIndex] as HTMLElement).focus();
                break;
            case 'Home':
                event.preventDefault();
                (this.cards[0] as HTMLElement).focus();
                break;
            case 'End':
                event.preventDefault();
                (this.cards[this.cards.length - 1] as HTMLElement).focus();
                break;
        }
    }

    private openModal(index: number): void {
        if (!this.modal || !this.modalTitle || !this.modalContent) return;

        const faq = this.faqs[index];
        if (!faq) return;

        // Update modal content
        this.modalTitle.textContent = faq.label;
        this.modalContent.textContent = faq.content;

        // Show modal
        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');

        // Update card aria-expanded
        this.cards[index].setAttribute('aria-expanded', 'true');

        // Focus the close button
        const closeButton = this.modal.querySelector('[data-modal-close]') as HTMLElement;
        if (closeButton) {
            closeButton.focus();
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Dispatch custom event
        this.dispatchEvent('faq:modalOpened', { index, faq });
    }

    private closeModal(): void {
        if (!this.modal) return;

        // Hide modal
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');

        // Reset all card aria-expanded
        this.cards.forEach(card => {
            card.setAttribute('aria-expanded', 'false');
        });

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to the previously focused card
        const focusedCardIndex = Array.from(this.cards).findIndex(card => 
            card.getAttribute('aria-expanded') === 'true'
        );
        
        if (focusedCardIndex !== -1) {
            (this.cards[focusedCardIndex] as HTMLElement).focus();
        }

        // Dispatch custom event
        this.dispatchEvent('faq:modalClosed', {});
    }

    private isModalOpen(): boolean {
        return this.modal?.classList.contains('show') || false;
    }

    private trapFocus(event: KeyboardEvent): void {
        if (!this.modal || event.key !== 'Tab') return;

        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    private dispatchEvent(eventName: string, detail: any): void {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail
        });
        document.dispatchEvent(event);
    }
}

// Initialize the component
const initializeFaqModernCards = (): void => {
    try {
        const faqModernCards = new FaqModernCards();
        faqModernCards.init();

        // Store instance for potential cleanup
        (window as any).faqModernCardsInstance = faqModernCards;
    } catch (error) {
        console.error('Failed to initialize FAQ Modern Cards:', error);
    }
};

// Multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFaqModernCards);
} else {
    initializeFaqModernCards();
}

// Astro-specific handling
document.addEventListener('astro:page-load', initializeFaqModernCards);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    const instance = (window as any).faqModernCardsInstance;
    if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
    }
});

export { FaqModernCards };
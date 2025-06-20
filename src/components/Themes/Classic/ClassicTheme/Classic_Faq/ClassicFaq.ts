// ClassicFaq.ts - Web Components that work with existing HTML structure

class FaqItem extends HTMLElement {
    private button: HTMLButtonElement | null = null;
    private answer: HTMLDivElement | null = null;
    private icon: HTMLSpanElement | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeElements();
        this.attachEventListeners();
    }

    private initializeElements(): void {
        // Find existing elements using semantic data attributes
        this.button = this.querySelector('[data-faq-button]') as HTMLButtonElement;
        this.answer = this.querySelector('[data-faq-answer]') as HTMLDivElement;
        this.icon = this.querySelector('[data-faq-icon]') as HTMLSpanElement;

        if (!this.button || !this.answer || !this.icon) {
            console.warn('FAQ Item: Required elements not found');
            return;
        }
    }
    private attachEventListeners(): void {
        if (!this.button) return;

        this.button.addEventListener('click', () => {
            this.toggleFaq();
        });
    }

    private toggleFaq(): void {
        const accordion = this.closest('faq-accordion') as FaqAccordion;
        const isOpen = this.hasAttribute('open');

        // Close all other FAQ items in the same accordion
        if (accordion) {
            accordion.closeAllItems(this);
        }

        // Toggle current item
        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    public open(): void {
        if (!this.answer || !this.icon) return;

        this.setAttribute('open', '');
        this.answer.style.maxHeight = this.answer.scrollHeight + 'px';
        this.answer.classList.add('open');
        
        this.icon.classList.remove('rotate-0');
        this.icon.classList.add('rotate-45');
    }

    public close(): void {
        if (!this.answer || !this.icon) return;

        this.removeAttribute('open');
        this.answer.style.maxHeight = '0';
        this.answer.classList.remove('open');
        
        this.icon.classList.remove('rotate-45');
        this.icon.classList.add('rotate-0');
    }
}

class FaqAccordion extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // No need to modify the HTML structure
        // Just ensure proper initialization
    }

    public closeAllItems(except?: FaqItem): void {
        const items = this.querySelectorAll('faq-item') as NodeListOf<FaqItem>;
        items.forEach(item => {
            if (item !== except) {
                item.close();
            }
        });
    }
}

// Wait for DOM to be ready before registering components
document.addEventListener('DOMContentLoaded', () => {
    // Register the custom elements only if not already registered
    if (!customElements.get('faq-item')) {
        customElements.define('faq-item', FaqItem);
    }

    if (!customElements.get('faq-accordion')) {
        customElements.define('faq-accordion', FaqAccordion);
    }
});

// Also handle Astro's page transitions
document.addEventListener('astro:page-load', () => {
    // Re-initialize if needed for Astro view transitions
    const faqItems = document.querySelectorAll('faq-item:not(:defined)');
    faqItems.forEach(item => {
        // Force re-initialization if the element wasn't properly initialized
        if (item instanceof FaqItem) {
            item.connectedCallback();
        }
    });
});

// Export for potential external use
export { FaqItem, FaqAccordion };
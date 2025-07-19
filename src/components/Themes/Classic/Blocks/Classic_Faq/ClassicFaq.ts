// ClassicFaq.ts - Enhanced version
class FaqItem extends HTMLElement {
    private button: HTMLButtonElement | null = null;
    private answer: HTMLDivElement | null = null;
    private icon: HTMLSpanElement | null = null;
    private isInitialized: boolean = false;

    constructor() {
        super();
    }

    connectedCallback() {
        // Prevent double initialization
        if (this.isInitialized) return;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupAccessibility();
        this.isInitialized = true;
    }

    disconnectedCallback() {
        // Cleanup when element is removed
        this.removeEventListeners();
        this.isInitialized = false;
    }

    private initializeElements(): void {
        this.button = this.querySelector('[data-faq-button]') as HTMLButtonElement;
        this.answer = this.querySelector('[data-faq-answer]') as HTMLDivElement;
        this.icon = this.querySelector('[data-faq-icon]') as HTMLSpanElement;

        if (!this.button || !this.answer || !this.icon) {
            console.warn('FAQ Item: Required elements not found', this);
            return;
        }
    }

    private setupAccessibility(): void {
        if (!this.button || !this.answer) return;

        // Generate unique IDs for ARIA relationships
        const answerId = `faq-answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        this.answer.id = answerId;
        this.button.setAttribute('aria-controls', answerId);
        this.button.setAttribute('aria-expanded', 'false');
    }

    private attachEventListeners(): void {
        if (!this.button) return;
        
        this.button.addEventListener('click', this.handleClick);
        this.button.addEventListener('keydown', this.handleKeydown);
    }

    private removeEventListeners(): void {
        if (!this.button) return;
        
        this.button.removeEventListener('click', this.handleClick);
        this.button.removeEventListener('keydown', this.handleKeydown);
    }

    private handleClick = (): void => {
        this.toggleFaq();
    }

    private handleKeydown = (event: KeyboardEvent): void => {
        // Handle Enter and Space keys
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleFaq();
        }
    }

    private toggleFaq(): void {
        const accordion = this.closest('faq-accordion') as FaqAccordion;
        const isOpen = this.hasAttribute('open');

        if (accordion) {
            accordion.closeAllItems(this);
        }

        if (isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open(): void {
        if (!this.answer || !this.icon || !this.button) return;

        this.setAttribute('open', '');
        this.button.setAttribute('aria-expanded', 'true');
        
        // Calculate and set max-height for smooth animation
        this.answer.style.maxHeight = this.answer.scrollHeight + 'px';
        this.answer.classList.add('open');

        this.icon.classList.remove('rotate-0');
        this.icon.classList.add('rotate-45');

        // Dispatch custom event for potential tracking
        this.dispatchEvent(new CustomEvent('faq:opened', {
            bubbles: true,
            detail: { faqItem: this }
        }));
    }

    public close(): void {
        if (!this.answer || !this.icon || !this.button) return;

        this.removeAttribute('open');
        this.button.setAttribute('aria-expanded', 'false');
        
        this.answer.style.maxHeight = '0';
        this.answer.classList.remove('open');

        this.icon.classList.remove('rotate-45');
        this.icon.classList.add('rotate-0');

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('faq:closed', {
            bubbles: true,
            detail: { faqItem: this }
        }));
    }
}

class FaqAccordion extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Add keyboard navigation
        this.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this.handleKeyboardNavigation);
    }

    private handleKeyboardNavigation = (event: KeyboardEvent): void => {
        const buttons = Array.from(this.querySelectorAll('[data-faq-button]')) as HTMLButtonElement[];
        const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);

        if (currentIndex === -1) return;

        let nextIndex: number;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = (currentIndex + 1) % buttons.length;
                buttons[nextIndex].focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
                buttons[nextIndex].focus();
                break;
            case 'Home':
                event.preventDefault();
                buttons[0].focus();
                break;
            case 'End':
                event.preventDefault();
                buttons[buttons.length - 1].focus();
                break;
        }
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

// Enhanced registration with error handling
const registerComponents = (): void => {
    try {
        if (!customElements.get('faq-item')) {
            customElements.define('faq-item', FaqItem);
        }

        if (!customElements.get('faq-accordion')) {
            customElements.define('faq-accordion', FaqAccordion);
        }
    } catch (error) {
        console.error('Failed to register FAQ components:', error);
    }
};

// Multiple registration strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerComponents);
} else {
    registerComponents();
}

// Astro-specific handling
document.addEventListener('astro:page-load', registerComponents);

export { FaqItem, FaqAccordion };
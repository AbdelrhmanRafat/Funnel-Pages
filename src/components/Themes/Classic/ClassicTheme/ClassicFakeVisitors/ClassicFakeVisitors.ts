// Classic Visitors Animation Web Component
class ClassicVisitorsAnimation extends HTMLElement {
    private classicObserver: IntersectionObserver | null = null;
    private classicVisitorCards: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.classicInitializeAnimation();
        this.classicSetupObserver();
    }

    disconnectedCallback() {
        if (this.classicObserver) {
            this.classicObserver.disconnect();
        }
    }

    private classicInitializeAnimation(): void {
        this.classicVisitorCards = this.querySelectorAll('.classic-visitor-animate');
    }

    private classicSetupObserver(): void {
        if (!this.classicVisitorCards || this.classicVisitorCards.length === 0) return;

        this.classicObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Animate when entering
                    this.classicAnimateVisitors();
                } else {
                    // Reset when leaving
                    this.classicResetAnimation();
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of element is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
        });

        this.classicObserver.observe(this);
    }

    private classicAnimateVisitors(): void {
        if (!this.classicVisitorCards) return;

        this.classicVisitorCards.forEach((card, index) => {
            const delay = parseInt(card.getAttribute('data-classic-delay') || '0');
            
            setTimeout(() => {
                card.classList.add('classic-animate-in');
            }, delay);
        });
    }

    private classicResetAnimation(): void {
        if (!this.classicVisitorCards) return;

        this.classicVisitorCards.forEach(card => {
            card.classList.remove('classic-animate-in');
        });
    }

    // Public methods for external control
    public classicTriggerAnimation(): void {
        this.classicAnimateVisitors();
    }

    public classicReset(): void {
        this.classicResetAnimation();
    }

    public classicIsVisible(): boolean {
        if (!this.classicVisitorCards) return false;
        return this.classicVisitorCards[0]?.classList.contains('classic-animate-in') || false;
    }
}

// Register the custom element
if (!customElements.get('classic-visitors-animation')) {
    customElements.define('classic-visitors-animation', ClassicVisitorsAnimation);
}

// Legacy DOM ready support
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any existing visitors sections that weren't wrapped in web component
    const legacyVisitorSections = document.querySelectorAll('#ClassicVisitors:not(classic-visitors-animation #ClassicVisitors)');
    
    legacyVisitorSections.forEach(section => {
        const visitorCards = section.querySelectorAll('.classic-visitor-animate');
        
        if (visitorCards.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Animate when entering
                        visitorCards.forEach((card, index) => {
                            const delay = index * 100;
                            setTimeout(() => {
                                card.classList.add('classic-animate-in');
                            }, delay);
                        });
                    } else {
                        // Reset when leaving
                        visitorCards.forEach(card => {
                            card.classList.remove('classic-animate-in');
                        });
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            observer.observe(section);
        }
    });
});
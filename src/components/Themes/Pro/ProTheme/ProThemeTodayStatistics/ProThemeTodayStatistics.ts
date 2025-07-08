// Classic Statistics Counter Web Component
class ProStatisticsCounter extends HTMLElement {
    private static readonly PRO_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly PRO_ANIMATION_STEPS = 60; // Smooth animation steps
    private proObserver: IntersectionObserver | null = null;
    private proCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.proInitializeCounters();
        this.proSetupObserver();
    }

    disconnectedCallback() {
        if (this.proObserver) {
            this.proObserver.disconnect();
        }
    }

    private proInitializeCounters(): void {
        this.proCounters = this.querySelectorAll('.pro-order-counter');
    }

    private proSetupObserver(): void {
        if (!this.proCounters || this.proCounters.length === 0) return;

        this.proObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.proAnimateAllCounters();
                } else {
                    this.proResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.proObserver.observe(this);
    }

    private proAnimateAllCounters(): void {
        if (!this.proCounters) return;

        this.proCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.proAnimateCounter(counter, targetCount);
        });
    }

    private proResetAllCounters(): void {
        if (!this.proCounters) return;

        this.proCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.proAnimating = 'false';
        });
    }

    private proAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.proAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.proAnimating = 'true';
        const increment = target / ProStatisticsCounter.PRO_ANIMATION_STEPS;
        const stepDuration = ProStatisticsCounter.PRO_ANIMATION_DURATION / ProStatisticsCounter.PRO_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.proAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('pro-statistics-counter')) {
    customElements.define('pro-statistics-counter', ProStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.pro-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('pro-statistics-counter')) {
        proInitializeLegacyCounters(legacyCounters);
    }
});

function proInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        proAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.proAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.pro-section');
    if (section) {
        observer.observe(section);
    }
}

function proAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.proAnimating === 'true') {
        return;
    }

    element.dataset.proAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.proAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
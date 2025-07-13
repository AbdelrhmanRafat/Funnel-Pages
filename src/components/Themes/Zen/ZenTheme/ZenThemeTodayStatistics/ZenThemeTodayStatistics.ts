// Classic Statistics Counter Web Component
class ZenStatisticsCounter extends HTMLElement {
    private static readonly ZEN_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly ZEN_ANIMATION_STEPS = 60; // Smooth animation steps
    private zenObserver: IntersectionObserver | null = null;
    private zenCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.zenInitializeCounters();
        this.zenSetupObserver();
    }

    disconnectedCallback() {
        if (this.zenObserver) {
            this.zenObserver.disconnect();
        }
    }

    private zenInitializeCounters(): void {
        this.zenCounters = this.querySelectorAll('.zen-order-counter');
    }

    private zenSetupObserver(): void {
        if (!this.zenCounters || this.zenCounters.length === 0) return;

        this.zenObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.zenAnimateAllCounters();
                } else {
                    this.zenResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.zenObserver.observe(this);
    }

    private zenAnimateAllCounters(): void {
        if (!this.zenCounters) return;

        this.zenCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.zenAnimateCounter(counter, targetCount);
        });
    }

    private zenResetAllCounters(): void {
        if (!this.zenCounters) return;

        this.zenCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.zenAnimating = 'false';
        });
    }

    private zenAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.zenAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.zenAnimating = 'true';
        const increment = target / ZenStatisticsCounter.ZEN_ANIMATION_STEPS;
        const stepDuration = ZenStatisticsCounter.ZEN_ANIMATION_DURATION / ZenStatisticsCounter.ZEN_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.zenAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('zen-statistics-counter')) {
    customElements.define('zen-statistics-counter', ZenStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.zen-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('zen-statistics-counter')) {
        zenInitializeLegacyCounters(legacyCounters);
    }
});

function zenInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        zenAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.zenAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.zen-section');
    if (section) {
        observer.observe(section);
    }
}

function zenAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.zenAnimating === 'true') {
        return;
    }

    element.dataset.zenAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.zenAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
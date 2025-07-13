// Classic Statistics Counter Web Component
class MinimalStatisticsCounter extends HTMLElement {
    private static readonly MINIMAL_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly MINIMAL_ANIMATION_STEPS = 60; // Smooth animation steps
    private minimalObserver: IntersectionObserver | null = null;
    private minimalCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.minimalInitializeCounters();
        this.minimalSetupObserver();
    }

    disconnectedCallback() {
        if (this.minimalObserver) {
            this.minimalObserver.disconnect();
        }
    }

    private minimalInitializeCounters(): void {
        this.minimalCounters = this.querySelectorAll('.minimal-order-counter');
    }

    private minimalSetupObserver(): void {
        if (!this.minimalCounters || this.minimalCounters.length === 0) return;

        this.minimalObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.minimalAnimateAllCounters();
                } else {
                    this.minimalResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.minimalObserver.observe(this);
    }

    private minimalAnimateAllCounters(): void {
        if (!this.minimalCounters) return;

        this.minimalCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.minimalAnimateCounter(counter, targetCount);
        });
    }

    private minimalResetAllCounters(): void {
        if (!this.minimalCounters) return;

        this.minimalCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.minimalAnimating = 'false';
        });
    }

    private minimalAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.minimalAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.minimalAnimating = 'true';
        const increment = target / MinimalStatisticsCounter.MINIMAL_ANIMATION_STEPS;
        const stepDuration = MinimalStatisticsCounter.MINIMAL_ANIMATION_DURATION / MinimalStatisticsCounter.MINIMAL_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.minimalAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('minimal-statistics-counter')) {
    customElements.define('minimal-statistics-counter', MinimalStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.minimal-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('minimal-statistics-counter')) {
        minimalInitializeLegacyCounters(legacyCounters);
    }
});

function minimalInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        minimalAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.minimalAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.minimal-section');
    if (section) {
        observer.observe(section);
    }
}

function minimalAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.minimalAnimating === 'true') {
        return;
    }

    element.dataset.minimalAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.minimalAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
// Classic Statistics Counter Web Component
class FreshStatisticsCounter extends HTMLElement {
    private static readonly FRESH_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly FRESH_ANIMATION_STEPS = 60; // Smooth animation steps
    private freshObserver: IntersectionObserver | null = null;
    private freshCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.freshInitializeCounters();
        this.freshSetupObserver();
    }

    disconnectedCallback() {
        if (this.freshObserver) {
            this.freshObserver.disconnect();
        }
    }

    private freshInitializeCounters(): void {
        this.freshCounters = this.querySelectorAll('.fresh-order-counter');
    }

    private freshSetupObserver(): void {
        if (!this.freshCounters || this.freshCounters.length === 0) return;

        this.freshObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.freshAnimateAllCounters();
                } else {
                    this.freshResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.freshObserver.observe(this);
    }

    private freshAnimateAllCounters(): void {
        if (!this.freshCounters) return;

        this.freshCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.freshAnimateCounter(counter, targetCount);
        });
    }

    private freshResetAllCounters(): void {
        if (!this.freshCounters) return;

        this.freshCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.freshAnimating = 'false';
        });
    }

    private freshAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.freshAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.freshAnimating = 'true';
        const increment = target / FreshStatisticsCounter.FRESH_ANIMATION_STEPS;
        const stepDuration = FreshStatisticsCounter.FRESH_ANIMATION_DURATION / FreshStatisticsCounter.FRESH_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.freshAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('fresh-statistics-counter')) {
    customElements.define('fresh-statistics-counter', FreshStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.fresh-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('fresh-statistics-counter')) {
        freshInitializeLegacyCounters(legacyCounters);
    }
});

function freshInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        freshAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.freshAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.fresh-section');
    if (section) {
        observer.observe(section);
    }
}

function freshAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.freshAnimating === 'true') {
        return;
    }

    element.dataset.freshAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.freshAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
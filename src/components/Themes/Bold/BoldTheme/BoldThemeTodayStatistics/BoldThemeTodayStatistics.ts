// Classic Statistics Counter Web Component
class BoldStatisticsCounter extends HTMLElement {
    private static readonly BOLD_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly BOLD_ANIMATION_STEPS = 60; // Smooth animation steps
    private boldObserver: IntersectionObserver | null = null;
    private boldCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.boldInitializeCounters();
        this.boldSetupObserver();
    }

    disconnectedCallback() {
        if (this.boldObserver) {
            this.boldObserver.disconnect();
        }
    }

    private boldInitializeCounters(): void {
        this.boldCounters = this.querySelectorAll('.bold-order-counter');
    }

    private boldSetupObserver(): void {
        if (!this.boldCounters || this.boldCounters.length === 0) return;

        this.boldObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.boldAnimateAllCounters();
                } else {
                    this.boldResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.boldObserver.observe(this);
    }

    private boldAnimateAllCounters(): void {
        if (!this.boldCounters) return;

        this.boldCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.boldAnimateCounter(counter, targetCount);
        });
    }

    private boldResetAllCounters(): void {
        if (!this.boldCounters) return;

        this.boldCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.boldAnimating = 'false';
        });
    }

    private boldAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.boldAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.boldAnimating = 'true';
        const increment = target / BoldStatisticsCounter.BOLD_ANIMATION_STEPS;
        const stepDuration = BoldStatisticsCounter.BOLD_ANIMATION_DURATION / BoldStatisticsCounter.BOLD_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.boldAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('bold-statistics-counter')) {
    customElements.define('bold-statistics-counter', BoldStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.bold-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('bold-statistics-counter')) {
        boldInitializeLegacyCounters(legacyCounters);
    }
});

function boldInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        boldAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.boldAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.bold-section');
    if (section) {
        observer.observe(section);
    }
}

function boldAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.boldAnimating === 'true') {
        return;
    }

    element.dataset.boldAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.boldAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
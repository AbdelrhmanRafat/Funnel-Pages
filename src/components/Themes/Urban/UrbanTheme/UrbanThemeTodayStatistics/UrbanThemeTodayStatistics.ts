// Classic Statistics Counter Web Component
class UrbanStatisticsCounter extends HTMLElement {
    private static readonly URBAN_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly URBAN_ANIMATION_STEPS = 60; // Smooth animation steps
    private urbanObserver: IntersectionObserver | null = null;
    private urbanCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.urbanInitializeCounters();
        this.urbanSetupObserver();
    }

    disconnectedCallback() {
        if (this.urbanObserver) {
            this.urbanObserver.disconnect();
        }
    }

    private urbanInitializeCounters(): void {
        this.urbanCounters = this.querySelectorAll('.urban-order-counter');
    }

    private urbanSetupObserver(): void {
        if (!this.urbanCounters || this.urbanCounters.length === 0) return;

        this.urbanObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.urbanAnimateAllCounters();
                } else {
                    this.urbanResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.urbanObserver.observe(this);
    }

    private urbanAnimateAllCounters(): void {
        if (!this.urbanCounters) return;

        this.urbanCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.urbanAnimateCounter(counter, targetCount);
        });
    }

    private urbanResetAllCounters(): void {
        if (!this.urbanCounters) return;

        this.urbanCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.urbanAnimating = 'false';
        });
    }

    private urbanAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.urbanAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.urbanAnimating = 'true';
        const increment = target / UrbanStatisticsCounter.URBAN_ANIMATION_STEPS;
        const stepDuration = UrbanStatisticsCounter.URBAN_ANIMATION_DURATION / UrbanStatisticsCounter.URBAN_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.urbanAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('urban-statistics-counter')) {
    customElements.define('urban-statistics-counter', UrbanStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.urban-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('urban-statistics-counter')) {
        urbanInitializeLegacyCounters(legacyCounters);
    }
});

function urbanInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        urbanAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.urbanAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.urban-section');
    if (section) {
        observer.observe(section);
    }
}

function urbanAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.urbanAnimating === 'true') {
        return;
    }

    element.dataset.urbanAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.urbanAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
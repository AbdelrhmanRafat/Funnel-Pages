// Classic Statistics Counter Web Component
class NasaStatisticsCounter extends HTMLElement {
    private static readonly NASA_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly NASA_ANIMATION_STEPS = 60; // Smooth animation steps
    private nasaObserver: IntersectionObserver | null = null;
    private nasaCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.nasaInitializeCounters();
        this.nasaSetupObserver();
    }

    disconnectedCallback() {
        if (this.nasaObserver) {
            this.nasaObserver.disconnect();
        }
    }

    private nasaInitializeCounters(): void {
        this.nasaCounters = this.querySelectorAll('.nasa-order-counter');
    }

    private nasaSetupObserver(): void {
        if (!this.nasaCounters || this.nasaCounters.length === 0) return;

        this.nasaObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.nasaAnimateAllCounters();
                } else {
                    this.nasaResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.nasaObserver.observe(this);
    }

    private nasaAnimateAllCounters(): void {
        if (!this.nasaCounters) return;

        this.nasaCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.nasaAnimateCounter(counter, targetCount);
        });
    }

    private nasaResetAllCounters(): void {
        if (!this.nasaCounters) return;

        this.nasaCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.nasaAnimating = 'false';
        });
    }

    private nasaAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.nasaAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.nasaAnimating = 'true';
        const increment = target / NasaStatisticsCounter.NASA_ANIMATION_STEPS;
        const stepDuration = NasaStatisticsCounter.NASA_ANIMATION_DURATION / NasaStatisticsCounter.NASA_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.nasaAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('nasa-statistics-counter')) {
    customElements.define('nasa-statistics-counter', NasaStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.nasa-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('nasa-statistics-counter')) {
        nasaInitializeLegacyCounters(legacyCounters);
    }
});

function nasaInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        nasaAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.nasaAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.nasa-section');
    if (section) {
        observer.observe(section);
    }
}

function nasaAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.nasaAnimating === 'true') {
        return;
    }

    element.dataset.nasaAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.nasaAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
// Classic Statistics Counter Web Component
class ElegantStatisticsCounter extends HTMLElement {
    private static readonly ELEGANT_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly ELEGANT_ANIMATION_STEPS = 60; // Smooth animation steps
    private elegantObserver: IntersectionObserver | null = null;
    private elegantCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.elegantInitializeCounters();
        this.elegantSetupObserver();
    }

    disconnectedCallback() {
        if (this.elegantObserver) {
            this.elegantObserver.disconnect();
        }
    }

    private elegantInitializeCounters(): void {
        this.elegantCounters = this.querySelectorAll('.elegant-order-counter');
    }

    private elegantSetupObserver(): void {
        if (!this.elegantCounters || this.elegantCounters.length === 0) return;

        this.elegantObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.elegantAnimateAllCounters();
                } else {
                    this.elegantResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.elegantObserver.observe(this);
    }

    private elegantAnimateAllCounters(): void {
        if (!this.elegantCounters) return;

        this.elegantCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.elegantAnimateCounter(counter, targetCount);
        });
    }

    private elegantResetAllCounters(): void {
        if (!this.elegantCounters) return;

        this.elegantCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.elegantAnimating = 'false';
        });
    }

    private elegantAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.elegantAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.elegantAnimating = 'true';
        const increment = target / ElegantStatisticsCounter.ELEGANT_ANIMATION_STEPS;
        const stepDuration = ElegantStatisticsCounter.ELEGANT_ANIMATION_DURATION / ElegantStatisticsCounter.ELEGANT_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.elegantAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('elegant-statistics-counter')) {
    customElements.define('elegant-statistics-counter', ElegantStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.elegant-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('elegant-statistics-counter')) {
        elegantInitializeLegacyCounters(legacyCounters);
    }
});

function elegantInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        elegantAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.elegantAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.elegant-section');
    if (section) {
        observer.observe(section);
    }
}

function elegantAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.elegantAnimating === 'true') {
        return;
    }

    element.dataset.elegantAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.elegantAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
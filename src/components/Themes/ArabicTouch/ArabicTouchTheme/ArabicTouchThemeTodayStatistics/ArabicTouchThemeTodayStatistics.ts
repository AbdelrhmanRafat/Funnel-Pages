// Classic Statistics Counter Web Component
class ArabicTouchStatisticsCounter extends HTMLElement {
    private static readonly ARABICTOUCH_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly ARABICTOUCH_ANIMATION_STEPS = 60; // Smooth animation steps
    private arabictouchObserver: IntersectionObserver | null = null;
    private arabictouchCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.arabictouchInitializeCounters();
        this.arabictouchSetupObserver();
    }

    disconnectedCallback() {
        if (this.arabictouchObserver) {
            this.arabictouchObserver.disconnect();
        }
    }

    private arabictouchInitializeCounters(): void {
        this.arabictouchCounters = this.querySelectorAll('.arabictouch-order-counter');
    }

    private arabictouchSetupObserver(): void {
        if (!this.arabictouchCounters || this.arabictouchCounters.length === 0) return;

        this.arabictouchObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.arabictouchAnimateAllCounters();
                } else {
                    this.arabictouchResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.arabictouchObserver.observe(this);
    }

    private arabictouchAnimateAllCounters(): void {
        if (!this.arabictouchCounters) return;

        this.arabictouchCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.arabictouchAnimateCounter(counter, targetCount);
        });
    }

    private arabictouchResetAllCounters(): void {
        if (!this.arabictouchCounters) return;

        this.arabictouchCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.arabictouchAnimating = 'false';
        });
    }

    private arabictouchAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.arabictouchAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.arabictouchAnimating = 'true';
        const increment = target / ArabicTouchStatisticsCounter.ARABICTOUCH_ANIMATION_STEPS;
        const stepDuration = ArabicTouchStatisticsCounter.ARABICTOUCH_ANIMATION_DURATION / ArabicTouchStatisticsCounter.ARABICTOUCH_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.arabictouchAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('arabictouch-statistics-counter')) {
    customElements.define('arabictouch-statistics-counter', ArabicTouchStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.arabictouch-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('arabictouch-statistics-counter')) {
        arabictouchInitializeLegacyCounters(legacyCounters);
    }
});

function arabictouchInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        arabictouchAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.arabictouchAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.arabictouch-section');
    if (section) {
        observer.observe(section);
    }
}

function arabictouchAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.arabictouchAnimating === 'true') {
        return;
    }

    element.dataset.arabictouchAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.arabictouchAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
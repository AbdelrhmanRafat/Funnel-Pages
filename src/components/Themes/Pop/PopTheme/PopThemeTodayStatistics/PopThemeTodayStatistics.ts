// Classic Statistics Counter Web Component
class PopStatisticsCounter extends HTMLElement {
    private static readonly POP_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly POP_ANIMATION_STEPS = 60; // Smooth animation steps
    private popObserver: IntersectionObserver | null = null;
    private popCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.popInitializeCounters();
        this.popSetupObserver();
    }

    disconnectedCallback() {
        if (this.popObserver) {
            this.popObserver.disconnect();
        }
    }

    private popInitializeCounters(): void {
        this.popCounters = this.querySelectorAll('.pop-order-counter');
    }

    private popSetupObserver(): void {
        if (!this.popCounters || this.popCounters.length === 0) return;

        this.popObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.popAnimateAllCounters();
                } else {
                    this.popResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.popObserver.observe(this);
    }

    private popAnimateAllCounters(): void {
        if (!this.popCounters) return;

        this.popCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.popAnimateCounter(counter, targetCount);
        });
    }

    private popResetAllCounters(): void {
        if (!this.popCounters) return;

        this.popCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.popAnimating = 'false';
        });
    }

    private popAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.popAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.popAnimating = 'true';
        const increment = target / PopStatisticsCounter.POP_ANIMATION_STEPS;
        const stepDuration = PopStatisticsCounter.POP_ANIMATION_DURATION / PopStatisticsCounter.POP_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.popAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('pop-statistics-counter')) {
    customElements.define('pop-statistics-counter', PopStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.pop-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('pop-statistics-counter')) {
        popInitializeLegacyCounters(legacyCounters);
    }
});

function popInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        popAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.popAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.pop-section');
    if (section) {
        observer.observe(section);
    }
}

function popAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.popAnimating === 'true') {
        return;
    }

    element.dataset.popAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.popAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
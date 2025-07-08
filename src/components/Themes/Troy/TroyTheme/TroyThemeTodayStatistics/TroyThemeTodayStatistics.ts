// Classic Statistics Counter Web Component
class TroyStatisticsCounter extends HTMLElement {
    private static readonly TROY_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly TROY_ANIMATION_STEPS = 60; // Smooth animation steps
    private troyObserver: IntersectionObserver | null = null;
    private troyCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.troyInitializeCounters();
        this.troySetupObserver();
    }

    disconnectedCallback() {
        if (this.troyObserver) {
            this.troyObserver.disconnect();
        }
    }

    private troyInitializeCounters(): void {
        this.troyCounters = this.querySelectorAll('.troy-order-counter');
    }

    private troySetupObserver(): void {
        if (!this.troyCounters || this.troyCounters.length === 0) return;

        this.troyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.troyAnimateAllCounters();
                } else {
                    this.troyResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.troyObserver.observe(this);
    }

    private troyAnimateAllCounters(): void {
        if (!this.troyCounters) return;

        this.troyCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.troyAnimateCounter(counter, targetCount);
        });
    }

    private troyResetAllCounters(): void {
        if (!this.troyCounters) return;

        this.troyCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.troyAnimating = 'false';
        });
    }

    private troyAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.troyAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.troyAnimating = 'true';
        const increment = target / TroyStatisticsCounter.TROY_ANIMATION_STEPS;
        const stepDuration = TroyStatisticsCounter.TROY_ANIMATION_DURATION / TroyStatisticsCounter.TROY_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.troyAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('troy-statistics-counter')) {
    customElements.define('troy-statistics-counter', TroyStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.troy-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('troy-statistics-counter')) {
        troyInitializeLegacyCounters(legacyCounters);
    }
});

function troyInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        troyAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.troyAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.troy-section');
    if (section) {
        observer.observe(section);
    }
}

function troyAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.troyAnimating === 'true') {
        return;
    }

    element.dataset.troyAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.troyAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
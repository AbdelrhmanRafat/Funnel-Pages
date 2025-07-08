// Classic Statistics Counter Web Component
class NeonStatisticsCounter extends HTMLElement {
    private static readonly NEON_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly NEON_ANIMATION_STEPS = 60; // Smooth animation steps
    private neonObserver: IntersectionObserver | null = null;
    private neonCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.neonInitializeCounters();
        this.neonSetupObserver();
    }

    disconnectedCallback() {
        if (this.neonObserver) {
            this.neonObserver.disconnect();
        }
    }

    private neonInitializeCounters(): void {
        this.neonCounters = this.querySelectorAll('.neon-order-counter');
    }

    private neonSetupObserver(): void {
        if (!this.neonCounters || this.neonCounters.length === 0) return;

        this.neonObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.neonAnimateAllCounters();
                } else {
                    this.neonResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.neonObserver.observe(this);
    }

    private neonAnimateAllCounters(): void {
        if (!this.neonCounters) return;

        this.neonCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.neonAnimateCounter(counter, targetCount);
        });
    }

    private neonResetAllCounters(): void {
        if (!this.neonCounters) return;

        this.neonCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.neonAnimating = 'false';
        });
    }

    private neonAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.neonAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.neonAnimating = 'true';
        const increment = target / NeonStatisticsCounter.NEON_ANIMATION_STEPS;
        const stepDuration = NeonStatisticsCounter.NEON_ANIMATION_DURATION / NeonStatisticsCounter.NEON_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.neonAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('neon-statistics-counter')) {
    customElements.define('neon-statistics-counter', NeonStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.neon-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('neon-statistics-counter')) {
        neonInitializeLegacyCounters(legacyCounters);
    }
});

function neonInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        neonAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.neonAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.neon-section');
    if (section) {
        observer.observe(section);
    }
}

function neonAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.neonAnimating === 'true') {
        return;
    }

    element.dataset.neonAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.neonAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
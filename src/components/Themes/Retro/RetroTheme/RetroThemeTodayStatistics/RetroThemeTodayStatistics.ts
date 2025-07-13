// Classic Statistics Counter Web Component
class RetroStatisticsCounter extends HTMLElement {
    private static readonly RETRO_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly RETRO_ANIMATION_STEPS = 60; // Smooth animation steps
    private retroObserver: IntersectionObserver | null = null;
    private retroCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.retroInitializeCounters();
        this.retroSetupObserver();
    }

    disconnectedCallback() {
        if (this.retroObserver) {
            this.retroObserver.disconnect();
        }
    }

    private retroInitializeCounters(): void {
        this.retroCounters = this.querySelectorAll('.retro-order-counter');
    }

    private retroSetupObserver(): void {
        if (!this.retroCounters || this.retroCounters.length === 0) return;

        this.retroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.retroAnimateAllCounters();
                } else {
                    this.retroResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.retroObserver.observe(this);
    }

    private retroAnimateAllCounters(): void {
        if (!this.retroCounters) return;

        this.retroCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.retroAnimateCounter(counter, targetCount);
        });
    }

    private retroResetAllCounters(): void {
        if (!this.retroCounters) return;

        this.retroCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.retroAnimating = 'false';
        });
    }

    private retroAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.retroAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.retroAnimating = 'true';
        const increment = target / RetroStatisticsCounter.RETRO_ANIMATION_STEPS;
        const stepDuration = RetroStatisticsCounter.RETRO_ANIMATION_DURATION / RetroStatisticsCounter.RETRO_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.retroAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('retro-statistics-counter')) {
    customElements.define('retro-statistics-counter', RetroStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.retro-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('retro-statistics-counter')) {
        retroInitializeLegacyCounters(legacyCounters);
    }
});

function retroInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        retroAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.retroAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.retro-section');
    if (section) {
        observer.observe(section);
    }
}

function retroAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.retroAnimating === 'true') {
        return;
    }

    element.dataset.retroAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.retroAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
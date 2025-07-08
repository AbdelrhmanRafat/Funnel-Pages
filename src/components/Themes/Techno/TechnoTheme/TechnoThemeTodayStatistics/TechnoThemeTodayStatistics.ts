// Classic Statistics Counter Web Component
class TechnoStatisticsCounter extends HTMLElement {
    private static readonly TECHNO_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly TECHNO_ANIMATION_STEPS = 60; // Smooth animation steps
    private technoObserver: IntersectionObserver | null = null;
    private technoCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.technoInitializeCounters();
        this.technoSetupObserver();
    }

    disconnectedCallback() {
        if (this.technoObserver) {
            this.technoObserver.disconnect();
        }
    }

    private technoInitializeCounters(): void {
        this.technoCounters = this.querySelectorAll('.techno-order-counter');
    }

    private technoSetupObserver(): void {
        if (!this.technoCounters || this.technoCounters.length === 0) return;

        this.technoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.technoAnimateAllCounters();
                } else {
                    this.technoResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.technoObserver.observe(this);
    }

    private technoAnimateAllCounters(): void {
        if (!this.technoCounters) return;

        this.technoCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.technoAnimateCounter(counter, targetCount);
        });
    }

    private technoResetAllCounters(): void {
        if (!this.technoCounters) return;

        this.technoCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.technoAnimating = 'false';
        });
    }

    private technoAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.technoAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.technoAnimating = 'true';
        const increment = target / TechnoStatisticsCounter.TECHNO_ANIMATION_STEPS;
        const stepDuration = TechnoStatisticsCounter.TECHNO_ANIMATION_DURATION / TechnoStatisticsCounter.TECHNO_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.technoAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('techno-statistics-counter')) {
    customElements.define('techno-statistics-counter', TechnoStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.techno-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('techno-statistics-counter')) {
        technoInitializeLegacyCounters(legacyCounters);
    }
});

function technoInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        technoAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.technoAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.techno-section');
    if (section) {
        observer.observe(section);
    }
}

function technoAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.technoAnimating === 'true') {
        return;
    }

    element.dataset.technoAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.technoAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
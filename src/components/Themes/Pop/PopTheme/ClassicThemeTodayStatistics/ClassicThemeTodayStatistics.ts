// Classic Statistics Counter Web Component
class ClassicStatisticsCounter extends HTMLElement {
    private static readonly CLASSIC_ANIMATION_DURATION = 2000; // 2 seconds
    private static readonly CLASSIC_ANIMATION_STEPS = 60; // Smooth animation steps
    private classicObserver: IntersectionObserver | null = null;
    private classicCounters: NodeListOf<HTMLElement> | null = null;

    connectedCallback() {
        this.classicInitializeCounters();
        this.classicSetupObserver();
    }

    disconnectedCallback() {
        if (this.classicObserver) {
            this.classicObserver.disconnect();
        }
    }

    private classicInitializeCounters(): void {
        this.classicCounters = this.querySelectorAll('.classic-order-counter');
    }

    private classicSetupObserver(): void {
        if (!this.classicCounters || this.classicCounters.length === 0) return;

        this.classicObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.classicAnimateAllCounters();
                } else {
                    this.classicResetAllCounters();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of element is visible
        });

        this.classicObserver.observe(this);
    }

    private classicAnimateAllCounters(): void {
        if (!this.classicCounters) return;

        this.classicCounters.forEach((counter) => {
            const targetCount = parseInt(counter.getAttribute('data-target') || '0');
            
            // Don't animate if target is 0
            if (targetCount === 0) return;
            
            this.classicAnimateCounter(counter, targetCount);
        });
    }

    private classicResetAllCounters(): void {
        if (!this.classicCounters) return;

        this.classicCounters.forEach((counter) => {
            counter.textContent = '0';
            counter.dataset.classicAnimating = 'false';
        });
    }

    private classicAnimateCounter(element: HTMLElement, target: number): void {
        // Clear any existing animation
        if (element.dataset.classicAnimating === 'true') {
            return; // Prevent multiple animations running simultaneously
        }

        element.dataset.classicAnimating = 'true';
        const increment = target / ClassicStatisticsCounter.CLASSIC_ANIMATION_STEPS;
        const stepDuration = ClassicStatisticsCounter.CLASSIC_ANIMATION_DURATION / ClassicStatisticsCounter.CLASSIC_ANIMATION_STEPS;
        let currentCount = 0;

        const timer = setInterval(() => {
            currentCount += increment;

            if (currentCount >= target) {
                element.textContent = target.toString();
                element.dataset.classicAnimating = 'false';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentCount).toString();
            }
        }, stepDuration);
    }
}

// Register the custom element
if (!customElements.get('classic-statistics-counter')) {
    customElements.define('classic-statistics-counter', ClassicStatisticsCounter);
}

// Legacy support - also initialize if DOM is already loaded
document.addEventListener('DOMContentLoaded', () => {
    // This ensures compatibility if the web component isn't used
    const legacyCounters = document.querySelectorAll('.classic-order-counter');
    if (legacyCounters.length > 0 && !document.querySelector('classic-statistics-counter')) {
        classicInitializeLegacyCounters(legacyCounters);
    }
});

function classicInitializeLegacyCounters(counters: NodeListOf<Element>): void {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach((counter) => {
                    const targetCount = parseInt(counter.getAttribute('data-target') || '0');
                    if (targetCount > 0) {
                        classicAnimateLegacyCounter(counter as HTMLElement, targetCount);
                    }
                });
            } else {
                counters.forEach((counter) => {
                    counter.textContent = '0';
                    (counter as HTMLElement).dataset.classicAnimating = 'false';
                });
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the first counter's parent section
    const section = counters[0].closest('.classic-section');
    if (section) {
        observer.observe(section);
    }
}

function classicAnimateLegacyCounter(element: HTMLElement, target: number): void {
    if (element.dataset.classicAnimating === 'true') {
        return;
    }

    element.dataset.classicAnimating = 'true';
    const increment = target / 60;
    const stepDuration = 2000 / 60;
    let currentCount = 0;

    const timer = setInterval(() => {
        currentCount += increment;

        if (currentCount >= target) {
            element.textContent = target.toString();
            element.dataset.classicAnimating = 'false';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentCount).toString();
        }
    }, stepDuration);
}
// MinimalThemeCountDown.ts - Simple Web Component for Countdown Timer

interface CountdownElements {
  hours: HTMLElement | null;
  minutes: HTMLElement | null;
  seconds: HTMLElement | null;
}

class CountdownTimer extends HTMLElement {
  private timeLeft: number = 0;
  private timer: number | null = null;
  private elements: CountdownElements = {
    hours: null,
    minutes: null,
    seconds: null
  };

  constructor() {
    super();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  private initializeSettings(): void {
    this.timeLeft = parseInt(this.getAttribute('data-total-seconds') || '0');
  }

  private initializeElements(): void {
    this.elements = {
      hours: this.querySelector('[data-countdown-hours]') as HTMLElement,
      minutes: this.querySelector('[data-countdown-minutes]') as HTMLElement,
      seconds: this.querySelector('[data-countdown-seconds]') as HTMLElement
    };

    if (!this.elements.hours || !this.elements.minutes || !this.elements.seconds) {
      console.warn('Countdown Timer: Required elements not found');
      return;
    }
  }

  private updateDisplay(): void {
    const { hours, minutes, seconds } = this.elements;
    if (!hours || !minutes || !seconds) return;

    const hoursValue = Math.floor(this.timeLeft / 3600);
    const minutesValue = Math.floor((this.timeLeft % 3600) / 60);
    const secondsValue = this.timeLeft % 60;

    hours.textContent = String(hoursValue).padStart(2, '0');
    minutes.textContent = String(minutesValue).padStart(2, '0');
    seconds.textContent = String(secondsValue).padStart(2, '0');
  }

  public start(): void {
    if (this.timer) return;

    this.updateDisplay();
    this.timer = window.setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplay();
      } else {
        this.stop();
      }
    }, 1000);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('countdown-timer')) {
    customElements.define('countdown-timer', CountdownTimer);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const countdownTimers = document.querySelectorAll('countdown-timer:not(:defined)');
  countdownTimers.forEach(timer => {
    if (timer instanceof CountdownTimer) {
      timer.connectedCallback();
    }
  });
});

export { CountdownTimer };
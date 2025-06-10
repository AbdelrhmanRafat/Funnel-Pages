/**
 * ClassicThemeCountDown.ts
 * 
 * This file handles the countdown timer functionality for the Classic Theme.
 * It updates the hours, minutes, and seconds display based on the provided time.
 */

interface CountdownElements {
  hours: HTMLElement | null;
  minutes: HTMLElement | null;
  seconds: HTMLElement | null;
}

class CountdownTimer {
  private timeLeft: number;
  private timer: NodeJS.Timeout | null = null;
  private elements: CountdownElements;

  constructor(totalSeconds: number) {
    this.timeLeft = totalSeconds;
    this.elements = {
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds')
    };
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
    this.timer = setInterval(() => {
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

export function initCountdown(): void {
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) return;

  const totalSeconds = parseInt(countdownContainer.dataset.time ?? '0') || 0;
  const timer = new CountdownTimer(totalSeconds);
  timer.start();
}
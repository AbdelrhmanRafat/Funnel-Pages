/**
 * ClassicThemeCountDown.ts
 * 
 * This file handles the countdown timer functionality for the Classic Theme.
 * It updates the hours, minutes, and seconds display based on the provided time.
 */

export function initCountdown() {
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) return;
  
  const total = parseInt(countdownContainer.dataset.time) || 0;

  let timeLeft = total;

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timer);
    }
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
}

// Initialize the countdown when the DOM is loaded
document.addEventListener('DOMContentLoaded', initCountdown);
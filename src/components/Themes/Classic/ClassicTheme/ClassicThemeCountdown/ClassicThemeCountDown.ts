/**
 * ClassicThemeCountDown.ts
 * 
 * This file handles the countdown timer functionality for the Classic Theme.
 * It updates the hours, minutes, and seconds display based on the provided time.
 */

export function initCountdown() {
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) return;
  
  // Fix type error by adding type assertion for dataset.time
  const total = parseInt(countdownContainer.dataset.time ?? '0') || 0;

  let timeLeft = total;

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Fix null checks by using non-null assertion or conditional checks
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timer);
    }
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
}
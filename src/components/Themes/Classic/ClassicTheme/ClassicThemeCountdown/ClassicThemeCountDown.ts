/**
 * ClassicThemeCountDown.ts
 * 
 * This file handles the countdown timer functionality for the Classic Theme.
 * It updates the hours, minutes, and seconds display based on the provided time.
 */

// Initializes the countdown timer.
export function initCountdown() {
  // Get the countdown container element.
  const countdownContainer = document.getElementById('countdown');
  if (!countdownContainer) return; // Exit if the container is not found.
  
  // Get the total time from the 'data-time' attribute of the container.
  // Fix type error by adding type assertion for dataset.time
  const total = parseInt(countdownContainer.dataset.time ?? '0') || 0;

  let timeLeft = total; // Initialize the time left with the total time.

  // Get the elements for displaying hours, minutes, and seconds.
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Exit if any of the display elements are not found.
  if (!hoursEl || !minutesEl || !secondsEl) return;

  // Updates the countdown display.
  function updateCountdown() {
    // Calculate hours, minutes, and seconds from timeLeft.
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Update the text content of the display elements.
    // Fix null checks by using non-null assertion or conditional checks
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    // Decrement timeLeft or clear the interval if time is up.
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timer); // Stop the timer when timeLeft reaches 0.
    }
  }

  // Set an interval to call updateCountdown every second.
  const timer = setInterval(updateCountdown, 1000);
  // Call updateCountdown immediately to initialize the display.
  updateCountdown();
}
/**
 * ClassicThemeTodayOrders.ts
 * 
 * This file handles the today's orders counter animation for the Classic Theme.
 * It animates the count from 0 to the target number.
 */

export function initTodayOrdersCounter() {
  const counterElement = document.getElementById("todayOrders");
  if (!counterElement) return;
  
  const targetCount = parseInt(counterElement.getAttribute("today-orders")) || 0;

  let current = 0;
  const duration = 1000; // Total duration in milliseconds
  const stepTime = Math.max(Math.floor(duration / targetCount), 20); // Time per step

  const counter = setInterval(() => {
    current++;
    counterElement.textContent = current.toString();
    if (current >= targetCount) {
      clearInterval(counter);
    }
  }, stepTime);
}

// Initialize the counter when the DOM is loaded
document.addEventListener("DOMContentLoaded", initTodayOrdersCounter);
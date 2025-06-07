/**
 * ClassicThemeTodayOrders.ts
 * 
 * This file handles the today's orders counter animation for the Classic Theme.
 * It animates the count from 0 to the target number.
 */

// NOTE: This TypeScript file duplicates the counter logic found in the <script> tag
// of ClassicThemeTodayOrders.astro. In a typical Astro setup, you would use either
// the inline script or a linked .ts file (like this one) for client-side JavaScript, but not both.
// If this .ts file is intended to be the primary source for this logic, the script
// in the .astro file should be removed and this function potentially imported and called from there if needed,
// or this file might be intended for more complex future enhancements.

// Initializes the animated counter for "Today's Orders".
export function initTodayOrdersCounter() {
  // Get the HTML element that displays the order count.
  const counterElement = document.getElementById("todayOrders");
  // If the element doesn't exist, exit the function to prevent errors.
  if (!counterElement) return;
  
  // Read the target number of orders from the 'today-orders' attribute of the element.
  // Defaults to 0 if the attribute is missing or not a valid number.
  const targetCount = parseInt(counterElement.getAttribute("today-orders") || '0', 10) || 0;

  let currentCount = 0; // Start counting from 0.
  const animationDuration = 1000; // Total duration for the animation in milliseconds.

  // Calculate the interval time for each step of the animation.
  // This aims for a smooth animation over the specified duration.
  // If targetCount is 0 or very small, stepTime defaults to animationDuration to avoid division by zero or too fast steps.
  // A minimum step time (e.g., 20ms) can also be enforced if desired.
  const stepTime = targetCount > 0 ? Math.max(Math.floor(animationDuration / targetCount), 20) : animationDuration;

  // If target count is 0, set text and exit.
  if (targetCount === 0) {
    counterElement.textContent = "0";
    return;
  }

  // Create an interval to repeatedly update the counter.
  const counterInterval = setInterval(() => {
    currentCount++; // Increment the displayed count.
    counterElement.textContent = currentCount.toString(); // Update the element's text.

    // If the current count has reached the target count, stop the animation.
    if (currentCount >= targetCount) {
      clearInterval(counterInterval);
      counterElement.textContent = targetCount.toString(); // Ensure final count is exact.
    }
  }, stepTime); // Set the interval timing.
}

// This event listener calls initTodayOrdersCounter once the HTML document is fully loaded.
// This is crucial because the script needs to access DOM elements (like 'todayOrders').
// If the <script> in the .astro file is also active, this will result in the counter logic running twice.
document.addEventListener("DOMContentLoaded", initTodayOrdersCounter);
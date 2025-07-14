import { FunnelNeonComponents } from "../../../../../lib/constants/themes";

// Intersection Observer to trigger jelly effect when section enters viewport
const observeJellyButton = () => {
  const section = document.getElementById(FunnelNeonComponents.NeonButtonWithLink);
  
  if (!section) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class for repetitive jelly effect
        section.classList.add('neon-button-jelly-animate');
      } else {
        // Remove animation class when section leaves viewport
        section.classList.remove('neon-button-jelly-animate');
      }
    });
  }, {
    threshold: 0.3 // Trigger when 30% of section is visible
  });
  
  observer.observe(section);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', observeJellyButton);
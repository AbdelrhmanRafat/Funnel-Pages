/**
 * ClassicThemeHeader.ts
 * 
 * This file handles any client-side functionality for the Classic Theme header,
 * including image error handling for the logo and scroll behavior.
 */

export function initHeader() {
  // Get the header logo element
  const headerLogo = document.getElementById('headerLogo') as HTMLImageElement;
  const header = document.querySelector('header') as HTMLElement;
  
  if (headerLogo) {
    // Store the original src for potential reuse
    const originalSrc = headerLogo.src;
    const defaultLogo = 'assets/default-logo.svg';
    
    // Add error handler to the image
    headerLogo.onerror = function() {
      console.log('Logo image failed to load, using default logo');
      // Prevent infinite error loop
      this.onerror = null;
      // Set to default logo with cache-busting parameter
      this.src = defaultLogo + '?fallback=' + Date.now();
    };
    
    // Check if the image is already loaded and broken
    if (headerLogo.complete && headerLogo.naturalWidth === 0) {
      headerLogo.src = defaultLogo + '?fallback=' + Date.now();
    }
    
    console.log('Header component initialized with image error handling');
  }
  
  // Initialize scroll behavior
  initScrollBehavior();
}

/**
 * Initializes the scroll behavior for the header
 * - Hides the header when scrolling down
 * - Shows the header when scrolling up or at the top of the page
 */
function initScrollBehavior() {
  const header = document.querySelector('header') as HTMLElement;
  if (!header) return;
  
  // Add transition class for smooth animations
  header.classList.add('transition-transform', 'duration-300');
  
  let lastScrollY = window.scrollY;
  
  // Function to handle scroll events
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // At the top of the page - always show header
    if (currentScrollY <= 0) {
      header.classList.remove('transform', '-translate-y-full');
      lastScrollY = currentScrollY;
      return;
    }
    
    // Scrolling down - hide header
    if (currentScrollY > lastScrollY) {
      header.classList.add('transform', '-translate-y-full');
    } 
    // Scrolling up - show header
    else if (currentScrollY < lastScrollY) {
      header.classList.remove('transform', '-translate-y-full');
    }
    
    lastScrollY = currentScrollY;
  };
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
}

// Initialize header functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeader);

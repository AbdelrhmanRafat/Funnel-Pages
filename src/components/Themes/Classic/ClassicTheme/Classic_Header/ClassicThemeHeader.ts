/**
 * ClassicThemeHeader.ts
 * 
 * This file handles any client-side functionality for the Classic Theme header,
 * including image error handling for the logo and scroll behavior.
 */

export function initHeader() {
  // Get the header logo element
  const headerLogo = document.getElementById('headerLogo') as HTMLImageElement;
  const header = document.querySelector('.classic-header') as HTMLElement;
  
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
  }
  
  if (header) {
    // Add transition class for smooth animations
    header.classList.add('transition-all', 'duration-300', 'ease-in-out');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Function to handle scroll events
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // At the top of the page - always show header
          if (currentScrollY <= 0) {
            header.style.transform = 'translateY(0)';
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }
          
          // Scrolling down - hide header
          if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
          } 
          // Scrolling up - show header
          else if (currentScrollY < lastScrollY) {
            header.style.transform = 'translateY(0)';
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// Initialize header functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeader);

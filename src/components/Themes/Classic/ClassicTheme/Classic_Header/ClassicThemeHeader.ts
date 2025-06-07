/**
 * ClassicThemeHeader.ts
 * 
 * This file handles any client-side functionality for the Classic Theme header,
 * including image error handling for the logo.
 */

export function initHeader() {
  // Get the header logo element
  const headerLogo = document.getElementById('headerLogo') as HTMLImageElement;
  
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
}

// Initialize header functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeader);
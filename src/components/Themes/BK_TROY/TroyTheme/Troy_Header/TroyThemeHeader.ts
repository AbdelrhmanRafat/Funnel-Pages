export function initHeader() {
  const headerLogo = document.getElementById('headerLogo') as HTMLImageElement;
  const header = document.querySelector('.troy-header') as HTMLElement;
  
  if (headerLogo) {
    const originalSrc = headerLogo.src;
    const defaultLogo = 'assets/default-logo.svg';
    
    headerLogo.onerror = function() {
      console.log('Logo image failed to load, using default logo');
      this.onerror = null;
      this.src = defaultLogo + '?fallback=' + Date.now();
    };
    
    if (headerLogo.complete && headerLogo.naturalWidth === 0) {
      headerLogo.src = defaultLogo + '?fallback=' + Date.now();
    }
  }
  
  if (header) {
    header.classList.add('transition-all', 'duration-300', 'ease-in-out');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY <= 0) {
            header.style.transform = 'translateY(0)';
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }
          
          if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
          } 
          else if (currentScrollY < lastScrollY) {
            header.style.transform = 'translateY(0)';
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', initHeader);

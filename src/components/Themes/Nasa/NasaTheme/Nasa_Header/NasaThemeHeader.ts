// nasaThemeHeader.ts - Enhanced Header with Mobile Navigation

interface HeaderElements {
  headerLogo: HTMLImageElement | null;
  header: HTMLElement | null;
  menuButton: HTMLElement | null;
  menuOverlay: HTMLElement | null;
  menuBackdrop: HTMLElement | null;
  menuClose: HTMLElement | null;
  menuLinks: NodeListOf<HTMLAnchorElement>;
}

class nasaThemeHeader {
  private elements: HeaderElements;
  private isMenuOpen: boolean = false;
  private lastScrollY: number = 0;
  private scrollTicking: boolean = false;

  constructor() {
    this.elements = this.initializeElements();
    this.init();
  }

  private initializeElements(): HeaderElements {
    return {
      headerLogo: document.getElementById('headerLogo') as HTMLImageElement | null,
      header: document.querySelector('.nasa-header') as HTMLElement | null,
      menuButton: document.getElementById('header-menu-button') as HTMLElement | null,
      menuOverlay: document.getElementById('header-menu-overlay') as HTMLElement | null,
      menuBackdrop: document.getElementById('header-menu-backdrop') as HTMLElement | null,
      menuClose: document.getElementById('header-menu-close') as HTMLElement | null,
      menuLinks: document.querySelectorAll('.nasa-menu-link')
    };
  }

  private init(): void {
    this.initializeLogo();
    this.initializeScrollBehavior();
    this.initializeMobileMenu();
    this.initializeKeyboardHandling();
    this.initializeResizeHandling();
    
  }

  private initializeLogo(): void {
    const { headerLogo } = this.elements;
    
    if (!headerLogo) return;

    const defaultLogo = 'assets/default-logo.svg';

    const handleLogoError = () => {
      console.log('Logo image failed to load, using default logo');
      headerLogo.onerror = null;
      headerLogo.src = `${defaultLogo}?fallback=${Date.now()}`;
    };

    headerLogo.onerror = handleLogoError;

    // Check if logo failed to load initially
    if (headerLogo.complete && headerLogo.naturalWidth === 0) {
      headerLogo.src = `${defaultLogo}?fallback=${Date.now()}`;
    }
  }

  private initializeScrollBehavior(): void {
    const { header } = this.elements;
    
    if (!header) return;

    header.classList.add('transition-all', 'duration-300', 'ease-in-out');
    this.lastScrollY = window.scrollY;

    const handleScroll = (): void => {
      if (!this.scrollTicking) {
        window.requestAnimationFrame(() => {
          this.updateHeaderPosition();
          this.scrollTicking = false;
        });
        this.scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private updateHeaderPosition(): void {
    const { header } = this.elements;
    if (!header) return;

    const currentScrollY = window.scrollY;

    // Always show header at top
    if (currentScrollY <= 0) {
      header.style.transform = 'translateY(0)';
      this.lastScrollY = currentScrollY;
      return;
    }

    // Hide header when scrolling down, show when scrolling up
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else if (currentScrollY < this.lastScrollY) {
      header.style.transform = 'translateY(0)';
    }

    this.lastScrollY = currentScrollY;
  }

  private initializeMobileMenu(): void {
    const { menuButton, menuClose, menuBackdrop, menuLinks } = this.elements;

    // Menu toggle events
    menuButton?.addEventListener('click', () => this.openMenu());
    menuClose?.addEventListener('click', () => this.closeMenu());
    menuBackdrop?.addEventListener('click', () => this.closeMenu());

    // Menu link navigation
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleMenuLinkClick(e, link));
    });
  }

  private openMenu(): void {
    const { menuButton, menuOverlay } = this.elements;
    
    if (!menuButton || !menuOverlay) return;

    
    this.isMenuOpen = true;
    menuButton.classList.add('active');
    menuOverlay.classList.add('show');
    document.body.classList.add('menu-open');

    // Dispatch custom event
    this.dispatchMenuEvent('menu-opened');
  }

  private closeMenu(): void {
    const { menuButton, menuOverlay } = this.elements;
    
    if (!menuButton || !menuOverlay) return;

    
    this.isMenuOpen = false;
    menuButton.classList.remove('active');
    menuOverlay.classList.remove('show');
    document.body.classList.remove('menu-open');

    // Dispatch custom event
    this.dispatchMenuEvent('menu-closed');
  }

  private handleMenuLinkClick(e: Event, link: HTMLAnchorElement): void {
    e.preventDefault();

    // Close menu first
    this.closeMenu();

    // Handle smooth scrolling
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        this.smoothScrollToElement(targetElement);
      }
    }
  }

  private smoothScrollToElement(targetElement: HTMLElement): void {
    const { header } = this.elements;
    
    // Calculate offset for fixed header
    const headerHeight = header?.clientHeight || 0;
    const additionalOffset = 10; // Additional spacing
    const targetPosition = targetElement.offsetTop - headerHeight - additionalOffset;

    // Wait for menu close animation before scrolling
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }, 300);
  }

  private initializeKeyboardHandling(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  private initializeResizeHandling(): void {
    let resizeTimeout: number;

    window.addEventListener('resize', () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        // Close menu on resize to handle mobile/desktop transitions
        if (this.isMenuOpen) {
          this.closeMenu();
        }
      }, 250);
    });
  }

  private dispatchMenuEvent(eventType: string): void {
    const event = new CustomEvent(eventType, {
      detail: { isOpen: this.isMenuOpen }
    });
    document.dispatchEvent(event);
  }

  // Public API methods
  public toggleMenu(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  public isMenuCurrentlyOpen(): boolean {
    return this.isMenuOpen;
  }

  public forceCloseMenu(): void {
    this.closeMenu();
  }

  public scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      this.smoothScrollToElement(targetElement);
    }
  }
}

// Initialize header functionality
export function initHeader(): void {
  new nasaThemeHeader();
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', initHeader);

// Handle Astro page transitions
document.addEventListener('astro:page-load', initHeader);